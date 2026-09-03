export interface Usuario {
    id?: number;
    nome: string;
    email: string;
    senha?: string;
    tipo: string;
}

export interface UsuarioRequest {
    nome?: string;
    email: string;
    senha: string;
    tipo?: string;
}