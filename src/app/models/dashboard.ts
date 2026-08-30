export interface DashboardFuncionarioRequest {
  tipo: string; // dia, mes, ano
  periodo: string; // qual dia, mes, ano
}

export interface DashboardFuncionario {
  faturamentoTotal: number;
  ordensFinalizadas: number;
  ordensEmAndamento: number;
  grafico: GraficoItem[];
}

export interface GraficoItem {
  ano: string;
  hora: string;
  mes: string;
  dia: string;
  faturamento: number;
}

export interface DashboardGerenteRequest {
  tipo: string; //dia, mes, ano
  periodo: string; // qual dia, mes, ano
}

export interface DashboardGerente {
  equipe: DadosEquipe;
  atendimento: DadosAtendimento;
  faturamento: DadosFaturamento;
}

export interface DadosEquipe {
  totalMembros: number;
  funcionarioDestaque: FuncionarioDestaque;
  qtdFuncionarios: number;
  qtdGerentes: number;
  qtdAdministrador: number;
}

export interface FuncionarioDestaque { 
  nome: string;
  servicosConcluidos: number;
}

export interface DadosAtendimento {
  clientesAtendidos: number;
  servicosFinalizados: number;
  ordensEmAndamento: number;
  veiculos: DadosVeiculos[];
}

export interface DadosVeiculos {
  tipo: string;
  quantidade: number;
}

export interface DadosFaturamento {
  totalBruto: number;
  totalLiquido: number;
  dadosGraficoBruto: GraficoFaturamento[];
  dadosGraficoLiquido: GraficoFaturamento[];
}

export interface GraficoFaturamento {
  valorBruto: number;
  valorLiquido: number;
  hora: string;
  dia: string;
  mes: string;
  ano: string;
}

