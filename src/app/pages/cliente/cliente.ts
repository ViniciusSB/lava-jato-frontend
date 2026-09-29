import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente/cliente';
import { FormsModule } from '@angular/forms';
import { TelefoneMaskDirective } from '../../util/telefone-mak';
import { VeiculoService } from '../../services/veiculo/veiculo';
import { Veiculo } from '../../models/veiculo';
import { PrimCarcMaius } from '../../_pipes/primCaracMaius';
import { Route, Router, RouterModule } from '@angular/router';
import { AuthUtil } from '../../util/auth-util';
import { UsuarioLogado } from '../../models/usuario';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, TelefoneMaskDirective, PrimCarcMaius, RouterModule],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
})
export class ClienteComponent {

  listaClientes: Cliente[] = [];

  clienteSelecionado: Cliente | undefined;
  inserirCliente: boolean = false;
  novoCliente: Cliente = {
    nome: '', celular: '', fidelidade: 0, status: '',
    id: 0, veiculos: []
  }

  usuarioLogado: UsuarioLogado = AuthUtil.obterDadosUsuarioLogado();
  urlFoto: string = "";

  userOpcoes = false;
  opcoesLowScreen = false;

  revelarVeiculosCliente: boolean = false;

  veiculosCliente: Observable<Veiculo[]> | undefined;

  inserirVeiculo: boolean = false;
  editarVeiculo: boolean = false;
  novoVeiculo: Veiculo = { marca: '', modelo: '', cor: '', tipo: '', placa: '', clienteId: 0, status: '', clienteNome: '' };
  tipos = [{ id: 'MOTO', label: 'Moto' }, { id: 'CARRO', label: 'Carro' }, { id: 'CAMINHONETE', label: 'Caminhonete' }, { id: 'CAMINHAO', label: 'Caminhão' }];

  clientesFiltrados: Observable<Cliente[]> | undefined;

  filtros = [{ "id": "ativo", "label": "Clientes ativos" }, { "id": "inativo", "label": "Clientes inativos" }];
  filtrosVeiculo = [{ "id": "ativo", "label": "Veículos ativos" }, { "id": "inativo", "label": "Veículos inativos" }];

  filtroSelecionado = "ativo";
  filtroSelecionadoVeiculo = "ativo";

  termoFiltro = "";

  mensagemErro = "";
  mensagemErroVeiculo = "";
  mensagemSucesso = "";
  mensagemSucessoVeiculo = "";

  desativarSelecionado: boolean = false;
  ativarSelecionado: boolean = false;

  desativarVeiculoSelecionado: boolean = false;
  ativarVeiculoSelecionado: boolean = false;

  idClienteDesativar: number | null = null;
  idClienteAtivar: number | null = null;
  idVeiculoDesativacao: number | null = null;
  idVeiculoAtivacao: number | null = null;

  constructor(
    private clienteService: ClienteService,
    private veiculoService: VeiculoService,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.clienteService.getAll();
    this.obterClientesApi();
    if (this.usuarioLogado.urlFoto == null || this.usuarioLogado.urlFoto === "" || this.usuarioLogado.urlFoto === "null")
      this.urlFoto = this.usuarioLogado.tipoUsuario === "GERENTE" ? "gerente.png" : this.usuarioLogado.tipoUsuario === "FUNCIONARIO" ? "funcionario.png" : "admin.png";
    else
      this.urlFoto = this.usuarioLogado.urlFoto;
  }

  desativar(id: number) {
    this.desativarSelecionado = true;
    this.idClienteDesativar = id;
    this.fechar();
  }

  cancelarDesativacao() {
    this.desativarSelecionado = false;
  }

  confirmarDesativacao() {
    if (this.idClienteDesativar != null) {
      this.clienteService.desativar(this.idClienteDesativar).subscribe({
        next: (response) => {
          this.idClienteDesativar = null;
          this.desativarSelecionado = false;
          this.termoFiltro = "";
          this.mensagemSucesso = response.mensagem;
          this.obterClientesApi();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log('Erro ao deletar o cliente', err);
          this.mensagemErro = err.error.mensagem;
          this.cdr.markForCheck();
        }
      });
    }
  }

  ativar(id: number) {
    this.ativarSelecionado = true;
    this.idClienteAtivar = id;
    this.fechar();
  }

  cancelarAtivacao() {
    this.ativarSelecionado = false;
  }

  confirmarAtivacao() {
    if (this.idClienteAtivar != null) {
      this.clienteService.ativar(this.idClienteAtivar).subscribe({
        next: (response) => {
          this.idClienteAtivar = null;
          this.ativarSelecionado = false;
          this.termoFiltro = "";
          this.mensagemSucesso = response.mensagem;
          this.obterClientesApi();
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log('Erro ao ativar o cliente', err);
          this.mensagemErro = err.error.mensagem;
          this.cdr.markForCheck();
        }
      });
    }
  }

  fecharOpcoesLowScreen() {
    this.opcoesLowScreen = !this.opcoesLowScreen;
  }

  logout() {
    AuthUtil.limparDadosLocaisUsuario();
    this.cdr.markForCheck();
    this.router.navigate(["/login"]);
  }

  menuOpcoesUsuario() {
    this.userOpcoes = !this.userOpcoes;
  }

  adicionar() {
    this.inserirCliente = true;
    this.clienteSelecionado = undefined;
    this.revelarVeiculosCliente = false;
  }

  editar(c: Cliente) {
    this.clienteSelecionado = { ...c };
    this.inserirCliente = false;
    this.revelarVeiculosCliente = false;
  }

  salvar() {
    if (this.clienteSelecionado) {
      if (this.clienteSelecionado.celular.length < 14) {
        this.mensagemErro = "O celular deve ter exatamente 11 dígitos.";
        return;
      }
      this.clienteService.update(this.clienteSelecionado).subscribe({
        next: () => {
          this.clienteSelecionado = undefined;
          this.obterClientesApi();
        },
        error: (err) => {
          this.mensagemErro = "Não foi possível atualizar o cliente.";
        }
      });
    }
    else if (this.inserirCliente) {
      if (this.novoCliente.celular.length < 14) {
        this.mensagemErro = "O celular deve ter exatamente 11 dígitos.";
        return;
      }
      this.clienteService.create(this.novoCliente).subscribe({
        next: () => {
          this.novoCliente = { id: 0, nome: '', celular: '', fidelidade: 0, status: '', veiculos: [] };
          this.inserirCliente = false;
          this.obterClientesApi();
        },
        error: (err) => {
          this.mensagemErro = "Não foi possível cadastrar o cliente.";
        }
      });
    }
  }

  obterClientesApi() {
    this.clienteService.listarClientes().subscribe(clientes => {
      this.listaClientes = clientes;
      this.cdr.markForCheck();
    });
  }

  obterClientes(): Cliente[] {
    if (this.filtroSelecionado === 'ativo') {
      if (this.termoFiltro !== '') {
        return this.listaClientes.filter(c => c.status === 'ativo' && c.nome.toLocaleLowerCase().includes(this.termoFiltro.toLocaleLowerCase()));
      }
      return this.listaClientes.filter(c => c.status === 'ativo');
    } else {
      if (this.termoFiltro !== '') {
        return this.listaClientes.filter(c => c.status === 'inativo' && c.nome.toLocaleLowerCase().includes(this.termoFiltro.toLocaleLowerCase()));
      }
      return this.listaClientes.filter(c => c.status === 'inativo');
    }
  }

  exibirVeiculos(c: Cliente) {
    this.clienteSelecionado = c;
    this.inserirCliente = false;
    this.revelarVeiculosCliente = true;
    this.obterVeiculosDoClienteApi(c);
  }

  obterVeiculosDoClienteApi(c: Cliente) {
    this.veiculoService.obterVeiculosPorClienteId(c.id);
    this.veiculosCliente = this.veiculoService.veiculos;
  }

  obterVeiculosDoCliente() {
    if (this.filtroSelecionadoVeiculo === 'ativo' && this.veiculosCliente != undefined) 
      return this.veiculosCliente?.pipe(
        map(veiculos => veiculos.filter(v => v.status === 'ativo'))
      )
    else 
      return this.veiculosCliente?.pipe(
        map(veiculos => veiculos.filter(v => v.status === 'inativo'))
      )
  }

  obterQtdVeiculosAtivosDoCliente(cliente: Cliente):number {
    return cliente.veiculos.filter(veiculo => veiculo.status === 'ativo').length;
  }

  fechar() {
    this.clienteSelecionado = undefined;
    this.inserirCliente = false;
    this.mensagemErro = "";
    this.mensagemSucesso = "";
  }

  fecharModal() {
    this.revelarVeiculosCliente = false;
    this.clienteSelecionado = undefined;
    this.novoVeiculo = { marca: '', modelo: '', cor: '', tipo: '', placa: '', clienteId: 0, status: '', clienteNome: '' };
    this.limparCamposVeiculo();
    this.limparMensagensVeiculo();
    this.obterClientesApi();
    this.filtroSelecionadoVeiculo = 'ativo';
  }

  botaoAdicionarVeiculo() {
    this.inserirVeiculo = true;
    this.editarVeiculo = false;
    this.novoVeiculo.clienteId = this.clienteSelecionado?.id ?? 0;
  }

  botaoEditarVeiculo(v: Veiculo) {
    this.inserirVeiculo = false;
    this.editarVeiculo = true;
    this.novoVeiculo = { ...v };
  }

  salvarVeiculo() {
    if (this.inserirVeiculo) {
      this.veiculoService.criarEListarClienteSelecionado(this.novoVeiculo, this.clienteSelecionado?.id!).subscribe({
        next: () => {
          this.novoVeiculo = { marca: '', modelo: '', cor: '', tipo: '', placa: '', clienteId: 0, status: '', clienteNome: '' };
          this.inserirVeiculo = false;
        },
        error: (err) => {
          console.error('Erro ao cadastrar veículo:', err);
          alert('Não foi possível cadastrar o veículo.');
        }
      });
    } else {
      this.veiculoService.atualizarEListarClienteSelecionado(this.novoVeiculo, this.clienteSelecionado?.id!).subscribe({
        next: () => {
          this.novoVeiculo = { marca: '', modelo: '', cor: '', tipo: '', placa: '', clienteId: 0, status: '', clienteNome: '' };
          this.editarVeiculo = false;
        },
        error: (err) => {
          console.error('Erro ao editar veículo:', err);
          alert('Não foi possível editar o veículo.');
        }
      });
    }
  }

  desativarVeiculo(idVeiculo: number) {
    this.desativarVeiculoSelecionado = true;
    this.limparCamposVeiculo();
    this.idVeiculoDesativacao = idVeiculo;
  }

  cancelarDesativacaoVeiculo() {
    this.desativarVeiculoSelecionado = false;
  }

  confirmarDesativacaoVeiculo() {
    if (this.idVeiculoDesativacao != null) {
      this.veiculoService.desativarVeiculoTelaCliente(this.idVeiculoDesativacao, this.clienteSelecionado?.id!).subscribe({
        next: (response) => {
          this.idVeiculoDesativacao = null;
          this.desativarVeiculoSelecionado = false;
          this.mensagemSucessoVeiculo = response.mensagem;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log(err);
          this.mensagemErroVeiculo = err.error.mensagem;
        }
      });
    }
  }

  ativarVeiculo(idVeiculo: number) {
    this.ativarVeiculoSelecionado = true;
    this.limparCamposVeiculo();
    this.idVeiculoAtivacao = idVeiculo;
  }

  cancelarAtivacaoVeiculo() {
    this.ativarVeiculoSelecionado = false;
  }

  confirmarAtivacaoVeiculo() {
    if (this.idVeiculoAtivacao != null) {
      this.veiculoService.ativarVeiculoTelaCliente(this.idVeiculoAtivacao, this.clienteSelecionado?.id!).subscribe({
        next: (response) => {
          this.idVeiculoAtivacao = null;
          this.ativarVeiculoSelecionado = false;
          this.mensagemSucessoVeiculo = response.mensagem;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.mensagemErroVeiculo = err.error.mensagem;
          this.ativarVeiculoSelecionado = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  fecharAdicionarVeiculo() {
    this.limparCamposVeiculo();
  }

  fecharEditarVeiculo() {
    this.limparCamposVeiculo();
  }

  limparCamposVeiculo() {
    this.inserirVeiculo = false;
    this.editarVeiculo = false;
  }

  limparMensagens() {
    this.mensagemErro = "";
    this.mensagemSucesso = "";
  }

  limparMensagensVeiculo() {
    this.mensagemErroVeiculo = "";
    this.mensagemSucessoVeiculo = "";
  }
}
