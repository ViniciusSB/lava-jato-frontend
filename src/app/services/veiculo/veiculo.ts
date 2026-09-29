import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Veiculo } from '../../models/veiculo';
import { environment } from '../../../environments/environment';
import { MensagemRespose } from '../../models/mensagem';

@Injectable({providedIn: 'root'})
export class VeiculoService {
    private apiUrl = environment.apiUrl;
    private urlBase = `${this.apiUrl}/veiculo`;

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

    desativar(id: number):Observable<MensagemRespose>{
        return this.http.patch<MensagemRespose>(`${this.urlBase}/desativar/${id}`, {}).pipe(
            tap(() => this.getAll())
        );
    }

    desativarVeiculoTelaCliente(id: number, idCliente: number):Observable<MensagemRespose>{
        return this.http.patch<MensagemRespose>(`${this.urlBase}/desativar/${id}`, {}).pipe(
            tap(() => this.obterVeiculosPorClienteId(idCliente))
        );
    }

    ativar(id: number):Observable<MensagemRespose>{
        return this.http.patch<MensagemRespose>(`${this.urlBase}/ativar/${id}`, {}).pipe(
            tap(() => this.getAll())
        );
    }

    ativarVeiculoTelaCliente(id: number, idCliente: number):Observable<MensagemRespose>{
        return this.http.patch<MensagemRespose>(`${this.urlBase}/ativar/${id}`, {}).pipe(
            tap(() => this.obterVeiculosPorClienteId(idCliente))
        );
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
