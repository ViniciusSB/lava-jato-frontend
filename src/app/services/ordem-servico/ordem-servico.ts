import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { DadosPaginacaoOrdemServico, OrdemServicoFiltros, OrdemServicoRequest, OrdemServicoResponse } from '../../models/ordemServico';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdemServicoService {
    private apiUrl = environment.apiUrl;
    private urlBase = `${this.apiUrl}/ordemServico`;

    constructor(private http: HttpClient) { }
    filtros: OrdemServicoFiltros = { tipo: '', termo: '', intervaloTempo: '', periodo: '', paginacao: 10, pagina: 1 };

    private ordemServicoSubject = new BehaviorSubject<DadosPaginacaoOrdemServico>({
        totalItens: 0,
        totalPaginas: 0,
        pagAtual: 1,
        ordemServico: []
    });
    ordemServicos = this.ordemServicoSubject.asObservable();

    getAll(filtros: OrdemServicoFiltros) {
        this.http.post<DadosPaginacaoOrdemServico>(`${this.urlBase}/listar`, filtros).subscribe(
            data => {
                this.ordemServicoSubject.next(data);
            }
        );
    }

    create(osr: OrdemServicoRequest) {
        return this.http.post<OrdemServicoRequest>(`${this.urlBase}/gerar`, osr).pipe(
            tap(() => this.getAll(this.filtros))
        );
    }

    update(osr: OrdemServicoRequest) {
        return this.http.put<OrdemServicoRequest>(`${this.urlBase}/atualizar`, osr).pipe(
            tap(() => this.getAll(this.filtros))
        );
    }

    delete(id: number) {
        return this.http.delete(`${this.urlBase}/deletar/${id}`).pipe(
            tap(() => this.getAll(this.filtros))
        )
    }
}