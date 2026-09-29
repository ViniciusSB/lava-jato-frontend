import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '../../services/dashboard/dashboard';
import { DadosFaturamento, DadosVeiculos, DashboardFuncionarioRequest, FuncionarioDestaque, GraficoItem } from '../../models/dashboard';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { Router, RouterModule } from '@angular/router';
import { AuthUtil } from '../../util/auth-util';
import { UsuarioLogado } from '../../models/usuario';
import { DataUtil } from '../../util/data-util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule, FormsModule, NgxMaskDirective, RouterModule],
  providers: [provideNgxMask({ dropSpecialCharacters: false })],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  usuarioLogado: UsuarioLogado = AuthUtil.obterDadosUsuarioLogado();
  urlFoto: string = "";

  userOpcoes = false;
  opcoesLowScreen = false;
  opcoesDasboardLowScreen = false;
  botoesNavegacao = true;
  paginacaoInferior = true;

  itemCarousel = 1;
  carouselAutomatico = this.usuarioLogado.tipoUsuario !== 'FUNCIONARIO' ? true : false;
  timerCarousel: number = 0;

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
  diaAtual = DataUtil.obterDiaAtual();
  mesAtual = DataUtil.obterMesAtual();
  anoAtual = DataUtil.obterAnoAtual();
  campoPeriodo = "";
  mascaraPeriodo = "00-00-0000"
  placeholderPeriodo = "dd-mm-aaaa"
  tipos = ['dia', 'mes', 'ano'];
  request: DashboardFuncionarioRequest = { tipo: '', periodo: '' };

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.campoPeriodo = `${this.diaAtual}-${this.mesAtual}-${this.anoAtual}`;
    this.iniciarGraficos();

    if (this.usuarioLogado.urlFoto == null || this.usuarioLogado.urlFoto === "" || this.usuarioLogado.urlFoto === "null")
      this.urlFoto = this.usuarioLogado.tipoUsuario === "GERENTE" ? "gerente.png" : this.usuarioLogado.tipoUsuario === "FUNCIONARIO" ? "funcionario.png" : "admin.png";
    else
      this.urlFoto = this.usuarioLogado.urlFoto;

    // Inicialmente traz os dados do dia
    this.request = { periodo: this.campoPeriodo, tipo: 'dia' };
    this.preencherDashboards(this.request.tipo);
    if (this.usuarioLogado.tipoUsuario !== 'FUNCIONARIO')
      this.iniciarCarouselAtomatico();
  }

  fecharOpcoesLowScreen() {
    this.opcoesLowScreen = !this.opcoesLowScreen;
  }

  alternarOpcoesDashboardLowScreen() {
    this.opcoesDasboardLowScreen = !this.opcoesDasboardLowScreen;
  }

  alternarBotoesNavegacao() {
    this.botoesNavegacao = !this.botoesNavegacao;
  }

  alternarPaginacaoInferior() {
    this.paginacaoInferior = !this.paginacaoInferior;
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

  avancarNavegacao() {
    const periodos = this.request.periodo.split('-');
    if (this.request.tipo === 'dia') {
      const dia = DataUtil.normalizarNumero(Number(periodos[0]) + 1);
      this.campoPeriodo = `${dia}-${periodos[1]}-${periodos[2]}`;
      this.filtrar();
    } else if (this.request.tipo === 'mes') {
      const mes = DataUtil.normalizarNumero(Number(periodos[0]) + 1);
      this.campoPeriodo = `${mes}-${periodos[1]}`;
      this.filtrar();
    } else {
      const ano = DataUtil.normalizarNumero(Number(periodos[0]) + 1);
      this.campoPeriodo = ano.toString();
      this.filtrar();
    }

    if (this.mensagemErro !== '')
      this.campoPeriodo = this.request.periodo;
  }

  retrocederNavegacao() {
    const periodos = this.request.periodo.split('-');
    if (this.request.tipo === 'dia') {
      const dia = DataUtil.normalizarNumero(Number(periodos[0]) - 1);
      this.campoPeriodo = `${dia}-${periodos[1]}-${periodos[2]}`;
      this.filtrar();
    } else if (this.request.tipo === 'mes') {
      const mes = DataUtil.normalizarNumero(Number(periodos[0]) - 1);
      this.campoPeriodo = `${mes}-${periodos[1]}`;
      console.log(this.campoPeriodo);
      this.filtrar();
    } else {
      const ano = DataUtil.normalizarNumero(Number(periodos[0]) - 1);
      this.campoPeriodo = ano.toString();
      this.filtrar();
    }

    if (this.mensagemErro !== '')
      this.campoPeriodo = this.request.periodo;
  }

  avancarManual() {
    this.avancarCarousel();
    if (this.carouselAutomatico)
      this.iniciarCarouselAtomatico();
  }

  avancarCarousel() {
    if (this.itemCarousel == 3) {
      this.itemCarousel = 1;
    } else {
      this.itemCarousel = this.itemCarousel + 1;
    }
  }

  retrocederManual() {
    this.retrocederCarousel();
    if (this.carouselAutomatico)
      this.iniciarCarouselAtomatico();
  }

  retrocederCarousel() {
    if (this.itemCarousel == 1) {
      this.itemCarousel = 3;
    } else {
      this.itemCarousel = this.itemCarousel - 1;
    }
  }

  indiceManualCarousel(indice: number) {
    this.itemCarousel = indice;
    if (this.carouselAutomatico)
      this.iniciarCarouselAtomatico()
  }

  iniciarCarouselAtomatico() {
    if (this.timerCarousel) {
      clearInterval(this.timerCarousel);
    }

    this.timerCarousel = setInterval(() => {
      this.avancarCarousel();
      this.cdr.markForCheck();
    }, 8000);
  }

  pararCarouselAutomaticoManual() {
    clearInterval(this.timerCarousel);
    this.carouselAutomatico = false;
  }

  iniciarCarouselAtomaticoManual() {
    this.carouselAutomatico = true;
    this.iniciarCarouselAtomatico();
  }

  filtrar() {
    let resultado;
    if (this.request.tipo == "dia") {
      if (this.campoPeriodo.length == 1) {
        this.campoPeriodo = DataUtil.normalizarNumero(Number(this.campoPeriodo));
      }
      resultado = DataUtil.validarPeriodoDia(this.campoPeriodo);
      this.campoPeriodo = resultado.dataFormatada;
      if (!resultado.valido) {
        this.mensagemErro = resultado.mensagem!;
        return;
      }
    }

    else if (this.request.tipo == "mes") {
      if (this.campoPeriodo.length == 1) {
        this.campoPeriodo = DataUtil.normalizarNumero(Number(this.campoPeriodo));
      }
      resultado = DataUtil.validarPeriodoMes(this.campoPeriodo);
      this.campoPeriodo = resultado.dataFormatada;
      if (!resultado.valido) {
        this.mensagemErro = resultado.mensagem!;
        return;
      }
    }

    else if (this.request.tipo == "ano") {
      resultado = DataUtil.validarPeriodoAno(this.campoPeriodo);
      if (!resultado.valido) {
        this.mensagemErro = resultado.mensagem!;
        return;
      }
    }

    this.request.periodo = this.campoPeriodo;
    this.mensagemErro = "";
    this.resetarDadosDashboard();
    this.preencherDashboards(this.request.tipo);
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
      title: { text: titulo, style: { fontSize: 12 } }
    };
  }

  preencherDashboards(periodo: string) {
    if (this.usuarioLogado.tipoUsuario === 'GERENTE' || this.usuarioLogado.tipoUsuario === 'ADM') {
      this.preecherDashboardGerente(periodo);
    } else if (this.usuarioLogado.tipoUsuario === 'FUNCIONARIO')
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
    AuthUtil.limparDadosLocaisUsuario();
    this.cdr.markForCheck();
    this.router.navigate(["/login"]);
  }

  /* FUNCIONARIO */
  preecherDashboardFuncionario(periodo: string) {
    this.dashboardService.getDadosDashboardFuncionario(this.usuarioLogado.idUsuario, this.request).subscribe({
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

  ngOnDestroy(): void {
    if (this.timerCarousel) {
      clearInterval(this.timerCarousel);
    }
  }

}
