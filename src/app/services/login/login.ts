import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { UsuarioLoginResponse, UsuarioRequest } from '../../models/usuario';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LoginService {
    private apiUrl = environment.apiUrl;
    private urlAuth = `${this.apiUrl}/auth`;

    constructor(private http: HttpClient) { }

    fazerLogin(usuarioRequest: UsuarioRequest) {
        return this.http.post<UsuarioLoginResponse>(
            `${this.urlAuth}/login`,
            usuarioRequest
        )
    }

    cadastrar(usuarioRequest: UsuarioRequest) {
        return this.http.post<UsuarioRequest>(`${this.urlAuth}/cadastrar`, usuarioRequest, { observe: 'response' });
    }
}