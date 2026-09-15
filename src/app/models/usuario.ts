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

export interface UsuarioLoginResponse {
    idUsuario: string;
    nome: string;
    email: string;
    token: string;
    tipoUsuario: string;
    urlFoto: string;
}

export interface UsuarioLogado {
    idUsuario: number;
    nome: string;
    email: string;
    tipoUsuario: string;
    urlFoto: string;
}