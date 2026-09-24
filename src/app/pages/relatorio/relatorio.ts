import { ChangeDetectorRef, Component } from '@angular/core';
import { RelatorioService } from '../../services/relatorio/relatorio';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RelatorioRequest } from '../../models/relatorio';
import { FormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { AuthUtil } from '../../util/auth-util';
import { UsuarioLogado } from '../../models/usuario';
import { DataUtil } from '../../util/data-util';

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

  usuarioLogado: UsuarioLogado = AuthUtil.obterDadosUsuarioLogado();
  urlFoto: string = "";

  userOpcoes = false;
  opcoesLowScreen = false;
  mensagemErro = '';
  loading = false;

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

  relatorioSelecionado = this.usuarioLogado.tipoUsuario === 'FUNCIONARIO' ? "funcionario" : "faturamento";
  
  diaAtual = DataUtil.obterDiaAtual();
  mesAtual = DataUtil.obterMesAtual();
  anoAtual = DataUtil.obterAnoAtual();
  mascaraPeriodo = '00-00-0000';
  placeholderPeriodo = 'dd-mm-aaaa';

  relatorioRequest: RelatorioRequest = {
    tipo: 'dia',
    periodo: `${this.diaAtual}-${this.mesAtual}-${this.anoAtual}`
  };

  constructor(private relatorioService: RelatorioService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.usuarioLogado.urlFoto == null || this.usuarioLogado.urlFoto === "" || this.usuarioLogado.urlFoto === "null")
      this.urlFoto = this.usuarioLogado.tipoUsuario === "GERENTE" ? "gerente.png" : this.usuarioLogado.tipoUsuario === "FUNCIONARIO" ? "funcionario.png" : "admin.png";
    else
      this.urlFoto = this.usuarioLogado.urlFoto;
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
        this.relatorioRequest.periodo = `${this.mesAtual}-${this.anoAtual}`;
        break;
      case 'ano':
        this.mascaraPeriodo = '0000';
        this.placeholderPeriodo = 'aaaa';
        this.relatorioRequest.periodo = `${this.anoAtual}`;
        break;
      default:
        this.mascaraPeriodo = '00-00-0000';
        this.placeholderPeriodo = 'dd-mm-aaaa';
        this.relatorioRequest.periodo = `${this.diaAtual}-${this.mesAtual}-${this.anoAtual}`;
        break;
    }
  }

  logout(): void {
    AuthUtil.limparDadosLocaisUsuario();
    this.cdr.markForCheck();
    this.router.navigate(["/login"]);
  }

  fecharOpcoesLowScreen(): void {
    this.opcoesLowScreen = !this.opcoesLowScreen;
  }

  menuOpcoesUsuario(): void {
    this.userOpcoes = !this.userOpcoes;
  }

  get relatoriosPermitidos() {
    if (this.usuarioLogado.tipoUsuario === 'ADM') {
      return this.tipoRelatorio;
    }
    return this.tipoRelatorio.filter(r => r.acesso === this.usuarioLogado.tipoUsuario);
  }

  fecharMsgErro() {
    this.mensagemErro = "";
  }

  relizarValidacoes(): boolean {
    let resultado;
    if (this.relatorioRequest.tipo === "dia") {
      resultado = DataUtil.validarPeriodoDia(this.relatorioRequest.periodo); 
      this.relatorioRequest.periodo = resultado.dataFormatada;
      if (!resultado.valido) {
        this.mensagemErro = resultado.mensagem!;
        return false;
      }
    } else if (this.relatorioRequest.tipo === "mes") {
      resultado = DataUtil.validarPeriodoMes(this.relatorioRequest.periodo); 
      this.relatorioRequest.periodo = resultado.dataFormatada;
      if (!resultado.valido) {
        this.mensagemErro = resultado.mensagem!;
        return false;
      }
    } else {
      resultado = DataUtil.validarPeriodoAno(this.relatorioRequest.periodo); 
      this.relatorioRequest.periodo = resultado.dataFormatada;
      if (!resultado.valido) {
        this.mensagemErro = resultado.mensagem!;
        return false;
      }
    }
    
    this.mensagemErro = "";
    return true;
  }

  emitir() {
    if (!this.relizarValidacoes()) {
      return;
    }

    this.loading = true;

    switch (this.relatorioSelecionado) {
      case 'funcionario':
        this.relatorioRequest.funcionarioId = this.usuarioLogado.idUsuario;
        this.relatorioService.relatorioFuncionario(this.relatorioRequest).subscribe({
          next: (data: Blob) => {
            const fileURL = URL.createObjectURL(data);
            this.loading = false;
            this.cdr.markForCheck();
            window.open(fileURL);
          },
          error: (erro) => {
            this.loading = false;
            console.log(erro);
            this.cdr.markForCheck();
          }
        });
        break;
      case 'faturamento':
        this.relatorioService.relatorioFaturamento(this.relatorioRequest).subscribe({
          next: (data: Blob) => {
            const fileURL = URL.createObjectURL(data);
            this.loading = false;
            this.cdr.markForCheck();
            window.open(fileURL);
          },
          error: (erro) => {
            this.loading = false;
            console.log(erro);
            this.cdr.markForCheck();
          }
        });
        break;
      case 'clientes':
        this.relatorioService.relatorioClientes(this.relatorioRequest).subscribe({
          next: (data: Blob) => {
            const fileURL = URL.createObjectURL(data);
            this.loading = false;
            this.cdr.markForCheck();
            window.open(fileURL);
          },
          error: (erro) => {
            this.loading = false;
            console.log(erro);
            this.cdr.markForCheck();
          }
        });
        break;
      case 'funcionarios':
        this.relatorioService.relatorioFuncionarios(this.relatorioRequest).subscribe({
          next: (data: Blob) => {
            const fileURL = URL.createObjectURL(data);
            this.loading = false;
            this.cdr.markForCheck();
            window.open(fileURL);
          },
          error: (erro) => {
            this.loading = false;
            console.log(erro);
            this.cdr.markForCheck();
          }
        });
        break;
    }
  }
}