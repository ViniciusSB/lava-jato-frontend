import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { Servico } from '../../models/servico';

@Injectable({ providedIn: 'root' })
export class ServicoService {
    private urlBase = "http://localhost:8080/servico";
    private token = localStorage.getItem("token");

    constructor(private http: HttpClient) { }

    private servicoSubject = new BehaviorSubject<Servico[]>([]);
    servicos = this.servicoSubject.asObservable();

    getAll() {
        const headers = { Authorization: `Bearer ${this.token}` };
        this.http.get<Servico[]>(`${this.urlBase}/listar`, {headers}).subscribe(
            data => {
                this.servicoSubject.next(data);
            }
        );
    }

    create(usuario: Servico) {
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.post<Servico>(`${this.urlBase}/criar`, usuario, {headers}).pipe(
            tap(() => this.getAll())
        );
    }

    update(usuario: Servico) {
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.put<Servico>(`${this.urlBase}/atualizar`, usuario, {headers}).pipe(
            tap(() => this.getAll())
        );
    }

    delete(id: number) {
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.delete(`${this.urlBase}/deletar/${id}`, {headers}).pipe(
            tap(() => this.getAll())
        )
    }
}