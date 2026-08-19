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

    create(usuario: Veiculo){
        return this.http.post<Veiculo>(`${this.urlBase}/cadastrar`, usuario).pipe(
            tap( () => this.getAll() )
        );
    }

    update(usuario: Veiculo){
        return this.http.put<Veiculo>(`${this.urlBase}/atualizar`, usuario).pipe(
            tap( () => this.getAll() )
        );
    }

    delete(id: number){
        return this.http.delete(`${this.urlBase}/deletar/${id}`).pipe(
            tap( () => this.getAll() )
        )
    }
}
