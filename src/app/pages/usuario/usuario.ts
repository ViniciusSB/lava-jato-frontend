import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario';
import { Usuario, UsuarioLogado } from '../../models/usuario';
import { Observable } from 'rxjs';
import { PrimCarcMaius } from '../../_pipes/primCaracMaius';
import { Router, RouterModule } from '@angular/router';
import { AuthUtil } from '../../util/auth-util';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimCarcMaius, RouterModule],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
})
export class UsuarioComponent {

  usuarioLogado: UsuarioLogado = AuthUtil.obterDadosUsuarioLogado();
  urlFoto: string = "";

  userOpcoes = false;
  opcoesLowScreen = false;

  filtros = [{ "id": "ativo", "label": "Usuários ativos" }, { "id": "inativo", "label": "Usuários inativos" }];

  filtroSelecionado = "ativo";

  usuarios!: Observable<Usuario[]>;
  tipos: string[] = ['ADM', 'GERENTE', 'FUNCIONARIO']

  alternarStatusUsuario: boolean = false;

  idUsuarioTrocaStatus: number | null = null;

  mensagemErro = "";
  mensagemSucesso = "";

  constructor(private usuarioService: UsuarioService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.usuarioLogado.tipoUsuario === 'FUNCIONARIO') {
      this.router.navigate(["/"]);
      return;
    }
    this.usuarioService.getAll();
    this.usuarios = this.usuarioService.usuarios;
    console.log(this.usuarios);
    if (this.usuarioLogado.urlFoto == null || this.usuarioLogado.urlFoto === "" || this.usuarioLogado.urlFoto === "null")
      this.urlFoto = this.usuarioLogado.tipoUsuario === "GERENTE" ? "gerente.png" : this.usuarioLogado.tipoUsuario === "FUNCIONARIO" ? "funcionario.png" : "admin.png";
    else
      this.urlFoto = this.usuarioLogado.urlFoto;
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

  fecharModal() {
    this.idUsuarioTrocaStatus = null;
    this.alternarStatusUsuario = false;
  }

  filtrarUsuarios() {
    this.limparMensagens();
    if (this.filtroSelecionado === 'ativo') {
      this.usuarioService.getAll();
      this.usuarios = this.usuarioService.usuarios;
    } else {
      this.usuarioService.listarUsuarioInativos();
      this.usuarios = this.usuarioService.usuarios;
    }

  }

  alternarStatus(id: number) {
    this.alternarStatusUsuario = true;
    this.idUsuarioTrocaStatus = id;
  }

  cancelarTrocaDeStatus() {
    this.alternarStatusUsuario = false;
  }

  limparMensagens() {
    this.mensagemErro = "";
    this.mensagemSucesso = "";
  }

  confirmarTrocaDeStatus() {
    if (this.idUsuarioTrocaStatus != null && this.filtroSelecionado === 'ativo') {
      this.usuarioService.desativar(this.idUsuarioTrocaStatus).subscribe({
        next: (response) => {
          this.idUsuarioTrocaStatus = null;
          this.alternarStatusUsuario = false;
          this.mensagemSucesso = response.mensagem;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.mensagemErro = err.error.mensagem;
          this.cdr.markForCheck();
        }
      });
    } else if (this.filtroSelecionado === 'inativo' && this.idUsuarioTrocaStatus != null) {
      this.usuarioService.ativar(this.idUsuarioTrocaStatus).subscribe({
        next: (response) => {
          console.log(response);
          this.idUsuarioTrocaStatus = null;
          this.alternarStatusUsuario = false;
          this.mensagemSucesso = response.mensagem;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.mensagemErro = err.error.mensagem;
          this.cdr.markForCheck();
        }
      });
    }
  }


}