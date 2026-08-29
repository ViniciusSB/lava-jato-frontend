import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DashboardFuncionario, DashboardFuncionarioRequest, DashboardGerente, DashboardGerenteRequest } from '../../models/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {

    private urlUsuario = "http://localhost:8080/dashboard";

    constructor(private http: HttpClient) { }

    private dashboardFuncionarioSubject = new BehaviorSubject<DashboardFuncionario | null>(null);
    funcionarioDados = this.dashboardFuncionarioSubject.asObservable();

    getDadosDashboardFuncionario(idFuncionario: number, request: DashboardFuncionarioRequest): Observable<DashboardFuncionario> {
        return this.http.post<DashboardFuncionario>(`${this.urlUsuario}/funcionario/${idFuncionario}`, 
        request
        );
    }

    getDadosDashboardGerente(request: DashboardGerenteRequest): Observable<DashboardGerente> {
        return this.http.post<DashboardGerente>(`${this.urlUsuario}/gerente`, 
        request
        );
    }

}