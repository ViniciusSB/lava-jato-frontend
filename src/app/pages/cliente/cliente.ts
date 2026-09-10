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
import { Route, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule, TelefoneMaskDirective, PrimCarcMaius, RouterModule],
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

  idUsuarioLogado = 0;
  tipoUsuarioLogado = "";

  userOpcoes = false;
  opcoesLowScreen = false;

  revelarVeiculosCliente: boolean = false;
  
  veiculosCliente: Observable<Veiculo[]> | undefined;
  
  inserirVeiculo: boolean = false;
  editarVeiculo: boolean = false;
  novoVeiculo: Veiculo = {marca: '', modelo: '', cor: '', tipo: '', placa: '', clienteId: 0, clienteNome: ''};
  tipos = [{id: 'MOTO', label: 'Moto'}, {id: 'CARRO', label: 'Carro'}, {id: 'CAMINHONETE', label: 'Caminhonete'}, {id: 'CAMINHAO', label: 'Caminhão'}];
  idVeiculoExclusao: number | null = null;

  clientesFiltrados: Observable<Cliente[]> | undefined;

  filtroAtivo: boolean = false;

  excluirSelecionado: boolean = false;
  excluirVeiculoSelecionado: boolean = false;

  idClienteExclusao: number | null = null;

  constructor(
    private clienteService: ClienteService, 
    private veiculoService: VeiculoService,
    private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem("token") == '') {
      this.router.navigate(["/login"]);
      return;
    }
    this.idUsuarioLogado = Number(localStorage.getItem("idUsuario"));
    this.tipoUsuarioLogado = localStorage.getItem("tipoUsuario")!;
    this.clienteService.getAll();
    this.clientes = this.clienteService.clientes;
  }

  excluir(id: number) {
    this.excluirSelecionado = true;
    this.idClienteExclusao = id;
    this.fechar();
  }

  cancelarExclusao() {
    this.excluirSelecionado = false;
  }

  confirmarExclusao() {
    if (this.idClienteExclusao != null){
      this.clienteService.delete(this.idClienteExclusao).subscribe({
      next: () => {
        this.idClienteExclusao = null;
        this.excluirSelecionado = false;
      },
      error: (err) => {
        console.log('Erro ao deletar o cliente', err);
        alert('Não foi possível deletar o cliente.')
      }
    });
    }
  }

  opcoes() {

  }

  fecharOpcoesLowScreen() {
    this.opcoesLowScreen = !this.opcoesLowScreen;
  }

  logout() {
    localStorage.setItem("token", "");
    localStorage.setItem("idUsuario", "");
    localStorage.setItem("tipoUsuaio", "");
    this.router.navigate(["/login"]);
  }

  menuOpcoesUsuario() {
    this.userOpcoes = !this.userOpcoes;
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

  exibirVeiculos(c: Cliente) {
    this.clienteSelecionado = c;
    this.inserirCliente = false;
    this.revelarVeiculosCliente = true;
    this.veiculoService.obterVeiculosPorClienteId(c.id);
    this.veiculosCliente = this.veiculoService.veiculos;
  }

  fechar() {
    this.clienteSelecionado = undefined;
    this.inserirCliente = false;
  }

  fecharModal() {
    this.revelarVeiculosCliente = false;
    this.clienteSelecionado = undefined;
    this.novoVeiculo = {marca: '', modelo: '', cor: '', tipo: '', placa: '', clienteId: 0, clienteNome: ''};
    this.limparCamposVeiculo();
  }

  botaoAdicionarVeiculo() {
    this.inserirVeiculo = true;
    this.editarVeiculo = false;
    this.novoVeiculo.clienteId = this.clienteSelecionado?.id ?? 0;
  }

  botaoEditarVeiculo(v: Veiculo) {
    this.inserirVeiculo = false;
    this.editarVeiculo = true;
    this.novoVeiculo = {... v};
  }

  salvarVeiculo() {
    if (this.inserirVeiculo) {
      this.veiculoService.criarEListarClienteSelecionado(this.novoVeiculo, this.clienteSelecionado?.id!).subscribe({
        next: () => {
          this.novoVeiculo = {marca: '', modelo: '', cor: '', tipo: '', placa: '', clienteId: 0, clienteNome: ''};
          this.inserirVeiculo = false;
        },
        error: (err) => {
          console.error('Erro ao cadastrar veículo:', err);
          alert('Não foi possível cadastrar o veículo.');
        }
      });
    } else {
      this.veiculoService.atualizarEListarClienteSelecionado(this.novoVeiculo, this.clienteSelecionado?.id!).subscribe({
        next: () => {
          this.novoVeiculo = {marca: '', modelo: '', cor: '', tipo: '', placa: '', clienteId: 0, clienteNome: ''};
          this.editarVeiculo = false;
        },
        error: (err) => {
          console.error('Erro ao editar veículo:', err);
          alert('Não foi possível editar o veículo.');
        }
      });
    }
  }

  excluirVeiculo(idVeiculo: number) {
    this.excluirVeiculoSelecionado = true;
    this.limparCamposVeiculo();
    this.idVeiculoExclusao = idVeiculo;
  }

  cancelarExclusaoVeiculo() {
    this.excluirVeiculoSelecionado = false;
  }

  confirmarExclusaoVeiculo() {
    if (this.idVeiculoExclusao != null){
      this.veiculoService.deletarEListarClienteSelecionado(this.idVeiculoExclusao, this.clienteSelecionado?.id!).subscribe({
      next: () => {
        this.idVeiculoExclusao = null;
        this.excluirVeiculoSelecionado = false;
      },
      error: (err) => {
        console.log('Erro ao deletar o veículo', err);
        alert('Não foi possível deletar o veículo.')
      }
    });
    }
  }

  fecharAdicionarVeiculo() {
    this.limparCamposVeiculo();
  }

  fecharEditarVeiculo() {
    this.limparCamposVeiculo();
  }

  limparCamposVeiculo() {
    this.inserirVeiculo = false;
    this.editarVeiculo = false;
  }
}
