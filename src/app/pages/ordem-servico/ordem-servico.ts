import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdemServicoService } from '../../services/ordem-servico/ordem-servico';
import { OrdemServicoResponse } from '../../models/ordemServico';
import { OrdemServicoRequest } from '../../models/ordemServico';
import { Observable } from 'rxjs';
import { Servico } from '../../models/servico';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente/cliente';
import { UsuarioService } from '../../services/usuario/usuario';
import { VeiculoService } from '../../services/veiculo/veiculo';
import { Usuario } from '../../models/usuario';
import { Veiculo } from '../../models/veiculo';
import { ServicoService } from '../../services/servico/servico';
import { NormalizarEnum } from '../../util/normalizar-enum';


@Component({
  selector: 'app-ordem-servico',
  standalone: true,
  imports: [CommonModule, FormsModule, CommonModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule,
    NormalizarEnum,
    NgSelectModule],
  templateUrl: './ordem-servico.html',
  styleUrl: './ordem-servico.css',
})
export class OrdemServicoComponent {

  clienteControl = new FormControl();

  ordemServicoResponse: Observable<OrdemServicoResponse[]> | undefined;
  ordemServicoSelecionada: OrdemServicoResponse | undefined;

  novaOrdem: OrdemServicoRequest = {
    ordemServicoId: 0,
    funcionarioId: null,
    clienteId: null,
    servicoId: null,
    veiculoId: null,
    status: ''
  };

  funcionarios: Observable<Usuario[]> | undefined;
  funcionarioSelecionado: Usuario = { id: 0, nome: '', email: '', tipo: '' };
  funcionarioAdicionadoId: number | null = null;

  clientes: Observable<Cliente[]> | undefined;
  clienteSelecionado: Cliente = { id: 0, nome: '', celular: '', fidelidade: 0, veiculos: [] };
  clienteAdicionadoId: number | null = null;

  veiculos: Observable<Veiculo[]> | undefined;
  veiculoSelecionado: Veiculo = { id: 0, marca: '', modelo: '', cor: '', tipo: '', clienteId: 0, clienteNome: '' };
  veiculoAdicionadoId: number | null = null;

  servicos: Observable<Servico[]> | undefined;
  servicoSelecionado: Servico = { id: 0, detalhes: '', precoBase: 0, tipo: '' };
  servicoAdicionadoId: number | null = null;

  revelarModalFuncionario: boolean = false;
  revelarModalCliente: boolean = false;
  revelarModalVeiculo: boolean = false;
  revelarModalServico: boolean = false;

  constructor(
    private ordemServicoService: OrdemServicoService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private veiculoService: VeiculoService,
    private servicoService: ServicoService) { }

  inserirOrdem: boolean = false;
  editarOrdem: boolean = false;

  excluirSelecionado: boolean = false;
  idOrdemExclusao: number | null = null;

  ngOnInit() {
    this.ordemServicoService.getAll();
    this.ordemServicoResponse = this.ordemServicoService.ordemServicos;
  }

  adicionar() {
    this.inserirOrdem = true;
    this.editarOrdem = false;
    this.limparElementosSelecionados();
    this.popularListas();
    this.novaOrdem = {};
  }

  addFuncionario() {
    if (this.funcionarios == undefined) {
      this.usuarioService.getAll();
      this.funcionarios = this.usuarioService.usuarios;
    }
  }

  addCliente() {
    if (this.clientes == undefined) {
      this.clienteService.getAll();
      this.clientes = this.clienteService.clientes;
    }
  }

  addVeiculo() {
    if (this.clienteSelecionado != undefined) {
      this.veiculoService.obterVeiculosPorClienteId(this.clienteSelecionado.id);
      this.veiculos = this.veiculoService.veiculos;
    }
  }

  addServico() {
    if (this.servicos == undefined) {
      this.servicoService.getAll();
      this.servicos = this.servicoService.servicos;
    }
  }

  fecharModal() {
    this.excluirSelecionado = false;
  }

  salvar() {
    if (this.inserirOrdem) {
      this.AdicionarOrdemServico();
      this.ordemServicoService.create(this.novaOrdem).subscribe({
        next: () => {
          this.novaOrdem = {};
          this.inserirOrdem = false;
          this.limparElementosAdicionados();
        },
        error: (err) => {
          console.error('Erro ao gerar a ordem:', err);
          alert('Não foi possível gerar a ordem.');
        }
      });
    }
    else if (this.editarOrdem) {
      this.atualizarOrdemServico();
      this.ordemServicoService.update(this.novaOrdem).subscribe({
        next: () => {
          this.novaOrdem = {};
          this.editarOrdem = false;
          this.limparElementosSelecionados();
        },
        error: (err) => {
          console.error('Erro ao editar a ordem:', err);
          alert('Não foi possível editar a ordem.');
        }
      });
    }
  }

  editar(os: OrdemServicoResponse) {
    this.editarOrdem = true;
    this.inserirOrdem = false;
    this.novaOrdem.ordemServicoId = os.id;
    this.novaOrdem.status = os.status;

    if (os.funcionario)
      this.funcionarioSelecionado = os.funcionario;
    this.novaOrdem.funcionarioId = os.funcionario?.id;

    if (os.cliente)
      this.clienteSelecionado = os.cliente;
    this.novaOrdem.clienteId = os.cliente?.id;

    if (os.servico)
      this.servicoSelecionado = os.servico;
    this.novaOrdem.servicoId = os.servico?.id;

    if (os.veiculo)
      this.veiculoSelecionado = os.veiculo;
    this.novaOrdem.veiculoId = os.veiculo?.id;

    this.popularListas();
  }

  atualizarVeiculos(cliente: any) {
    this.veiculoAdicionadoId = null;
    this.veiculos = undefined;

    if (!cliente) {
      return;
    }

    const idCliente = typeof cliente === 'object' ? cliente.id : cliente;

    if (!idCliente) {
      return;
    }

    this.veiculoService.obterVeiculosPorClienteId(idCliente);
    this.veiculos = this.veiculoService.veiculos;
  }

  excluir(id: number) {
    this.excluirSelecionado = true;
    this.idOrdemExclusao = id;
  }

  cancelarExclusao() {
    this.excluirSelecionado = false;
  }

  confirmarExclusao() {
    if (this.idOrdemExclusao) {
      this.ordemServicoService.delete(this.idOrdemExclusao).subscribe({
        next: () => {
          this.idOrdemExclusao = null;
          this.excluirSelecionado = false;
        },
        error: (err) => {
          console.error('Erro ao excluir a ordem:', err);
          alert('Não foi possível excluir a ordem. Tente novamente mais tarde.');
        }
      });
    }
  }

  atualizarOrdemServico() {
    this.novaOrdem.servicoId = this.servicoSelecionado.id;
    this.novaOrdem.clienteId = this.clienteSelecionado.id;
    this.novaOrdem.funcionarioId = this.funcionarioSelecionado.id;
    this.novaOrdem.veiculoId = this.veiculoSelecionado.id;
  }

  AdicionarOrdemServico() {
    this.novaOrdem.servicoId = this.servicoAdicionadoId;
    this.novaOrdem.clienteId = this.clienteAdicionadoId;
    this.novaOrdem.funcionarioId = this.funcionarioAdicionadoId;
    this.novaOrdem.veiculoId = this.servicoAdicionadoId;
  }

  limparElementosSelecionados() {
    this.servicoSelecionado = { id: 0, detalhes: '', precoBase: 0, tipo: '' };
    this.veiculoSelecionado = { id: 0, marca: '', modelo: '', cor: '', tipo: '', clienteId: 0, clienteNome: '' };
    this.clienteSelecionado = { id: 0, nome: '', celular: '', fidelidade: 0, veiculos: [] };
    this.funcionarioSelecionado = { id: 0, nome: '', email: '', tipo: '' };
  }

  limparElementosAdicionados() {
    this.clienteAdicionadoId = null;
    this.veiculoAdicionadoId = null;
    this.funcionarioAdicionadoId = null;
    this.servicoAdicionadoId = null;
  }

  popularListas() {
    this.addCliente();
    this.addFuncionario();
    this.addServico();
    this.addVeiculo();
  }

}
