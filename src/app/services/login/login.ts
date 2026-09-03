import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { Usuario, UsuarioRequest } from '../../models/usuario';

@Injectable({ providedIn: 'root' })
export class LoginService {

    private urlAuth = "http://localhost:8080/auth";

    constructor(private http: HttpClient) { }

    fazerLogin(usuarioRequest: UsuarioRequest) {
        return this.http.post<{ token: string, tipoUsuario: string, idUsuario: string }>(
            `${this.urlAuth}/login`,
            usuarioRequest
        ).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('tipoUsuario', response.tipoUsuario);
                localStorage.setItem('idUsuario', response.idUsuario);
            })
        );
    }

    cadastrar(usuarioRequest: UsuarioRequest) {
        return this.http.post<UsuarioRequest>(`${this.urlAuth}/cadastrar`, usuarioRequest, { observe: 'response' });
    }
}