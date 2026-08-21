import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';
import { OrdemServicoRequest, OrdemServicoResponse } from '../../models/ordemServico';

@Injectable({providedIn: 'root'})
export class OrdemServicoService {
    private urlBase = "http://localhost:8080/ordemServico";

    constructor(private http: HttpClient){}

    private ordemServicoSubject = new BehaviorSubject<OrdemServicoResponse[]>([]);
    ordemServicos = this.ordemServicoSubject.asObservable();

    getAll() {
        this.http.get<OrdemServicoResponse[]>(`${this.urlBase}/listar`).subscribe(
            data => {
                this.ordemServicoSubject.next(data);
            }
        );
    }

    create(osr: OrdemServicoRequest){
        return this.http.post<OrdemServicoRequest>(`${this.urlBase}/gerar`, osr).pipe(
            tap( () => this.getAll() )
        );
    }

    update(osr: OrdemServicoRequest){
        return this.http.put<OrdemServicoRequest>(`${this.urlBase}/atualizar`, osr).pipe(
            tap( () => this.getAll() )
        );
    }

    delete(id: number){
        return this.http.delete(`${this.urlBase}/deletar/${id}`).pipe(
            tap( () => this.getAll() )
        )
    }
}