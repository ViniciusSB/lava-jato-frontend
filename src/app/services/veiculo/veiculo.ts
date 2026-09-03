import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Veiculo } from '../../models/veiculo';

@Injectable({providedIn: 'root'})
export class VeiculoService {
    private urlBase = "http://localhost:8080/veiculo";
    private token = localStorage.getItem("token");

    constructor(private http: HttpClient){}

    private veiculosSubject = new BehaviorSubject<Veiculo[]>([]);
    veiculos = this.veiculosSubject.asObservable();

    getAll() {
        const headers = { Authorization: `Bearer ${this.token}` };
        this.http.get<Veiculo[]>(`${this.urlBase}/listar`, {headers}).subscribe(
            data => {
                this.veiculosSubject.next(data);
            }
        );
    }

    create(veiculo: Veiculo){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.post<Veiculo>(`${this.urlBase}/cadastrar`, veiculo, {headers}).pipe(
            tap( () => this.getAll() )
        );
    }

    criarEListarClienteSelecionado(veiculo: Veiculo, clienteId: number){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.post<Veiculo>(`${this.urlBase}/cadastrar`, veiculo, {headers}).pipe(
            tap( () => this.obterVeiculosPorClienteId(clienteId))
        );
    }

    update(veiculo: Veiculo){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.put<Veiculo>(`${this.urlBase}/atualizar`, veiculo, {headers}).pipe(
            tap( () => this.getAll() )
        );
    }

    atualizarEListarClienteSelecionado(veiculo: Veiculo, clienteId: number){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.put<Veiculo>(`${this.urlBase}/atualizar`, veiculo, {headers}).pipe(
            tap( () => this.obterVeiculosPorClienteId(clienteId))
        );
    }

    delete(id: number){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.delete(`${this.urlBase}/deletar/${id}`, {headers}).pipe(
            tap( () => this.getAll() )
        )
    }

    deletarEListarClienteSelecionado(id: number, clienteId: number){
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.delete(`${this.urlBase}/deletar/${id}`, {headers}).pipe(
            tap( () => this.obterVeiculosPorClienteId(clienteId) )
        )
    }

    obterVeiculosPorClienteId(id: number) {
        const headers = { Authorization: `Bearer ${this.token}` };
        this.http.get<Veiculo[]>(`${this.urlBase}/listar/cliente/${id}`, {headers}).subscribe(
            data => {
                this.veiculosSubject.next(data);
            }
        );
    }
}
