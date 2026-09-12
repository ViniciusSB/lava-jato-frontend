import { Component } from '@angular/core';
import { RelatorioService } from '../../services/relatorio/relatorio';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RelatorioRequest } from '../../models/relatorio';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideEnvironmentNgxMask, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-relatorio',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, NgxMaskDirective],
  providers: [
    provideNgxMask()
  ],
  templateUrl: './relatorio.html',
  styleUrl: './relatorio.css',
})
export class RelatorioComponent {

  idUsuarioLogado = 0;
  tipoUsuarioLogado = '';

  userOpcoes = false;
  opcoesLowScreen = false;
  mensagemErro = '';

  tipos = [
    { id: 'dia', label: 'Dia' },
    { id: 'mes', label: 'Mês' },
    { id: 'ano', label: 'Ano' }
  ];

  tipoRelatorio = [
    { id: 'funcionario', label: 'Funcionário', acesso: 'FUNCIONARIO' },
    { id: 'faturamento', label: 'Faturamento', acesso: 'GERENTE' },
    { id: 'clientes', label: 'Clientes', acesso: 'GERENTE' },
    { id: 'funcionarios', label: 'Funcionários', acesso: 'GERENTE' }
  ];

  mascaraPeriodo = '00-00-0000';
  placeholderPeriodo = 'dd-mm-aaaa';

  relatorioRequest: RelatorioRequest = {
    tipo: 'dia',
    periodo: this.obterDataAtualFormatada('dia'),
    tipoRelatorio: ''
  };

  constructor(private relatorioService: RelatorioService, private router: Router) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const tipoUsuario = localStorage.getItem('tipoUsuario');

    // Validação de Sessão e Permissão
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.idUsuarioLogado = Number(localStorage.getItem('idUsuario')) || 0;
    this.tipoUsuarioLogado = tipoUsuario || '';
  }

  opcoes() {

  }

  mudarTipoPeriodo(): void {
    this.relatorioRequest.periodo = '';
    this.mensagemErro = '';

    switch (this.relatorioRequest.tipo) {
      case 'mes':
        this.mascaraPeriodo = '00-0000';
        this.placeholderPeriodo = 'mm-aaaa';
        this.relatorioRequest.periodo = this.obterDataAtualFormatada('mes');
        break;
      case 'ano':
        this.mascaraPeriodo = '0000';
        this.placeholderPeriodo = 'aaaa';
        this.relatorioRequest.periodo = this.obterDataAtualFormatada('ano');
        break;
      default:
        this.mascaraPeriodo = '00-00-0000';
        this.placeholderPeriodo = 'dd-mm-aaaa';
        this.relatorioRequest.periodo = this.obterDataAtualFormatada('dia');
        break;
    }
  }

  private obterDataAtualFormatada(tipo: string): string {
    const hoje = new Date();
    const dia = hoje.getDate() < 10 ? `0${hoje.getDate()}` : String(hoje.getDate());
    const mes = (hoje.getMonth() + 1) < 10 ? `0${(hoje.getMonth() + 1)}` : String(hoje.getMonth() + 1);
    const ano = hoje.getFullYear();
    if (tipo === 'dia')
      return `${dia}${mes}${ano}`;
    else if (tipo === 'mes')
      return `${mes}${ano}`;
    else
      return `${ano}`;
  }

  logout(): void {
    localStorage.setItem("token", "");
    localStorage.setItem("idUsuario", "");
    localStorage.setItem("tipoUsuario", "");
    this.router.navigate(["/login"]);
  }

  fecharOpcoesLowScreen(): void {
    this.opcoesLowScreen = !this.opcoesLowScreen;
  }

  menuOpcoesUsuario(): void {
    this.userOpcoes = !this.userOpcoes;
  }

  get relatoriosPermitidos() {
    if (this.tipoUsuarioLogado === 'ADM') {
      return this.tipoRelatorio;
    }
    return this.tipoRelatorio.filter(r => r.acesso === this.tipoUsuarioLogado);
  }

  validarPeriodoFiltroDia(): boolean {
    const caracteres = this.relatorioRequest.periodo.length;
    // Verficacao do dia
    let dia = this.relatorioRequest.periodo;
    if (caracteres >= 2) {
      if (caracteres > 2) {
        const datas = this.relatorioRequest.periodo.split("-");
        dia = datas[0];
      }
      if (Number(dia) < 1 || Number(dia) > 31) {
        this.mensagemErro = "Dia inválido";
        return false;
      }

    }

    // Verficacao do mes
    let mes = this.relatorioRequest.periodo;
    if (caracteres >= 5) {
      const datas = this.relatorioRequest.periodo.split("-");
      mes = datas[1];
      if (Number(mes) < 1 || Number(mes) > 12) {
        this.mensagemErro = "Mês inválido";
        return false;
      }
    }

    // Verficacao do ano
    let ano = this.relatorioRequest.periodo;
    if (caracteres == 10) {
      const datas = this.relatorioRequest.periodo.split("-");
      ano = datas[2];
      if (Number(ano) < 2000 || Number(ano) > new Date().getFullYear()) {
        this.mensagemErro = "Ano inválido";
        return false;
      }
    }

    return true;
  }

  validarPeriodoFiltroMes(): boolean {
    const caracteres = this.relatorioRequest.periodo.length;
    // Verficacao do mes
    let mes = this.relatorioRequest.periodo;
    if (caracteres >= 2) {
      if (caracteres > 2) {
        const datas = this.relatorioRequest.periodo.split("-");
        mes = datas[0];
      }
      if (Number(mes) < 1 || Number(mes) > 12) {
        this.mensagemErro = "Mês inválido";
        return false;
      }
    }

    // Verficacao do ano
    let ano = this.relatorioRequest.periodo;
    if (caracteres == 7) {
      const datas = this.relatorioRequest.periodo.split("-");
      ano = datas[1];
      if (Number(ano) < 2000 || Number(ano) > new Date().getFullYear()) {
        this.mensagemErro = "Ano inválido";
        return false;
      }
    }

    return true;
  }

  validarPeriodoFiltroAno(): boolean {
    const caracteres = this.relatorioRequest.periodo.length;
    let ano = this.relatorioRequest.periodo;
    if (caracteres == 4) {
      if (Number(ano) < 2000 || Number(ano) > new Date().getFullYear()) {
        this.mensagemErro = "Ano inválido";
        return false;
      }
      else {
        return true;
      }
    }
    else {
      this.mensagemErro = "Data mal formatada";
      return false;
    }
  }

  emitir() {
    this.relatorioService.relatorioFuncionario(this.relatorioRequest).subscribe({
      next: (data: Blob) => {
        const fileURL = URL.createObjectURL(data);
        window.open(fileURL);
      },
      error: (erro) => {
        console.log(erro);
      }
    });
  }
}