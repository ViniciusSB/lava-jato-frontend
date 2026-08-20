import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente/cliente';
import { FormsModule } from '@angular/forms';
import { TelefoneMaskDirective } from '../../util/telefone-mak';
import { VeiculoService } from '../../services/veiculo/veiculo';
import { Veiculo } from '../../models/veiculo';
import { PrimCarcMaius } from '../../_pipes/primCaracMaius';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, TelefoneMaskDirective, PrimCarcMaius],
  templateUrl: './cliente.html',
  styleUrl: './cliente.css',
})
export class ClienteComponent {

  clientes: Observable<Cliente[]> | undefined;
  clienteSelecionado: Cliente | undefined;
  inserirCliente: boolean = false;
  novoCliente: Cliente = {
    nome: '', celular: '', fidelidade: 0,
    id: 0, veiculos: []
  }

  revelarVeiculosCliente: boolean = false;
  
  veiculosCliente: Observable<Veiculo[]> | undefined;

  clientesFiltrados: Observable<Cliente[]> | undefined;

  filtroAtivo: boolean = false;

  constructor(
    private clienteService: ClienteService, 
    private veiculoService: VeiculoService) {}

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
    this.clienteSelecionado = undefined;
    this.revelarVeiculosCliente = false;
  }
  
  editar(c: Cliente) {
    this.clienteSelecionado = {... c};
    this.inserirCliente = false;
    this.revelarVeiculosCliente = false;
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
          this.novoCliente = { id: 0, nome: '', celular: '', fidelidade: 0, veiculos: [] }; 
          this.inserirCliente = false;
        },
        error: (err) => {
          console.error('Erro ao cadastrar cliente:', err);
          alert('Não foi possível cadastrar o cliente.');
        }
      });
    }
  }

  filtrar(termo: string) {
    if (termo.length == 0) 
      this.filtroAtivo = false;
    else {
      this.filtroAtivo = true;
      this.clientesFiltrados = this.clientes!.pipe(
        map( clientes => 
          clientes.filter(c => 
            c.nome.toLocaleLowerCase().includes(termo.toLocaleLowerCase())
          )
        )
     );
    }
  }

  exibirVeiculos(idCliente: number) {
    this.clienteSelecionado = undefined;
    this.inserirCliente = false;
    this.revelarVeiculosCliente = true;
    this.veiculoService.obterVeiculosPorClienteId(idCliente);
    this.veiculosCliente = this.veiculoService.veiculos;
    this.veiculosCliente.forEach( v => {
      console.log('OLOKO', v);
    })
  }

  fecharModal() {
    this.revelarVeiculosCliente = false;
  }
}
