import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { UsuarioService } from '../../services/usuario/usuario';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  templateUrl: './usuario.html',
  styleUrls: ['./usuario.css'],
})
export class UsuarioComponent {
  usuarios = new MatTableDataSource<Usuario>()
  displayedColumns: string[] = ['id', 'nome', 'email', 'tipo'];

  constructor(private usuarioService: UsuarioService) {
    console.log('UsuarioComponent inicializado');
  }

  ngOnInit() {
    console.log("Entrei no INIT")
    this.usuarioService.getAll().subscribe({
      next: (data) => {
        console.log('API retornou:', data);
        this.usuarios.data = data;
      },
      error: (err) => console.error('Erro na API:', err)
    });
  }

  excluir(id: number) {
    this.usuarioService.delete(id).subscribe(() => {
      this.usuarios.data = this.usuarios.data.filter(u => u.id !== id);
    });
  }
}