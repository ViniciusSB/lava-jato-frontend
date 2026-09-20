import { Cliente } from "./cliente";
import { Servico } from "./servico";
import { Usuario } from "./usuario";
import { Veiculo } from "./veiculo";

export interface DadosPaginacaoOrdemServico {
    totalItens: number;
    totalPaginas: number;
    pagAtual: number;
    ordemServico: OrdemServicoResponse[];
}

export interface OrdemServicoResponse {
    id: number;
    preco: number;
    servico?: Servico;
    status: string;
    cliente?: Cliente;
    veiculo?: Veiculo;
    funcionario?: Usuario;
    dataInicio: string;
}

export interface OrdemServicoRequest {
    ordemServicoId?: number;
    funcionarioId?: number | null;
    clienteId?: number | null;
    veiculoId?: number | null;
    servicoId?: number | null;
    status?: string;
}

export interface OrdemServicoFiltros {
    tipo: string;
    termo: string;
    paginacao: number;
    pagina: number;
    intervaloTempo: string;
    periodo: string;
}