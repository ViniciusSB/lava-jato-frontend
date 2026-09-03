import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario';
import { Usuario } from '../../models/usuario';
import { Observable } from 'rxjs';
import { PrimCarcMaius } from '../../_pipes/primCaracMaius';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimCarcMaius],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
})
export class UsuarioComponent {

  idUsuarioLogado = 0;
  
  usuarios!: Observable<Usuario[]>;

  usuarioSelecionado: Usuario | undefined;

  tipos: string[] = ['ADM', 'GERENTE', 'FUNCIONARIO']

  inserirUsuario: boolean = false;

  novoUsuario: Usuario = {nome: '', email: '', senha: '', tipo: ''};

  excluirSelecionado: boolean = false;

  idUsuarioExclusao: number | null = null;

  constructor(private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem("token") == '') {
      this.router.navigate(["/login"]);
      return;
    } else if (localStorage.getItem("tipoUsuario") == 'FUNCIONARIO') {
      this.router.navigate(["/"]);
      return;
    }
    this.idUsuarioLogado = Number(localStorage.getItem("idUsuario"));
    this.usuarioService.getAll();
    this.usuarios = this.usuarioService.usuarios;
  }

  adicionar() {
    this.inserirUsuario = true;
    this.usuarioSelecionado = undefined;
  }

  editar(u: Usuario) {
    this.usuarioSelecionado = {... u};
    this.inserirUsuario = false;
  }

  fechar() {
    this.usuarioSelecionado = undefined;
    this.inserirUsuario = false;
  }

  fecharModal() {
    this.idUsuarioExclusao = null;
    this.excluirSelecionado = false;
  }

  salvar() {
    if (this.usuarioSelecionado) {
      this.usuarioService.update(this.usuarioSelecionado).subscribe({
        next: () => {
          this.usuarioSelecionado = undefined;
        },
        error: (err) => {
          console.error('Erro ao atualizar usuário:', err);
          alert('Não foi possível atualizar o usuário.');
        }
      });
    } else if (this.inserirUsuario) {
      this.usuarioService.create(this.novoUsuario).subscribe({
        next: () => {
          this.inserirUsuario = false;
        },
        error: (err) => {
          console.error('Erro ao cadastrar usuário:', err);
          alert('Não foi possível cadastrar o usuário.');
        }
      })
    } 
  }

  excluir(id: number) {
    this.excluirSelecionado = true;
    this.idUsuarioExclusao = id;
    this.fechar();
  }

  cancelarExclusao() {
    this.excluirSelecionado = false;
  }

  confirmarExclusao() {
    if (this.idUsuarioExclusao != null){
      this.usuarioService.delete(this.idUsuarioExclusao).subscribe({
      next: () => {
        this.idUsuarioExclusao = null;
        this.excluirSelecionado = false;
      },
      error: (err) => {
        console.error('Erro ao excluir usuário:', err);
        alert('Não foi possível excluir o usuário. Tente novamente mais tarde.');
      }
    });
    }
  }

  
}