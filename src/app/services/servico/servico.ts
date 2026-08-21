import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Servico } from '../../models/servico';

@Injectable({providedIn: 'root'})
export class ServicoService {
    private urlBase = "http://localhost:8080/servico";

    constructor(private http: HttpClient){}

    private servicoSubject = new BehaviorSubject<Servico[]>([]);
    servicos = this.servicoSubject.asObservable();

    getAll() {
        this.http.get<Servico[]>(`${this.urlBase}/listar`).subscribe(
            data => {
                this.servicoSubject.next(data);
            }
        );
    }

    create(usuario: Servico){
        return this.http.post<Servico>(`${this.urlBase}/criar`, usuario).pipe(
            tap( () => this.getAll() )
        );
    }

    update(usuario: Servico){
        return this.http.put<Servico>(`${this.urlBase}/atualizar`, usuario).pipe(
            tap( () => this.getAll() )
        );
    }

    delete(id: number){
        return this.http.delete(`${this.urlBase}/deletar/${id}`).pipe(
            tap( () => this.getAll() )
        )
    }
}