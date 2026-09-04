import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { DadosPaginacaoOrdemServico, OrdemServicoFiltros, OrdemServicoRequest, OrdemServicoResponse } from '../../models/ordemServico';

@Injectable({ providedIn: 'root' })
export class OrdemServicoService {
    private urlBase = "http://localhost:8080/ordemServico";
    private token = localStorage.getItem("token");

    constructor(private http: HttpClient) { }
    filtros: OrdemServicoFiltros = { tipo: '', termo: '', paginacao: 10, pagina: 1 };

    private ordemServicoSubject = new BehaviorSubject<DadosPaginacaoOrdemServico>({
        totalItens: 0,
        totalPaginas: 0,
        pagAtual: 1,
        ordemServico: []
    });
    ordemServicos = this.ordemServicoSubject.asObservable();

    getAll(filtros: OrdemServicoFiltros) {
        const headers = { Authorization: `Bearer ${this.token}` };
        this.http.post<DadosPaginacaoOrdemServico>(`${this.urlBase}/listar`, filtros, { headers }).subscribe(
            data => {
                this.ordemServicoSubject.next(data);
            }
        );
    }

    create(osr: OrdemServicoRequest) {
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.post<OrdemServicoRequest>(`${this.urlBase}/gerar`, osr, { headers }).pipe(
            tap(() => this.getAll(this.filtros))
        );
    }

    update(osr: OrdemServicoRequest) {
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.put<OrdemServicoRequest>(`${this.urlBase}/atualizar`, osr, { headers }).pipe(
            tap(() => this.getAll(this.filtros))
        );
    }

    delete(id: number) {
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.delete(`${this.urlBase}/deletar/${id}`, { headers }).pipe(
            tap(() => this.getAll(this.filtros))
        )
    }
}