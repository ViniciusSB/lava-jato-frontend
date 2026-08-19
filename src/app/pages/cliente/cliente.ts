import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente/cliente';
import { FormsModule } from '@angular/forms';
import { TelefoneMaskDirective } from '../../util/telefone-mak';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, TelefoneMaskDirective],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
})
export class ClienteComponent {

  clientes: Observable<Cliente[]> | undefined;
  clienteSelecionado: Cliente | undefined;
  inserirCliente: boolean = false;
  novoCliente: Cliente = {
    nome: '', celular: '', fidelidade: 0,
    id: 0,
    dataCriacao: '',
    dataAtualizacao: ''
  }

  constructor(private clienteService: ClienteService) {}

  ngOnInit() {
    this.clienteService.getAll();
    this.clientes = this.clienteService.usuarios;
  }

  excluir(id: number) {
    this.clienteService.delete(id).subscribe({
      next: () => {
        alert('Cliente removido');
      },
      error: (err) => {
        console.log('Erro ao deletar o cliente', err);
        alert('Não foi possível deletar o cliente.')
      }
    })
  }

  adicionar() {
    this.inserirCliente = true;
  }
  
  editar(c: Cliente) {
    this.clienteSelecionado = {... c};
  }

  salvar() {
    if (this.clienteSelecionado) {
      if (this.clienteSelecionado.celular.length < 14) {
        alert('O celular deve ter exatamente 11 dígitos.');
        return;
      }
      this.clienteService.update(this.clienteSelecionado).subscribe({
        next: () => {
          this.clienteSelecionado = undefined;
        },
        error: (err) => {
          console.error('Erro ao atualizar cliente:', err);
          alert('Não foi possível atualizar o cliente.');
        }
      });
    }
    else if (this.inserirCliente) {
      if(this.novoCliente.celular.length < 14) {
        alert('O celular deve ter exatamente 11 dígitos.');
        return;
      }
      this.clienteService.create(this.novoCliente).subscribe({
        next: () => {
          this.novoCliente = { id: 0, nome: '', celular: '', fidelidade: 0, dataCriacao: '', dataAtualizacao: '' }; 
          this.inserirCliente = false;
        },
        error: (err) => {
          console.error('Erro ao cadastrar cliente:', err);
          alert('Não foi possível cadastrar o cliente.');
        }
      });
    }
  }
}
