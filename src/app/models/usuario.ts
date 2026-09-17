export interface Usuario {
    id?: number;
    nome: string;
    email: string;
    senha?: string;
    tipo: string;
}

export interface UsuarioRequest {
    id?: number,
    nome?: string;
    email?: string;
    senha?: string;
    tipo?: string;
    urlFoto?: string;
}

export interface UsuarioLoginResponse {
    idUsuario: string;
    nome: string;
    email: string;
    token: string;
    tipoUsuario: string;
    urlFoto: string;
}

export interface UsuarioResponse {
    idUsuario: string;
    nome: string;
    email: string;
    tipoUsuario: string;
    urlFoto: string;
    mensagem: string;
}

export interface UsuarioLogado {
    idUsuario: number;
    nome: string;
    email: string;
    tipoUsuario: string;
    urlFoto: string;
}