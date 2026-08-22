import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../services/usuario/usuario';
import { Usuario } from '../../models/usuario';
import { Observable } from 'rxjs';
import { PrimCarcMaius } from '../../_pipes/primCaracMaius';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimCarcMaius],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
})
export class UsuarioComponent {
  
  usuarios!: Observable<Usuario[]>;

  usuarioSelecionado: Usuario | undefined;

  tipos: string[] = ['ADM', 'GERENTE', 'FUNCIONARIO']

  inserirUsuario: boolean = false;

  novoUsuario: Usuario = {nome: '', email: '', senha: '', tipo: ''};

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuarioService.getAll();
    this.usuarios = this.usuarioService.usuarios;
  }

  adicionar() {
    this.inserirUsuario = true;
    this.usuarioSelecionado = undefined;
  }

  excluir(id: number) {
    this.usuarioService.delete(id).subscribe({
      next: () => {
        alert('Usuario deletado')
      },
      error: (err) => {
        console.error('Erro ao excluir usuário:', err);
        alert('Não foi possível excluir o usuário. Tente novamente mais tarde.');
      }
    });
  }

  editar(u: Usuario) {
    this.usuarioSelecionado = {... u};
    this.inserirUsuario = false;
  }

  fechar() {
    this.usuarioSelecionado = undefined;
    this.inserirUsuario = false;
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

  
}