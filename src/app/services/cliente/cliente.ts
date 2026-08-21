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

    getAll() {
        this.http.get<Cliente[]>(`${this.urlBase}/listar`).subscribe(
            data => {
                this.clientesSubject.next(data);
            }
        );
    }

    create(usuario: Cliente){
        return this.http.post<Cliente>(`${this.urlBase}/cadastrar`, usuario).pipe(
            tap( () => this.getAll() )
        );
    }

    update(usuario: Cliente){
        return this.http.put<Cliente>(`${this.urlBase}/atualizar`, usuario).pipe(
            tap( () => this.getAll() )
        );
    }

    delete(id: number){
        return this.http.delete(`${this.urlBase}/deletar/${id}`).pipe(
            tap( () => this.getAll() )
        )
    }
}