import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UsuarioRequest } from '../../models/usuario';
import { environment } from '../../../environments/environment';
import { RelatorioRequest } from '../../models/relatorio';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
    private apiUrl = environment.apiUrl;
    private urlRelatorio = `${this.apiUrl}/relatorio`;

    constructor(private http: HttpClient) { }

    relatorioFuncionario(request: RelatorioRequest): Observable<Blob> {
        return this.http.post(`${this.urlRelatorio}/clientes`, request, {
            responseType: 'blob'
        });
    }

}