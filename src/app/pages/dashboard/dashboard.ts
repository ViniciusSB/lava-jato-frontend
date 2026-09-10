import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '../../services/dashboard/dashboard';
import { DadosFaturamento, DadosVeiculos, DashboardFuncionarioRequest, FuncionarioDestaque, GraficoItem } from '../../models/dashboard';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, FormsModule, NgxMaskDirective, RouterModule],
  providers: [provideNgxMask({ dropSpecialCharacters: false })],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  idUsuarioLogado = 0;
  tipoUsuarioLogado = "";

  userOpcoes = false;
  opcoesLowScreen = false;

  totalMembros = 0;
  funcionarioDestaque: FuncionarioDestaque | undefined;
  graficoTipoMembros: any;

  clientesAtendidos = 0;
  servicosFinalizados = 0;
  ordensEmAndamento = 0;
  graficoTipoVeiculos: any;

  totalBruto = 0;
  totalLiquido = 0;
  graficoFaturamento: any;

  graficoFaturamentoFuncionario: any;
  ordensFinalizadasFuncionario = 0;
  ordensEmAndamentoFuncionario = 0;
  faturamentoTotalFuncionario = 0;

  mensagemErro = "";
  diaAtual = "";
  mesAtual = "";
  anoAtual = "";
  campoPeriodo = "";
  mascaraPeriodo = "00-00-0000"
  placeholderPeriodo = "dd-mm-aaaa"
  tipos = ['dia', 'mes', 'ano'];
  request: DashboardFuncionarioRequest = { tipo: '', periodo: '' };

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef, private router: Router) {
    const data = new Date();
    this.diaAtual = data.getDate().toString();
    if (data.getDate() < 10)
      this.diaAtual = `0${this.diaAtual}`;
    this.mesAtual = (data.getMonth() + 1).toString();
    if ((data.getMonth() + 1) < 10)
      this.mesAtual = `0${this.mesAtual}`;
    this.anoAtual = data.getFullYear().toString();
    this.campoPeriodo = `${this.diaAtual}-${this.mesAtual}-${this.anoAtual}`;
  }

  ngOnInit() {
    if (localStorage.getItem("token") == "") {
      this.router.navigate(["/login"]);
      return;
    }

    this.idUsuarioLogado = Number(localStorage.getItem("idUsuario"));
    this.tipoUsuarioLogado = localStorage.getItem("tipoUsuario")!;
    this.iniciarGraficos();

    // Inicialmente traz os dados do dia
    this.request = { periodo: this.diaAtual, tipo: 'dia' };
    this.preencherDashboards(this.request.tipo);
  }

  opcoes() {

  }

  fecharOpcoesLowScreen() {
    this.opcoesLowScreen = !this.opcoesLowScreen;
  }

  alterarTipo(tipo: string) {
    this.request.tipo = tipo;
    this.resetarDadosDashboard();
    if (tipo == 'mes') {
      this.campoPeriodo = `${this.mesAtual}-${this.anoAtual}`;
      this.request.periodo = this.campoPeriodo;
      this.mascaraPeriodo = "00-0000";
      this.placeholderPeriodo = "mm ou mm-aaaa"
    }
    else if (tipo == 'ano') {
      this.campoPeriodo = this.anoAtual;
      this.request.periodo = this.campoPeriodo;
      this.mascaraPeriodo = "0000";
      this.placeholderPeriodo = "aaaa"
    }
    else {
      this.campoPeriodo = `${this.diaAtual}-${this.mesAtual}-${this.anoAtual}`;
      this.request.periodo = `${this.diaAtual}-${this.mesAtual}-${this.anoAtual}`;
      this.mascaraPeriodo = "00-00-0000";
      this.placeholderPeriodo = "dd-mm-aaaa"
    }
    this.mensagemErro = "";
    this.preencherDashboards(this.request.tipo);
  }

  filtrar() {
    const caracteres = this.campoPeriodo.length;
    if (this.request.tipo == "dia") {
      if (!(caracteres == 2 || caracteres == 5 || caracteres == 10)) {
        this.mensagemErro = "Data mal formatada";
        return;
      }

      if (!this.validarPeriodoFiltroDia())
        return;
    }

    if (this.request.tipo == "mes") {
      if (!(caracteres == 2 || caracteres == 7)) {
        this.mensagemErro = "Data mal formatada";
        return;
      }
      if (!this.validarPeriodoFiltroMes())
        return;
    }

    else if (this.request.tipo == "ano" && !this.validarPeriodoFiltroAno())
      return;

    this.request.periodo = this.campoPeriodo;
    this.mensagemErro = "";
    this.resetarDadosDashboard();
    this.preencherDashboards(this.request.tipo);
  }

  validarPeriodoFiltroDia(): boolean {
    const caracteres = this.campoPeriodo.length;
    // Verficacao do dia
    let dia = this.campoPeriodo;
    if (caracteres >= 2) {
      if (caracteres > 2) {
        const datas = this.campoPeriodo.split("-");
        dia = datas[0];
      }
      if (Number(dia) < 1 || Number(dia) > 31) {
        this.mensagemErro = "Dia inválido";
        return false;
      }

    }

    // Verficacao do mes
    let mes = this.campoPeriodo;
    if (caracteres >= 5) {
      const datas = this.campoPeriodo.split("-");
      mes = datas[1];
      if (Number(mes) < 1 || Number(mes) > 12) {
        this.mensagemErro = "Mês inválido";
        return false;
      }
    }

    // Verficacao do ano
    let ano = this.campoPeriodo;
    if (caracteres == 10) {
      const datas = this.campoPeriodo.split("-");
      ano = datas[2];
      if (Number(ano) < 2000 || Number(ano) > new Date().getFullYear()) {
        this.mensagemErro = "Ano inválido";
        return false;
      }
    }

    return true;
  }

  validarPeriodoFiltroMes(): boolean {
    const caracteres = this.campoPeriodo.length;
    // Verficacao do mes
    let mes = this.campoPeriodo;
    if (caracteres >= 2) {
      if (caracteres > 2) {
        const datas = this.campoPeriodo.split("-");
        mes = datas[0];
      }
      if (Number(mes) < 1 || Number(mes) > 12) {
        this.mensagemErro = "Mês inválido";
        return false;
      }
    }

    // Verficacao do ano
    let ano = this.campoPeriodo;
    if (caracteres == 7) {
      const datas = this.campoPeriodo.split("-");
      ano = datas[1];
      if (Number(ano) < 2000 || Number(ano) > new Date().getFullYear()) {
        this.mensagemErro = "Ano inválido";
        return false;
      }
    }

    return true;
  }

  validarPeriodoFiltroAno(): boolean {
    const caracteres = this.campoPeriodo.length;
    let ano = this.campoPeriodo;
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

  fecharMsgErro() {
    this.mensagemErro = "";
  }

  iniciarGraficos() {
    this.graficoFaturamentoFuncionario = this.iniciarGrafico("line", "Ganhos Diários R$ x Hora");
    this.graficoTipoMembros = this.iniciarGrafico("donut", "Equipe Lava Jato");
    this.graficoTipoVeiculos = this.iniciarGrafico("bar", `Veículos finalizados no dia ${this.diaAtual}`);
    this.graficoFaturamento = this.iniciarGrafico("bar", `Faturamento Bruto/Líquido do dia ${this.diaAtual}`);
  }

  iniciarGrafico(tipo: string, titulo: string): any {
    return {
      series: [],
      chart: { type: tipo, toolbar: { show: true }, background: "#0F172A", foreColor: "#FFFFFF", height: "100%" },
      xaxis: { categories: [], labels: { style: { colors: "94a3b8" } } },
      title: { text: titulo, style: { fontSize: 12 }  }
    };
  }

  preencherDashboards(periodo: string) {
    if (this.tipoUsuarioLogado == 'GERENTE' || this.tipoUsuarioLogado == 'ADM') {
      this.preecherDashboardFuncionario(periodo);
      this.preecherDashboardGerente(periodo);
    } else if (this.tipoUsuarioLogado == 'FUNCIONARIO')
      this.preecherDashboardFuncionario(periodo);
  }

  resetarDadosDashboard() {
    this.graficoTipoMembros.xaxis = { categories: [] };
    this.graficoTipoMembros.title = { text: '' };
    this.graficoTipoMembros.series = [{}];
    this.totalMembros = 0;

    this.graficoTipoVeiculos.xaxis = { categories: [] };
    this.graficoTipoVeiculos.title = { text: '' };
    this.graficoTipoVeiculos.series = [{}];
    this.clientesAtendidos = 0;
    this.servicosFinalizados = 0;
    this.ordensEmAndamento = 0;

    this.graficoFaturamento.xaxis = { categories: [] };
    this.graficoFaturamento.title = { text: '' };
    this.graficoFaturamento.series = [{}];
    this.totalBruto = 0;
    this.totalLiquido = 0;

    this.graficoFaturamentoFuncionario.xaxis = { categories: [] };
    this.graficoFaturamentoFuncionario.title = { text: '' };
    this.graficoFaturamentoFuncionario.series = [{}];
    this.ordensEmAndamentoFuncionario = 0;
    this.ordensFinalizadasFuncionario = 0;
    this.faturamentoTotalFuncionario = 0;
  }

  menuOpcoesUsuario() {
    this.userOpcoes = !this.userOpcoes;
  }

  logout() {
    localStorage.setItem("token", "");
    localStorage.setItem("idUsuario", "");
    localStorage.setItem("tipoUsuario", "");
    this.router.navigate(["/login"]);
  }

  /* FUNCIONARIO */
  preecherDashboardFuncionario(periodo: string) {
    this.dashboardService.getDadosDashboardFuncionario(this.idUsuarioLogado, this.request).subscribe({
      next: (response) => {

        const dados = response.body!;
        this.ordensFinalizadasFuncionario = dados.ordensFinalizadas;
        this.ordensEmAndamentoFuncionario = dados.ordensEmAndamento;
        this.faturamentoTotalFuncionario = dados.faturamentoTotal;

        const ganhos = this.extrairGanhos(dados.grafico);
        const data = this.extrairData(dados.grafico, periodo);

        this.graficoFaturamentoFuncionario.series = [{ name: "Ganhos", data: ganhos }];
        this.graficoFaturamentoFuncionario.xaxis = { categories: data };
        if (periodo == 'dia')
          this.graficoFaturamentoFuncionario.title = { text: "Ganhos Diários R$ x Hora", style: { fontSize: 12 } }
        else if (periodo == 'mes')
          this.graficoFaturamentoFuncionario.title = { text: "Ganhos Mensais R$ x Dia", style: { fontSize: 12 } }
        else
          this.graficoFaturamentoFuncionario.title = { text: "Ganhos Anuais R$ x Mês", style: { fontSize: 12 } }
        this.cdr.detectChanges();

      },
      error: (err) => {
        if (err.status == 403) {
          this.router.navigate(["/login"]);
        }
      }
    });
  }

  extrairGanhos(grafico: GraficoItem[]): number[] {
    return grafico.map(gf => gf.faturamento);
  }

  extrairData(grafico: GraficoItem[], tipo: string): string[] {
    if (tipo == 'dia') {
      return grafico.map(d => d.hora);
    } else if (tipo == "mes") {
      return grafico.map(d => d.dia);
    } else {
      return grafico.map(d => d.mes);
    }
  }

  /* GERENTE */
  preecherDashboardGerente(periodo: string) {
    this.dashboardService.getDadosDashboardGerente(this.request).subscribe({
      next: (response) => {
        const dados = response.body!;
        this.totalMembros = dados.equipe.totalMembros;
        this.funcionarioDestaque = dados.equipe.funcionarioDestaque;

        this.graficoTipoMembros.series = [{ data: [{ x: 'funcionário', y: dados.equipe.qtdFuncionarios }, { x: 'gerente', y: dados.equipe.qtdGerentes }, { x: 'administrador', y: dados.equipe.qtdAdministrador }] }];
        this.graficoTipoMembros.title = { text: "Equipe Lava Jato", style: { fontSize: 12 } }
        this.cdr.detectChanges();

        this.clientesAtendidos = dados.atendimento.clientesAtendidos;
        this.servicosFinalizados = dados.atendimento.servicosFinalizados;
        this.ordensEmAndamento = dados.atendimento.ordensEmAndamento;

        this.graficoTipoVeiculos.series = [{ name: "quantidade", data: this.extrairQuantidadeVeiculo(dados.atendimento.veiculos) }];
        this.graficoTipoVeiculos.xaxis = { categories: this.extrairTipoVeiculo(dados.atendimento.veiculos) };
        if (periodo == 'dia')
          this.graficoTipoVeiculos.title = { text: `Veículos finalizados no dia ${this.request.periodo}`, style: { fontSize: 12 } }
        else if (periodo == 'mes')
          this.graficoTipoVeiculos.title = { text: `Veículos finalizados no mês ${this.request.periodo}`, style: { fontSize: 12 } }
        else
          this.graficoTipoVeiculos.title = { text: `Veículos finalizados no ano de ${this.request.periodo}`, style: { fontSize: 12 } }
        this.graficoTipoVeiculos.colors = ['#FF0000', '#00FF00', '#0000FF', '#FFA500'];
        this.graficoTipoVeiculos.plotOptions = { bar: { distributed: true } };
        this.cdr.detectChanges();

        this.totalBruto = dados.faturamento.totalBruto;
        this.totalLiquido = dados.faturamento.totalLiquido;

        this.graficoFaturamento.series = [{ name: "Valor Líquido", data: this.extrairGanhosGraficoFaturamento(dados.faturamento, "liquido") }, { name: "Valor Bruto", data: this.extrairGanhosGraficoFaturamento(dados.faturamento, "bruto") }];
        this.graficoFaturamento.xaxis = { categories: this.extrairDataGraficoFaturamento(dados.faturamento, periodo) };
        if (periodo == 'dia')
          this.graficoFaturamento.title = { text: `Faturamento Bruto/Líquido do dia ${this.request.periodo}`, style: { fontSize: 12 } };
        else if (periodo == 'mes')
          this.graficoFaturamento.title = { text: `Faturamento Bruto/Líquido do mês ${this.request.periodo}`, style: { fontSize: 12 } };
        else
          this.graficoFaturamento.title = { text: `Faturamento Bruto/Líquido do ano de ${this.request.periodo}`, style: { fontSize: 12 } };
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status == 403) {
          this.router.navigate(["/login"]);
          return;
        }
      }
    });
  }

  extrairQuantidadeVeiculo(veiculos: DadosVeiculos[]): number[] {
    return veiculos.map(v => v.quantidade);
  }

  extrairTipoVeiculo(veiculos: DadosVeiculos[]): string[] {
    return veiculos.map(v => v.tipo);
  }

  extrairDataGraficoFaturamento(faturamento: DadosFaturamento, periodo: string): string[] {
    if (periodo == 'dia') {
      return faturamento.dadosGraficoBruto.map(f => f.hora);
    } else if (periodo == "mes") {
      return faturamento.dadosGraficoBruto.map(f => f.dia);
    } else {
      return faturamento.dadosGraficoBruto.map(f => f.mes);
    }
  }

  extrairGanhosGraficoFaturamento(faturamento: DadosFaturamento, tipo: string): number[] {
    if (tipo == 'bruto')
      return faturamento.dadosGraficoBruto.map(f => f.valorBruto);
    else
      return faturamento.dadosGraficoLiquido.map(f => f.valorLiquido);
  }

}
