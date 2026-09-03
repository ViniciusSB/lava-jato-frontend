import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Cliente } from '../../models/cliente';

@Injectable({providedIn: 'root'})
export class ClienteService {
    private urlBase = "http://localhost:8080/cliente";

    constructor(private http: HttpClient){}

    private clientesSubject = new BehaviorSubject<Cliente[]>([]);
    clientes = this.clientesSubject.asObservable();
    private token = localStorage.getItem("token");

    getAll() {
        const headers = { Authorization: `Bearer ${this.token}` };
        this.http.get<Cliente[]>(`${this.urlBase}/listar`, {headers, observe: 'response'} ).subscribe(
            response => {
                this.clientesSubject.next(response.body ?? []);
            }
        );
    }

    create(usuario: Cliente){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.post<Cliente>(`${this.urlBase}/cadastrar`, usuario, {headers}).pipe(
            tap( () => this.getAll() )
        );
    }

    update(usuario: Cliente){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.put<Cliente>(`${this.urlBase}/atualizar`, usuario, {headers}).pipe(
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