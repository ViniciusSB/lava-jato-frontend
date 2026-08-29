import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '../../services/dashboard/dashboard';
import { DashboardFuncionario, DashboardFuncionarioRequest, GraficoItem } from '../../models/dashboard';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, FormsModule, NgxMaskDirective],
  providers: [provideNgxMask({ dropSpecialCharacters: false })],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  chartOptions: any;
  ordensFinalizadas = 0;
  ordensEmAndamento = 0;
  faturamentoTotal = 0;
  mensagemErro = "";
  diaAtual = "";
  mesAtual = "";
  anoAtual = "";
  campoPeriodo = "";
  mascaraPeriodo = "00-00-0000"
  placeholderPeriodo = "dd-mm-aaaa"

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {
    this.chartOptions = {
      series: [],
      chart: { type: "line", toolbar: { show: true }, background: "#FFFFFF" },
      xaxis: { categories: [] },
      title: { text: "Ordens de Serviço Finalizadas", style: { color: "#000" } }
    };
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

  tipos = ['dia', 'mes', 'ano'];
  request: DashboardFuncionarioRequest = {
    tipo: 'dia',
    periodo: this.diaAtual
  };

  alterarTipo(tipo: string) {
    this.request.tipo = tipo;
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
    this.carregarDados();
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
    this.carregarDados();
  }

  ngOnInit() {
    // Inicialmente traz os dados do dia
    this.request = { periodo: this.diaAtual, tipo: 'dia' };

    this.dashboardService.getDadosDashboardFuncionario(5, this.request).subscribe((dados: DashboardFuncionario) => {
      this.ordensFinalizadas = dados.ordensFinalizadas;
      this.ordensEmAndamento = dados.ordensEmAndamento;
      this.faturamentoTotal = dados.faturamentoTotal;

      const ganhos = this.extrairGanhos(dados.grafico);
      const data = this.extrairData(dados.grafico, "dia");

      this.chartOptions.series = [{ name: "Ganhos", data: ganhos }];
      this.chartOptions.xaxis = { categories: data };
      this.chartOptions.title = { text: "Ganhos diários R$ x Hora" }
      this.cdr.detectChanges();
    });
  }

  carregarDados() {
    this.dashboardService.getDadosDashboardFuncionario(5, this.request).subscribe((dados: DashboardFuncionario) => {
      this.ordensFinalizadas = dados.ordensFinalizadas;
      this.ordensEmAndamento = dados.ordensEmAndamento;
      this.faturamentoTotal = dados.faturamentoTotal;

      const ganhos = this.extrairGanhos(dados.grafico);
      const data = this.extrairData(dados.grafico, this.request.tipo);

      this.chartOptions.series = [{ name: "Ganhos", data: ganhos }];
      this.chartOptions.xaxis = { categories: data };
      if (this.request.tipo == 'dia')
        this.chartOptions.title = { text: "Ganhos diários R$ x Hora" };
      else if (this.request.tipo == 'mes')
        this.chartOptions.title = { text: "Ganhos Mensais R$ x Dia" };
      else
        this.chartOptions.title = { text: "Ganhos Anuais R$ x Mês" };

      this.cdr.detectChanges();
    });
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

  /* FUNCIONARIO */
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

}
