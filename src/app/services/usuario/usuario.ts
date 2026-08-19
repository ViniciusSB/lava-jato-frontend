import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../models/usuario';

@Injectable({providedIn: 'root'})
export class UsuarioService {
    private urlBase = "http://localhost:8080/usuario";

    constructor(private http: HttpClient){}

    getAll(): Observable<Usuario[]> {
        return this.http.get<Usuario[]>(`${this.urlBase}/listar`);
    }

    create(usuario: Usuario): Observable<Usuario> {
        return this.http.post<Usuario>(`${this.urlBase}/cadastrar`, usuario);
    }

    update(usuario: Usuario): Observable<Usuario> {
        return this.http.put<Usuario>(`${this.urlBase}/atualizar`, usuario);
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(`${this.urlBase}/deletar/${id}`)
    }
}