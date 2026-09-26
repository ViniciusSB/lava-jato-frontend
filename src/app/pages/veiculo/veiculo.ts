import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Veiculo } from '../../models/veiculo';
import { FormsModule } from '@angular/forms';
import { VeiculoService } from '../../services/veiculo/veiculo';
import { PrimCarcMaius } from '../../_pipes/primCaracMaius';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente/cliente';
import { Router, RouterModule } from '@angular/router';
import { AuthUtil } from '../../util/auth-util';
import { UsuarioLogado } from '../../models/usuario';

@Component({
  selector: 'app-veiculo',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimCarcMaius, RouterModule],
  templateUrl: './veiculo.html',
  styleUrl: './veiculo.css',
})
export class VeiculoComponent {

  usuarioLogado: UsuarioLogado = AuthUtil.obterDadosUsuarioLogado();
  urlFoto: string = "";

  userOpcoes = false;
  opcoesLowScreen = false;

  veiculos: Observable<Veiculo[]> | undefined;
  veiculoSelecionado: Veiculo | undefined;
  inserirVeiculo: boolean = false;
  novoVeiculo: Veiculo = {
    marca: '',
    modelo: '',
    cor: '',
    tipo: '',
    placa: '',
    clienteId: 0,
    status: '',
    clienteNome: ''
  }

  clientes: Observable<Cliente[]> | undefined;

  ativarSelecionado: boolean = false;
  desativarSelecionado: boolean = false;

  mensagemErro = "";
  mensagemSucesso = "";

  idVeiculoAtivacao: number | null = null;
  idVeiculoDesativacao: number | null = null;

  tipoSecionado: string = '';
  tipos: string[] = ['MOTO', 'CARRO', 'CAMINHONETE', 'CAMINHAO'];

  filtrosVeiculo = [{ "id": "ativo", "label": "Veículos ativos" }, { "id": "inativo", "label": "Veículos inativos" }];
  filtroSelecionadoVeiculo = "ativo";

  constructor(private veiculoService: VeiculoService, private clienteService: ClienteService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getVeiculosApi();
    if (this.usuarioLogado.urlFoto == null || this.usuarioLogado.urlFoto === "" || this.usuarioLogado.urlFoto === "null")
      this.urlFoto = this.usuarioLogado.tipoUsuario === "GERENTE" ? "gerente.png" : this.usuarioLogado.tipoUsuario === "FUNCIONARIO" ? "funcionario.png" : "admin.png";
    else
      this.urlFoto = this.usuarioLogado.urlFoto;
  }

  getVeiculosApi() {
    this.veiculoService.getAll();
    this.veiculos = this.veiculoService.veiculos;
  }

  getVeiculosPeloFiltro() {
    if (this.filtroSelecionadoVeiculo === 'ativo') {
      return this.veiculos?.pipe(
        map(veiculos => veiculos.filter(v => v.status === 'ativo'))
      )
    } else {
      return this.veiculos?.pipe(
        map(veiculos => veiculos.filter(v => v.status === 'inativo'))
      )
    }
  }

  fechar() {
    this.veiculoSelecionado = undefined;
    this.inserirVeiculo = false;
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
    this.mensagemErro = "";
    if (this.clientes == undefined) {
      this.clienteService.getAll();
      this.clientes = this.clienteService.clientes;
    }
    this.inserirVeiculo = true;
    this.veiculoSelecionado = undefined;
  }

  editar(v: Veiculo) {
    this.mensagemErro = "";
    if (this.clientes == undefined) {
      this.clienteService.getAll();
      this.clientes = this.clienteService.clientes;
    }
    this.veiculoSelecionado = { ...v };
    this.inserirVeiculo = false;
  }

  salvar() {
    if (this.veiculoSelecionado) {
      this.veiculoService.update(this.veiculoSelecionado).subscribe({
        next: () => {
          this.veiculoSelecionado = undefined;
        },
        error: (err) => {
          console.error('Erro ao atualizar veículo:', err);
          this.mensagemErro = err.error.mensagem;
          this.cdr.markForCheck();
        }
      });
    } else if (this.inserirVeiculo) {
      this.veiculoService.create(this.novoVeiculo).subscribe({
        next: () => {
          this.novoVeiculo = { marca: '', modelo: '', cor: '', tipo: '', placa: '', clienteId: 0, status: '', clienteNome: '' };
          this.inserirVeiculo = false;
        },
        error: (err) => {
          console.error('Erro ao cadastrar veículo:', err);
          this.mensagemErro = err.error.mensagem;
          this.cdr.markForCheck();
        }
      })
    }
  }

  fecharModal() {
    this.idVeiculoDesativacao = null;
    this.desativarSelecionado = false;
  }
  
  fecharMsg() {
    this.mensagemErro = "";
    this.mensagemSucesso = "";
  }

  desativar(id: number) {
    this.fecharMsg();
    this.desativarSelecionado = true;
    this.idVeiculoDesativacao = id;
    this.fechar();
  }

  cancelarDesativacao() {
    this.desativarSelecionado = false;
  }

  confirmarDesativacao() {
    if (this.idVeiculoDesativacao != null) {
      this.veiculoService.desativar(this.idVeiculoDesativacao).subscribe({
        next: (response) => {
          this.idVeiculoDesativacao = null;
          this.desativarSelecionado = false;
          this.mensagemSucesso = response.mensagem;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log('Erro ao desativar o veículo', err);
          this.mensagemErro = err.error.mensagem;
          this.cdr.markForCheck();
        }
      });
    }
  }

  ativar(id: number) {
    this.fecharMsg();
    this.ativarSelecionado = true;
    this.idVeiculoAtivacao = id;
    this.fechar();
  }

  cancelarAtivacao() {
    this.ativarSelecionado = false;
  }

  confirmarAtivacao() {
    if (this.idVeiculoAtivacao != null) {
      this.veiculoService.ativar(this.idVeiculoAtivacao).subscribe({
        next: (response) => {
          this.idVeiculoAtivacao = null;
          this.ativarSelecionado = false;
          this.mensagemSucesso = response.mensagem;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.log('Erro ao ativar o veículo', err);
          this.mensagemErro = err.error.mensagem;
          this.cdr.markForCheck();
        }
      });
    }
  }

}
