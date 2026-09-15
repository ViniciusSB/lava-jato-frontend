import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
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
    tipo: ''
  };

  inserirServico: boolean = false;
  excluirSelecionado: boolean = false;

  idServicoExclusao: number | null = null;

  constructor(private servicoService: ServicoService, private router: Router, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.servicoService.getAll();
    this.servicos = this.servicoService.servicos;
    if (this.usuarioLogado.urlFoto == null || this.usuarioLogado.urlFoto === "" || this.usuarioLogado.urlFoto === "null")
      this.urlFoto = this.usuarioLogado.tipoUsuario === "GERENTE" ? "gerente.png" : this.usuarioLogado.tipoUsuario === "FUNCIONARIO" ? "funcionario.png" : "admin.png";
    else
      this.urlFoto = this.usuarioLogado.urlFoto;
  }

  opcoes() {

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
    this.inserirServico = true;
    this.servicoSelecionado = null;
  }

  editar(s: Servico) {
    this.servicoSelecionado = { ...s };
    this.inserirServico = false;
  }

  fechar() {
    this.servicoSelecionado = null;
    this.inserirServico = false;
    this.novoServico = { id: 0, detalhes: '', precoBase: 0, tipo: '' };
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
          this.novoServico = { id: 0, detalhes: '', precoBase: 0, tipo: '' };
        },
        error: (err) => {
          console.error('Erro ao cadastrar serviço:', err);
          alert('Não foi possível cadastrar o serviço.');
        }
      })
    }
  }

  excluir(id: number) {
    this.excluirSelecionado = true;
    this.idServicoExclusao = id;
    this.fechar();
  }

  cancelarExclusao() {
    this.excluirSelecionado = false;
  }

  confirmarExclusao() {
    if (this.idServicoExclusao != null) {
      this.servicoService.delete(this.idServicoExclusao).subscribe({
        next: () => {
          this.idServicoExclusao = null;
          this.excluirSelecionado = false;
        },
        error: (err) => {
          console.error('Erro ao excluir o serviço:', err);
          alert('Não foi possível excluir o serviço. Tente novamente mais tarde.');
        }
      });
    }
  }

  fecharModal() {
    this.idServicoExclusao = null;
    this.excluirSelecionado = false;
  }

}
