import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../../models/usuario';

@Injectable({providedIn: 'root'})
export class UsuarioService {
    private urlBase = "http://localhost:8080/usuario";
    private token = localStorage.getItem("token");

    constructor(private http: HttpClient){}

    private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
    usuarios = this.usuariosSubject.asObservable();

    getAll() {
        const headers = { Authorization: `Bearer ${this.token}` };
        this.http.get<Usuario[]>(`${this.urlBase}/listar`, {headers}).subscribe(
            data => {
                this.usuariosSubject.next(data);
            }
        );
    }

    create(usuario: Usuario){
        const headers = { Authorization: `Bearer ${this.token}`};
        return this.http.post<Usuario>(`${this.urlBase}/cadastrar`, usuario, {headers}).pipe(
            tap( () => this.getAll() )
        );
    }

    update(usuario: Usuario){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.put<Usuario>(`${this.urlBase}/atualizar`, usuario, {headers}).pipe(
            tap( () => this.getAll() )
        );
    }

    delete(id: number){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.delete(`${this.urlBase}/deletar/${id}`, {headers}).pipe(
            tap( () => this.getAll() )
        )
    }
}