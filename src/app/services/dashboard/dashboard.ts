import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DashboardFuncionario, DashboardFuncionarioRequest, DashboardGerente, DashboardGerenteRequest } from '../../models/dashboard';

@Injectable({ providedIn: 'root' })
export class DashboardService {

    private urlUsuario = "http://localhost:8080/dashboard";
    private token = localStorage.getItem("token");

    constructor(private http: HttpClient) { }

    private dashboardFuncionarioSubject = new BehaviorSubject<DashboardFuncionario | null>(null);
    funcionarioDados = this.dashboardFuncionarioSubject.asObservable();

    getDadosDashboardFuncionario(idFuncionario: number, request: DashboardFuncionarioRequest): Observable<HttpResponse<DashboardFuncionario>> {
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.post<DashboardFuncionario>(`${this.urlUsuario}/funcionario/${idFuncionario}`,
            request, {headers, observe: 'response'}
        );
    }

    getDadosDashboardGerente(request: DashboardGerenteRequest): Observable<HttpResponse<DashboardGerente>> {
        const headers = { Authorization: `Bearer ${this.token}` };
        return this.http.post<DashboardGerente>(`${this.urlUsuario}/gerente`,
            request, { headers, observe: 'response' }
        );
    }

}