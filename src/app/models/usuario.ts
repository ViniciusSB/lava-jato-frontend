export interface Usuario {
    id?: number;
    nome: string;
    email: string;
    senha?: string;
    tipo: string;
    status: string;
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
    id: string;
    nome: string;
    email: string;
    tipo: string;
    urlFoto: string;
    status: string;
    mensagem: string;
}

export interface UsuarioLogado {
    idUsuario: number;
    nome: string;
    email: string;
    tipoUsuario: string;
    urlFoto: string;
}