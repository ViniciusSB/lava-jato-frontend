import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Veiculo } from '../../models/veiculo';

@Injectable({providedIn: 'root'})
export class VeiculoService {
    private urlBase = "http://localhost:8080/veiculo";

    constructor(private http: HttpClient){}

    private veiculosSubject = new BehaviorSubject<Veiculo[]>([]);
    veiculos = this.veiculosSubject.asObservable();

    getAll() {
        this.http.get<Veiculo[]>(`${this.urlBase}/listar`).subscribe(
            data => {
                this.veiculosSubject.next(data);
            }
        );
    }

    create(veiculo: Veiculo){
        return this.http.post<Veiculo>(`${this.urlBase}/cadastrar`, veiculo).pipe(
            tap( () => this.getAll() )
        );
    }

    criarEListarClienteSelecionado(veiculo: Veiculo, clienteId: number){
        return this.http.post<Veiculo>(`${this.urlBase}/cadastrar`, veiculo).pipe(
            tap( () => this.obterVeiculosPorClienteId(clienteId))
        );
    }

    update(veiculo: Veiculo){
        return this.http.put<Veiculo>(`${this.urlBase}/atualizar`, veiculo).pipe(
            tap( () => this.getAll() )
        );
    }

    atualizarEListarClienteSelecionado(veiculo: Veiculo, clienteId: number){
        return this.http.put<Veiculo>(`${this.urlBase}/atualizar`, veiculo).pipe(
            tap( () => this.obterVeiculosPorClienteId(clienteId))
        );
    }

    delete(id: number){
        return this.http.delete(`${this.urlBase}/deletar/${id}`).pipe(
            tap( () => this.getAll() )
        )
    }

    deletarEListarClienteSelecionado(id: number, clienteId: number){
        return this.http.delete(`${this.urlBase}/deletar/${id}`).pipe(
            tap( () => this.obterVeiculosPorClienteId(clienteId) )
        )
    }

    obterVeiculosPorClienteId(id: number) {
        this.http.get<Veiculo[]>(`${this.urlBase}/listar/cliente/${id}`).subscribe(
            data => {
                this.veiculosSubject.next(data);
            }
        );
    }
}
