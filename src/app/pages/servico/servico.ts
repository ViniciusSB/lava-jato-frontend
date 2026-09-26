import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { Servico } from '../../models/servico';
import { ServicoService } from '../../services/servico/servico';
import { Router, RouterModule } from '@angular/router';
import { AuthUtil } from '../../util/auth-util';
import { UsuarioLogado } from '../../models/usuario';


@Component({
  selector: 'app-servico',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './servico.html',
  styleUrl: './servico.css',
})
export class ServicoComponent {

  usuarioLogado: UsuarioLogado = AuthUtil.obterDadosUsuarioLogado();
  urlFoto: string = "";

  userOpcoes = false;
  opcoesLowScreen = false;

  servicos: Observable<Servico[]> | undefined;

  servicoSelecionado: Servico | null = null;
  novoServico: Servico = {
    id: 0,
    detalhes: '',
    precoBase: 0,
    tipo: '', 
    status: ''
  };

  filtros = [{ "id": "ativo", "label": "Serviços ativos" }, { "id": "inativo", "label": "Serviços inativos" }];
  filtroSelecionado = "ativo";

  mensagemErro = "";
  mensagemSucesso = "";

  inserirServico: boolean = false;
  ativarSelecionado: boolean = false;
  desativarSelecionado: boolean = false;

  idServicoDesativacao: number | null = null;
  idServicoAtivacao: number | null = null;

  constructor(private servicoService: ServicoService, private router: Router, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.obterServicosApi();
    if (this.usuarioLogado.urlFoto == null || this.usuarioLogado.urlFoto === "" || this.usuarioLogado.urlFoto === "null")
      this.urlFoto = this.usuarioLogado.tipoUsuario === "GERENTE" ? "gerente.png" : this.usuarioLogado.tipoUsuario === "FUNCIONARIO" ? "funcionario.png" : "admin.png";
    else
      this.urlFoto = this.usuarioLogado.urlFoto;
  }

  obterServicosApi() {
    this.servicoService.getAll();
    this.servicos = this.servicoService.servicos;
  }

  obterServicosPeloFiltro() {
    if (this.filtroSelecionado === 'ativo') {
      return this.servicos?.pipe(
        map(servicos => servicos.filter(s => s.status === 'ativo'))
      );
    } else {
      return this.servicos?.pipe(
        map(servicos => servicos.filter(s => s.status === 'inativo'))
      );
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
    this.mensagemErro = "";
    this.inserirServico = true;
    this.servicoSelecionado = null;
  }

  editar(s: Servico) {
    this.mensagemErro = "";
    this.servicoSelecionado = { ...s };
    this.inserirServico = false;
  }

  fechar() {
    this.servicoSelecionado = null;
    this.inserirServico = false;
    this.novoServico = { id: 0, detalhes: '', precoBase: 0, tipo: '', status: '' };
  }

  salvar() {
    if (this.servicoSelecionado) {
      this.servicoService.update(this.servicoSelecionado).subscribe({
        next: () => {
          this.servicoSelecionado = null;
          this.servicoSelecionado = null;
        },
        error: (err) => {
          console.error('Erro ao atualizar o serviço:', err);
          alert('Não foi possível atualizar o serviço.');
        }
      });
    } else if (this.inserirServico) {
      this.servicoService.create(this.novoServico).subscribe({
        next: () => {
          this.inserirServico = false;
          this.novoServico = { id: 0, detalhes: '', precoBase: 0, tipo: '', status: '' };
        },
        error: (err) => {
          console.error('Erro ao cadastrar serviço:', err);
          alert('Não foi possível cadastrar o serviço.');
        }
      })
    }
  }

  desativar(id: number) {
    this.fecharMsg();
    this.desativarSelecionado = true;
    this.idServicoDesativacao = id;
    this.fechar();
  }

  cancelarDesativacao() {
    this.desativarSelecionado = false;
  }

  confirmarDesativacao() {
    if (this.idServicoDesativacao != null) {
      this.servicoService.desativar(this.idServicoDesativacao).subscribe({
        next: (response) => {
          this.idServicoDesativacao = null;
          this.desativarSelecionado = false;
          this.mensagemSucesso = response.mensagem;
        },
        error: (err) => {
          this.mensagemErro = err.error.mensagem;
          this.cdr.markForCheck();
        }
      });
    }
  }

  ativar(id: number) {
    this.fecharMsg();
    this.ativarSelecionado = true;
    this.idServicoAtivacao = id;
    this.fechar();
  }

  cancelarAtivacao() {
    this.ativarSelecionado = false;
  }

  confirmarAtivacao() {
    if (this.idServicoAtivacao != null) {
      this.servicoService.ativar(this.idServicoAtivacao).subscribe({
        next: (response) => {
          this.idServicoAtivacao = null;
          this.ativarSelecionado = false;
          this.mensagemSucesso = response.mensagem;
        },
        error: (err) => {
          this.mensagemErro = err.error.mensagem;
          this.cdr.markForCheck();
        }
      });
    }
  }



  fecharModal() {
    this.idServicoDesativacao = null;
    this.desativarSelecionado = false;
  }

  fecharMsg() {
    this.mensagemErro = "";
    this.mensagemSucesso = "";
  }

}
