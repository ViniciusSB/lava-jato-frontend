import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Servico } from '../../models/servico';
import { ServicoService } from '../../services/servico/servico';


@Component({
  selector: 'app-servico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servico.html',
  styleUrl: './servico.css',
})
export class ServicoComponent {
  
  servicos: Observable<Servico[]> | undefined;

  servicoSelecionado: Servico | null = null;
  novoServico: Servico = {
    id: 0,
    detalhes: '',
    precoBase: 0,
    tipo: ''
  };

  inserirServico: boolean = false;
  excluirSelecionado: boolean = false;

  idServicoExclusao: number | null = null;

  constructor(private servicoService: ServicoService) {}

  ngOnInit() {
    this.servicoService.getAll();
    this.servicos = this.servicoService.servicos;
  }

  adicionar() {
    this.inserirServico = true;
    this.servicoSelecionado = null;
  }

  editar(s: Servico) {
    this.servicoSelecionado = {... s};
    this.inserirServico = false;
  }

  fechar() {
    this.servicoSelecionado = null;
    this.inserirServico = false;
    this.novoServico = {id: 0, detalhes: '', precoBase: 0, tipo: ''};
  }

  salvar() {
    if (this.servicoSelecionado) {
      this.servicoService.update(this.servicoSelecionado).subscribe({
        next: () => {
          this.servicoSelecionado = null;
          this.servicoSelecionado = null;
        },
        error: (err) => {
          console.error('Erro ao atualizar o serviço:', err);
          alert('Não foi possível atualizar o serviço.');
        }
      });
    } else if (this.inserirServico) {
      this.servicoService.create(this.novoServico).subscribe({
      next: () => {
        this.inserirServico = false;
        this.novoServico = {id: 0, detalhes: '', precoBase: 0, tipo: ''};
      },
      error: (err) => {
        console.error('Erro ao cadastrar serviço:', err);
        alert('Não foi possível cadastrar o serviço.');
      }
    })
    } 
  }

  excluir(id: number) {
    this.excluirSelecionado = true;
    this.idServicoExclusao = id;
  }

  cancelarExclusao() {
    this.excluirSelecionado = false;
  }

  confirmarExclusao() {
    if (this.idServicoExclusao != null){
      this.servicoService.delete(this.idServicoExclusao).subscribe({
      next: () => {
        this.idServicoExclusao = null;
        this.excluirSelecionado = false;
      },
      error: (err) => {
        console.error('Erro ao excluir o serviço:', err);
        alert('Não foi possível excluir o serviço. Tente novamente mais tarde.');
      }
    });
    }
  }

  fecharModal() {
    this.idServicoExclusao = null;
    this.excluirSelecionado = false;
  }

}
