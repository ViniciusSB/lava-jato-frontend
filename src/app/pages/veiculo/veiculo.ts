import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Veiculo} from '../../models/veiculo';
import { FormsModule } from '@angular/forms';
import { VeiculoService } from '../../services/veiculo/veiculo';
import { PrimCarcMaius } from '../../_pipes/primCaracMaius';
import { Cliente } from '../../models/cliente';
import { ClienteService } from '../../services/cliente/cliente';

@Component({
  selector: 'app-veiculo',
  standalone: true,
  imports: [CommonModule, FormsModule, PrimCarcMaius],
  templateUrl: './veiculo.html',
  styleUrl: './veiculo.css',
})
export class VeiculoComponent {
  veiculos: Observable<Veiculo[]> | undefined;
  veiculoSelecionado: Veiculo | undefined;
  inserirVeiculo: boolean = false;
  novoVeiculo: Veiculo = {
    marca: '',
    modelo: '',
    cor: '',
    tipo: '',
    placa: '',
    clienteId: 0,
    clienteNome: ''
  }

  clientes: Observable<Cliente[]> | undefined;

  tipoSecionado: string = '';
  tipos: string[] = ['MOTO', 'CARRO', 'CAMINHONETE', 'CAMINHAO'];

  constructor(private veiculoService: VeiculoService, private clienteService: ClienteService) {}

  ngOnInit() {
    this.veiculoService.getAll();
    this.veiculos = this.veiculoService.veiculos;
  }

  fechar() {
    this.veiculoSelecionado = undefined;
    this.inserirVeiculo = false;
  }

  adicionar() {
    if (this.clientes == undefined) {
      this.clienteService.getAll();
      this.clientes = this.clienteService.clientes;
    }
    this.inserirVeiculo = true;
    this.veiculoSelecionado = undefined;
  }

  editar(v: Veiculo) {
    if (this.clientes == undefined) {
      this.clienteService.getAll();
      this.clientes = this.clienteService.clientes;
    }
    this.veiculoSelecionado = {... v};
    this.inserirVeiculo = false;
  }

  excluir(id:number) {
    this.veiculoService.delete(id).subscribe({
      next: () => {
        alert('Veículo excluido com sucesso');
      },
      error: (err) => {
        console.log('Erro ao deletar o veículo', err);
        alert('Não foi possível deletar o veículo.')
      }
    })
  }

  salvar() {
    if (this.veiculoSelecionado) {
      this.veiculoService.update(this.veiculoSelecionado).subscribe({
        next: () => {
          this.veiculoSelecionado = undefined;
        },
        error: (err) => {
          console.error('Erro ao atualizar veículo:', err);
          alert('Não foi possível atualizar o veículo.');
        }
      });
    } else if (this.inserirVeiculo) {
      this.veiculoService.create(this.novoVeiculo).subscribe({
      next: () => {
        this.novoVeiculo = {marca: '', modelo: '', cor: '', tipo: '', placa: '', clienteId: 0, clienteNome: ''};
        this.inserirVeiculo = false;
      },
      error: (err) => {
        console.error('Erro ao cadastrar veículo:', err);
        alert('Não foi possível cadastrar o veículo.');
      }
    })
    }
  }

 


}
