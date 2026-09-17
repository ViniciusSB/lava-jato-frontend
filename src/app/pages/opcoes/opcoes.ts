import { ChangeDetectorRef, Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario';
import { Router, RouterModule } from '@angular/router';
import { UsuarioLogado, UsuarioRequest } from '../../models/usuario';
import { AuthUtil } from '../../util/auth-util';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-opcoes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './opcoes.html',
  styleUrl: './opcoes.css',
})
export class OpcoesComponent {

  usuarioLogado: UsuarioLogado = AuthUtil.obterDadosUsuarioLogado();
  urlFoto: string = "";

  userOpcoes = false;
  opcoesLowScreen = false;
  menuAtivo = false;
  animacaoAtiva = false;
  dadosUsuario = true;
  alterarSenha = false;

  mensagemErro = "";
  mensagemSucesso = "";

  usuarioRequest: UsuarioRequest = {
    id: this.usuarioLogado.idUsuario,
    email: this.usuarioLogado.email,
    nome: this.usuarioLogado.nome,
    urlFoto: this.usuarioLogado.urlFoto
  };

  senhaAtual = "";
  senhaAtualRevelada = false;
  novaSenha = "";
  novaSenhaRevelada = false;
  repetirSenha = "";

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.carregarFotoUsuario();
  }

  carregarFotoUsuario() {
    if (this.usuarioLogado.urlFoto == null || this.usuarioLogado.urlFoto === "" || this.usuarioLogado.urlFoto === "null")
      this.urlFoto = this.usuarioLogado.tipoUsuario === "GERENTE" ? "gerente.png" : this.usuarioLogado.tipoUsuario === "FUNCIONARIO" ? "funcionario.png" : "admin.png";
    else
      this.urlFoto = this.usuarioLogado.urlFoto;
  }

  menuOpcoesUsuario() {
    if (this.userOpcoes == false)
      this.menuAtivo = false;
    this.userOpcoes = !this.userOpcoes;
  }

  fecharOpcoesLowScreen() {
    if (this.opcoesLowScreen == false)
      this.menuAtivo = false;
    this.opcoesLowScreen = !this.opcoesLowScreen;
  }

  rotaDadosUsuario() {
    this.dadosUsuario = true;
    this.alterarSenha = false;
    this.limparCamposAlterarSenha();
    this.limparMensagens();
  }

  rotaAlterarSenha() {
    this.dadosUsuario = false;
    this.alterarSenha = true;
    this.resetarDadosUsuario();
    this.limparMensagens();
  }

  alternarMenu() {
    if (this.menuAtivo == false) {
      this.opcoesLowScreen = false;
      this.userOpcoes = false;
    }
    if (!this.animacaoAtiva)
      this.animacaoAtiva = true;
    this.menuAtivo = !this.menuAtivo;
  }

  limparCamposAlterarSenha() {
    this.senhaAtualRevelada = false;
    this.novaSenhaRevelada = false;
    this.senhaAtual = "";
    this.novaSenha = "";
    this.repetirSenha = "";
  }

  resetarDadosUsuario() {
    this.usuarioRequest = {
      id: this.usuarioLogado.idUsuario,
      email: this.usuarioLogado.email,
      nome: this.usuarioLogado.nome,
      urlFoto: this.usuarioLogado.urlFoto
    };
  }

  alterarDadosUsuario() {
    if (this.usuarioRequest.nome?.trim() === "") {
      this.mensagemErro = "Preencha o nome";
      return;
    } else if (this.usuarioRequest.nome!.length < 3) {
      this.mensagemErro = "O nome deve ter no mínimo 3 caracteres";
      return;
    }
    this.usuarioService.updateUsuarioOpcoes(this.usuarioRequest).subscribe({
      next: (response) => {
        console.log(response);
        AuthUtil.atualizarDadosUsuario(this.usuarioRequest);
        this.usuarioLogado = AuthUtil.obterDadosUsuarioLogado();
        this.carregarFotoUsuario();
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.log(erro.error.mensage);
      }
    });
  }

  btnAlterarSenha() {
    this.limparMensagens();
    if (!this.validarSenha())
      return;
    console.log(`${this.senhaAtual}, ${this.novaSenha}, ${this.repetirSenha}`);
    this.usuarioService.atualizarSenha(this.senhaAtual, this.novaSenha, this.usuarioLogado.idUsuario).subscribe({
      next: (response) => {
        if (response.mensagem.includes("incorreta"))
          this.mensagemErro = response.mensagem;
        else
          this.mensagemSucesso = response.mensagem;
        this.limparCamposAlterarSenha();
        this.cdr.markForCheck();
      },
      error: (erro) => {
        console.log(erro.message);
      }
    })
  }

  limparMensagens() {
    this.mensagemErro = "";
    this.mensagemSucesso = "";
  }

  validarSenha(): boolean {
    if (this.senhaAtual.trim() === "" || this.novaSenha.trim() === "" || this.repetirSenha.trim() === "") {
      this.mensagemErro = "Preencha os campos";
      return false;
    }
    if (this.novaSenha !== this.repetirSenha) {
      this.mensagemErro = "Os campos de Nova senha devem ser iguais";
      return false;
    }
    return true;
  }

  alternarVisSenhaAtual() {
    this.senhaAtualRevelada = !this.senhaAtualRevelada;
  }

  alternarVisNovaSenha() {
    this.novaSenhaRevelada = !this.novaSenhaRevelada;
  }


  logout() {
    AuthUtil.limparDadosLocaisUsuario();
    this.cdr.markForCheck();
    this.router.navigate(["/login"]);
  }
}
