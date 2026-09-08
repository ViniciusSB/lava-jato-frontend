import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdemServicoService } from '../../services/ordem-servico/ordem-servico';
import { DadosPaginacaoOrdemServico, OrdemServicoFiltros, OrdemServicoResponse } from '../../models/ordemServico';
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
import { Router } from '@angular/router';


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

  idUsuarioLogado = 0;
  tipoUsuarioLogado = "";

  userOpcoes = false;
  opcoesLowScreen = false;

  clienteControl = new FormControl();

  ordemServicoResponse: Observable<DadosPaginacaoOrdemServico> | undefined;
  ordemServicoSelecionada: OrdemServicoResponse | undefined;

  novaOrdem: OrdemServicoRequest = {
    ordemServicoId: 0,
    funcionarioId: null,
    clienteId: null,
    servicoId: null,
    veiculoId: null,
    status: ''
  };

  @ViewChild('novaOrdemForm') novaOrdemForm!: ElementRef;
  @ViewChild('editarOrdemForm') editarOrdemForm!: ElementRef;

  filtros: OrdemServicoFiltros = { tipo: 'cliente', termo: '', paginacao: 10, pagina: 1 };
  tiposFiltro = [{ "label": "Cliente", "id": "cliente" }, { "label": "Veículo", "id": "veiculo" }, { "label": "Funcionário", "id": "funcionario" }, { "label": "Serviço", "id": "servico" }, { "label": "Status", "id": "status" }];
  pesquisa = "";
  numUltimaPagina = 0;

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

  status = [{ id: 'EM_ANDAMENTO', label: 'Em andamento' }, { id: 'FINALIZADO', label: 'Finalizado' }];

  constructor(
    private ordemServicoService: OrdemServicoService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private veiculoService: VeiculoService,
    private servicoService: ServicoService,
    private router: Router) { }

  inserirOrdem: boolean = false;
  editarOrdem: boolean = false;

  excluirSelecionado: boolean = false;
  idOrdemExclusao: number | null = null;

  ngOnInit() {
    if (localStorage.getItem("token") == '') {
      this.router.navigate(["/login"]);
      return;
    }
    this.idUsuarioLogado = Number(localStorage.getItem("idUsuario"));
    this.tipoUsuarioLogado = localStorage.getItem("tipoUsuario")!;
    this.ordemServicoService.getAll(this.filtros);
    this.ordemServicoResponse = this.ordemServicoService.ordemServicos;
    this.ordemServicoResponse?.subscribe(responses => {
      this.numUltimaPagina = responses.totalPaginas;
    });
  }

  opcoes() {

  }

  fecharOpcoesLowScreen() {
    this.opcoesLowScreen = !this.opcoesLowScreen;
  }

  logout() {
    localStorage.setItem("token", "");
    localStorage.setItem("idUsuario", "");
    localStorage.setItem("tipoUsuaio", "");
    this.router.navigate(["/login"]);
  }

  menuOpcoesUsuario() {
    this.userOpcoes = !this.userOpcoes;
  }
  
  adicionar() {
    this.inserirOrdem = true;
    this.editarOrdem = false;
    this.limparElementosSelecionados();
    this.veiculos = undefined;
    this.popularListas();
    this.novaOrdem = {};
    setTimeout(() => {
      if (this.novaOrdemForm) {
        this.novaOrdemForm.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 50);
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
    if (this.clienteSelecionado != undefined && this.clienteSelecionado.id != 0) {
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

  pesquisar() {
    this.ordemServicoService.getAll(this.filtros);
    this.ordemServicoResponse = this.ordemServicoService.ordemServicos;
    this.numUltimaPagina = this.getNumUltimaPagina;
  }

  proxPagina() {
    this.filtros.pagina = Number(this.filtros.pagina) + 1;
    this.ordemServicoService.getAll(this.filtros);
    this.ordemServicoResponse = this.ordemServicoService.ordemServicos;
    this.numUltimaPagina = this.getNumUltimaPagina;
  }

  paginaAnterior() {
    this.filtros.pagina = Number(this.filtros.pagina) - 1;
    this.ordemServicoService.getAll(this.filtros);
    this.ordemServicoResponse = this.ordemServicoService.ordemServicos;
    this.numUltimaPagina = this.getNumUltimaPagina;
  }

  ultimaPagina() {
    let totalPaginas = 0;
    this.ordemServicoResponse?.subscribe(responses => {
      totalPaginas = responses.totalPaginas;
    });
    this.filtros.pagina = totalPaginas;
    this.ordemServicoService.getAll(this.filtros);
    this.ordemServicoResponse = this.ordemServicoService.ordemServicos;
    this.numUltimaPagina = this.getNumUltimaPagina;
  }

  primPagina() {
    this.filtros.pagina = 1;
    this.ordemServicoService.getAll(this.filtros);
    this.ordemServicoResponse = this.ordemServicoService.ordemServicos;
    this.numUltimaPagina = this.getNumUltimaPagina;
  }

  digitarPagina() {
    console.log("num digitado ", Number(this.filtros.pagina), " \n Ultima pag: ", this.getNumUltimaPagina);
    console.log(Number(this.filtros.pagina) <= 0);
    if (Number(this.filtros.pagina) <= this.getNumUltimaPagina) {
      if (Number(this.filtros.pagina) <= 0) {
        this.filtros.pagina = 1;
        this.ordemServicoService.getAll(this.filtros);
      }
      else {
        this.filtros.pagina = Number(this.filtros.pagina);
        this.ordemServicoService.getAll(this.filtros);
      }
    }
    else {
      this.filtros.pagina = this.getNumUltimaPagina;
      this.ordemServicoService.getAll(this.filtros);
    }
    this.numUltimaPagina = this.getNumUltimaPagina;
  }

  get getNumUltimaPagina(): number {
    let totalPaginas = 0;
    this.ordemServicoResponse?.subscribe(responses => {
      totalPaginas = responses.totalPaginas;
    });
    return totalPaginas;
  }

  mudarPaginacao(event: Event) {
    this.filtros.pagina = 1;
    const evento = event.target as HTMLSelectElement;
    this.filtros.paginacao = Number(evento.value);
    this.ordemServicoService.getAll(this.filtros);
    this.numUltimaPagina = this.getNumUltimaPagina;
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

    setTimeout(() => {
      if (this.editarOrdemForm) {
        this.editarOrdemForm.nativeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 50);

    this.popularListas();
  }

  atualizarVeiculos(cliente: any) {
    this.veiculoAdicionadoId = null;
    this.veiculoSelecionado = { id: 0, marca: '', modelo: '', cor: '', tipo: '', clienteId: 0, clienteNome: '' };
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
    this.fechar();
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

  fechar() {
    this.limparElementosAdicionados();
    this.limparElementosSelecionados();
    this.editarOrdem = false;
    this.inserirOrdem = false;
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
    this.novaOrdem.veiculoId = this.veiculoAdicionadoId;
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
