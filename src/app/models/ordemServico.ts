import { Cliente } from "./cliente";
import { Servico } from "./servico";
import { Usuario } from "./usuario";
import { Veiculo } from "./veiculo";

export interface OrdemServicoResponse {
    id: number;
    preco: number;
    servico?: Servico;
    status: string;
    cliente?: Cliente;
    veiculo?: Veiculo;
    funcionario?: Usuario;
    observacao?: string;
    entregaDomicilio?: boolean;
    enderecoEntrega?: string;
}

export interface OrdemServicoRequest {
    ordemServicoId?: number;
    funcionarioId?: number | null;
    clienteId?: number | null;
    veiculoId?: number | null;
    servicoId?: number | null;
    status?: string;
}