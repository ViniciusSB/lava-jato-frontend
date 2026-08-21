export interface Veiculo {
    id?: number;
    marca: string;
    modelo: string;
    cor: string
    placa?: string;
    tipo: string;
    clienteId: number;
    clienteNome: string
}