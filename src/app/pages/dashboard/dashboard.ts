import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '../../services/dashboard/dashboard';
import { DashboardFuncionario, DashboardFuncionarioRequest, GraficoItem } from '../../models/dashboard';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  public chartOptions: any;
  public ordensFinalizadas = 0;
  public ordensEmAndamento = 0;
  public faturamentoTotal = 0;

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {
    this.chartOptions = {
      series: [],
      chart: { type: "line", toolbar: { show: true }, background: "#FFFFFF" },
      xaxis: { categories: [] },
      title: { text: "Ordens de Serviço Finalizadas", style: { color: "#000" } }
    };
  }

  tipos = ['dia', 'mes', 'ano'];
  request: DashboardFuncionarioRequest = {
    tipo: 'dia',
    periodo: '25'
  };

  alterarTipo(tipo: string) {
    this.request.tipo = tipo;
    this.carregarDados();
  }

  selecionarPeriodo(event: Event) {
    const input = event.target as HTMLInputElement;
    const data = input.value; 
    console.log(this.request.periodo);

    if (!data)
      return;

    const dataValida = new Date(data);
    if (isNaN(dataValida.getTime()))
      return;

    if (dataValida > new Date())
      return;

    this.request.periodo = this.formatarData(data, this.request.tipo);
    this.carregarDados();
  }

  ngOnInit() {
    // Inicialmente traz os dados do dia
    this.request = { periodo: '25', tipo: 'dia' };

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

  formatarData(data: string, tipo: string):string {
    let dataVetor = data.split("-");
    let dataFormatada = `${dataVetor[2]}-${dataVetor[1]}-${dataVetor[0]}`
    return dataFormatada;
  }

}
