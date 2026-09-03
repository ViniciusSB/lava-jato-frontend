import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { OrdemServicoRequest, OrdemServicoResponse } from '../../models/ordemServico';

@Injectable({providedIn: 'root'})
export class OrdemServicoService {
    private urlBase = "http://localhost:8080/ordemServico";
    private token = localStorage.getItem("token");

    constructor(private http: HttpClient){}

    private ordemServicoSubject = new BehaviorSubject<OrdemServicoResponse[]>([]);
    ordemServicos = this.ordemServicoSubject.asObservable();

    getAll(qtdPaginanacao: number, pagina: number) {
        const body = {"qtdPaginanacao": qtdPaginanacao, "pagina": pagina};
        const headers = { Authorization: `Bearer ${this.token}` };
        this.http.post<OrdemServicoResponse[]>(`${this.urlBase}/listar`, body, {headers}).subscribe(
            data => {
                this.ordemServicoSubject.next(data);
            }
        );
    }

    create(osr: OrdemServicoRequest){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.post<OrdemServicoRequest>(`${this.urlBase}/gerar`, osr, {headers}).pipe(
            tap( () => this.getAll(10, 1) )
        );
    }

    update(osr: OrdemServicoRequest){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.put<OrdemServicoRequest>(`${this.urlBase}/atualizar`, osr, {headers}).pipe(
            tap( () => this.getAll(10, 1) )
        );
    }

    delete(id: number){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.delete(`${this.urlBase}/deletar/${id}`, {headers}).pipe(
            tap( () => this.getAll(10, 1) )
        )
    }
}