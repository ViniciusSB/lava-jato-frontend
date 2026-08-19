import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioService } from '../../services/usuario/usuario';
import { Usuario } from '../../models/usuario';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, FormsModule],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
})
export class UsuarioComponent {
  
  usuarios!: Observable<Usuario[]>;

  usuarioSelecionado: Usuario | undefined;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit() {
    this.usuarioService.getAll();
    this.usuarios = this.usuarioService.usuarios;
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
  }

  salvar() {
    if (!this.usuarioSelecionado) 
      return;
    else {
      this.usuarioService.update(this.usuarioSelecionado).subscribe({
        next: () => {
          this.usuarioSelecionado = undefined;
        },
        error: (err) => {
          console.error('Erro ao atualizar usuário:', err);
          alert('Não foi possível atualizar o usuário.');
        }
      })
    }
  }
}