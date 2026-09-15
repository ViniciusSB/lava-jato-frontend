import { UsuarioLogado, UsuarioLoginResponse } from "../models/usuario";

export class AuthUtil {

    static coletarDadosLogin(usuario: UsuarioLoginResponse):void {
        localStorage.setItem('idUsuario', usuario.idUsuario);
        localStorage.setItem('nome', usuario.nome);
        localStorage.setItem('email', usuario.email);
        localStorage.setItem('token', usuario.token);
        localStorage.setItem('tipoUsuario', usuario.tipoUsuario);
        localStorage.setItem('urlFoto', usuario.urlFoto);
    }

    static limparDadosLocaisUsuario():void {
        localStorage.setItem('idUsuario', "");
        localStorage.setItem('nome', "");
        localStorage.setItem('email', "");
        localStorage.setItem('token', "");
        localStorage.setItem('tipoUsuario', "");
        localStorage.setItem('urlFoto', "");
    }

    static obterDadosUsuarioLogado():UsuarioLogado {
        let usuario: UsuarioLogado = {
            idUsuario: Number(localStorage.getItem('idUsuario')),
            nome: localStorage.getItem('nome') || "",
            email: localStorage.getItem('email') || "",
            tipoUsuario: localStorage.getItem('tipoUsuario') || "",
            urlFoto: localStorage.getItem('urlFoto') || ""
        };
        return usuario;
    }
}