import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { OrdemServicoService } from '../../services/ordem-servico/ordem-servico';
import { OrdemServicoResponse } from '../../models/ordemServico';
import { OrdemServicoRequest } from '../../models/ordemServico';
import { filter, map, Observable } from 'rxjs';
import { PrimCarcMaius } from '../../_pipes/primCaracMaius';
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


@Component({
  selector: 'app-ordem-servico',
  standalone: true,
  imports: [CommonModule, FormsModule, CommonModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatOptionModule],
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
  funcionarioSelecionado: Usuario | null = null;

  clientes: Observable<Cliente[]> | undefined;
  clienteSelecionado: Cliente | null = null;

  veiculos: Observable<Veiculo[]> | undefined;
  veiculoSelecionado: Veiculo | null = null;

  servicos: Observable<Servico[]> | undefined;
  servicoSelecionado: Servico | null = null;

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
    this.novaOrdem = {};
  }

  addFuncionario() {
    this.revelarModalFuncionario = true;
    this.revelarModalVeiculo = false;
    this.revelarModalCliente = false;
    this.revelarModalServico = false;
    if (this.funcionarios == null) {
      this.usuarioService.getAll();
      this.funcionarios = this.usuarioService.usuarios;
    }
  }

  selecionarFuncionario(user: Usuario) {
    this.novaOrdem.funcionarioId = user.id;
    this.funcionarioSelecionado = user;
  }

  addCliente() {
    this.revelarModalCliente = true;
    this.revelarModalFuncionario = false;
    this.revelarModalVeiculo = false;
    this.revelarModalServico = false;
    if (this.clientes == null) {
      this.clienteService.getAll();
      this.clientes = this.clienteService.clientes;
    }
  }

  selecionarCliente(cliente: Cliente) {
    this.novaOrdem.clienteId = cliente.id;
    this.clienteSelecionado = cliente;
    this.veiculoSelecionado = null;
    this.novaOrdem.veiculoId = null;
  }

  addVeiculo() {
    if (this.clienteSelecionado == null) {
      alert('Selecione um cliente antes de selecionar um veículo');
      return;
    }
    this.revelarModalVeiculo = true;
    this.revelarModalCliente = false;
    this.revelarModalFuncionario = false;
    this.revelarModalServico = false;
    this.veiculoService.obterVeiculosPorClienteId(this.clienteSelecionado.id);
    this.veiculos = this.veiculoService.veiculos;
  }

  selecionarVeiculo(veiculo: Veiculo) {
    this.novaOrdem.veiculoId = veiculo.id;
    this.veiculoSelecionado = veiculo;
  }

  addServico() {
    if (this.servicos == null) {
      this.servicoService.getAll();
      this.servicos = this.servicoService.servicos;
    }
    this.revelarModalServico = true;
    this.revelarModalVeiculo = false;
    this.revelarModalCliente = false;
    this.revelarModalFuncionario = false;
    this.servicoService.getAll();
    this.servicos = this.servicoService.servicos;
  }

  selecionarServico(s: Servico) {
    this.novaOrdem.servicoId = s.id;
    this.servicoSelecionado = s;
  }

  fecharModal() {
    this.revelarModalFuncionario = false;
    this.revelarModalCliente = false;
    this.revelarModalVeiculo = false;
    this.revelarModalServico = false;
  }

  salvar() {
    if (this.inserirOrdem) {
      this.ordemServicoService.create(this.novaOrdem).subscribe({
        next: () => {
          this.novaOrdem = {};
          this.inserirOrdem = false;
          this.limparElementosSelecionados();
        },
        error: (err) => {
          console.error('Erro ao gerar a ordem:', err);
          alert('Não foi possível gerar a ordem.');
        }
      });
    } 
    else if (this.editarOrdem) {
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
    
    this.funcionarioSelecionado = os.funcionario ?? null;
    this.novaOrdem.funcionarioId = os.funcionario?.id;

    this.clienteSelecionado = os.cliente ?? null;
    this.novaOrdem.clienteId = os.cliente?.id;

    this.servicoSelecionado = os.servico ?? null;
    this.novaOrdem.servicoId = os.servico?.id;

    this.veiculoSelecionado = os.veiculo ?? null;
    this.novaOrdem.veiculoId = os.veiculo?.id;
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

  limparElementosSelecionados() {
    this.servicoSelecionado = null;
        this.veiculoSelecionado = null;
        this.clienteSelecionado = null;
        this.funcionarioSelecionado = null;
  }

}
