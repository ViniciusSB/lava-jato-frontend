export interface GraficoItem {
  ano: string;
  hora: string;
  mes: string;
  dia: string;
  faturamento: number;
}

export interface DashboardFuncionario {
  faturamentoTotal: number;
  ordensFinalizadas: number;
  ordensEmAndamento: number;
  grafico: GraficoItem[];
}

export interface DashboardFuncionarioRequest {
  tipo: string; // dia, mes, ano
  periodo: string; // qual dia, mes, ano
}
