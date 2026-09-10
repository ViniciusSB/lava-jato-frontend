import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { DashboardFuncionario, DashboardFuncionarioRequest, DashboardGerente, DashboardGerenteRequest } from '../../models/dashboard';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    private apiUrl = environment.apiUrl;
    private urlBase = `${this.apiUrl}/dashboard`;

    constructor(private http: HttpClient) { }

    private dashboardFuncionarioSubject = new BehaviorSubject<DashboardFuncionario | null>(null);
    funcionarioDados = this.dashboardFuncionarioSubject.asObservable();

    getDadosDashboardFuncionario(idFuncionario: number, request: DashboardFuncionarioRequest): Observable<HttpResponse<DashboardFuncionario>> {
        return this.http.post<DashboardFuncionario>(`${this.urlBase}/funcionario/${idFuncionario}`,
            request, {observe: 'response'}
        );
    }

    getDadosDashboardGerente(request: DashboardGerenteRequest): Observable<HttpResponse<DashboardGerente>> {
        return this.http.post<DashboardGerente>(`${this.urlBase}/gerente`,
            request, {observe: 'response' }
        );
    }

}