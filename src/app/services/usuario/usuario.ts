import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../../models/usuario';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UsuarioService {
    private apiUrl = environment.apiUrl;
    private urlBase = `${this.apiUrl}/usuario`;

    constructor(private http: HttpClient){}

    private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
    usuarios = this.usuariosSubject.asObservable();

    getAll() {
        this.http.get<Usuario[]>(`${this.urlBase}/listar`).subscribe(
            data => {
                this.usuariosSubject.next(data);
            }
        );
    }

    create(usuario: Usuario){
        return this.http.post<Usuario>(`${this.urlBase}/cadastrar`, usuario).pipe(
            tap( () => this.getAll() )
        );
    }

    update(usuario: Usuario){
        return this.http.put<Usuario>(`${this.urlBase}/atualizar`, usuario).pipe(
            tap( () => this.getAll() )
        );
    }

    delete(id: number){
        return this.http.delete(`${this.urlBase}/deletar/${id}`).pipe(
            tap( () => this.getAll() )
        )
    }
}