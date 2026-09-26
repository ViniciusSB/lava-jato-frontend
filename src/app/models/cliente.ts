import { Veiculo } from "./veiculo";

export interface Cliente {
    id: number,
    nome: string,
    celular: string,
    fidelidade: number,
    status: string,
    veiculos: Veiculo[]
}