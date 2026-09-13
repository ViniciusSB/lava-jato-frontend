import { ChangeDetectorRef, Component } from '@angular/core';
import { UsuarioRequest } from '../../models/usuario';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login/login';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {

  loginAtivo = true;
  registrarAtivo = false;
  senhaRevelada = false;
  mensagemErro = "";
  mensagemSucesso = "";

  usuarioRequest: UsuarioRequest = { nome: '', email: '', senha: '', tipo: '' };
  tipos = [{ id: 'ADM', label: 'Administrador' }, { id: 'GERENTE', label: 'Gerente' }, { id: 'FUNCIONARIO', label: 'Funcionário' }];

  constructor(private loginService: LoginService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("token") != '') {
      this.router.navigate(["/"]);
      return;
    }
  }

  fecharMsg() {
    this.mensagemErro = "";
    this.mensagemSucesso = "";
  }

  loginSelecao() {
    this.loginAtivo = true;
    this.registrarAtivo = false;
    this.usuarioRequest = { nome: '', email: '', senha: '', tipo: '' };
    this.senhaRevelada = false;
    this.mensagemErro = "";
  }

  registrarSelecao() {
    this.loginAtivo = false;
    this.registrarAtivo = true;
    this.usuarioRequest = { nome: '', email: '', senha: '', tipo: '' };
    this.senhaRevelada = false;
    this.mensagemErro = "";
  }

  revelarSenha() {
    this.senhaRevelada = !this.senhaRevelada;
  }

  logar() {
    this.fecharMsg();
    if (!this.validarCampos())
      return;
    this.loginService.fazerLogin(this.usuarioRequest).subscribe({
      next: (response) => {
        this.cdr.markForCheck();
        this.router.navigate(['/']);
      },
      error: (erro) => {
        this.mensagemErro = erro.error?.erro;
        this.cdr.markForCheck();
      }
    });
  }

  cadastrar() {
    this.fecharMsg();
    if (!this.validarCampos())
      return;
    this.loginService.cadastrar(this.usuarioRequest).subscribe({
      next: (response) => {
        console.log(response.status);
        console.log("Body:", response.body);
        this.mensagemSucesso = "Usuário cadastrado"
        this.usuarioRequest = { nome: '', email: '', senha: '', tipo: '' };
        this.senhaRevelada = false;
        this.cdr.markForCheck();
      },
      error: (erro) => {
        this.mensagemErro = "Não foi possível cadastrar o usuário";
        this.cdr.markForCheck();
      }
    });
  }

  validarCampos(): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}$/;

    if (this.usuarioRequest.email == '' || this.usuarioRequest.senha == '') {
      this.mensagemErro = "Preencha os campos";
      return false;
    } else if (this.registrarAtivo && (this.usuarioRequest.nome == '' || this.usuarioRequest.tipo == '')) {
      this.mensagemErro = "Preencha os campos";
      return false;
    } else if (!emailRegex.test(this.usuarioRequest.email)) {
      this.mensagemErro = "Digite um e-mail válido";
      return false;
    }
    return true;
  }

  esqueciSenha() {

  }
}
