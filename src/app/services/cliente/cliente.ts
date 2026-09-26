import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cliente } from '../../models/cliente';
import { environment } from '../../../environments/environment';
import { MensagemRespose } from '../../models/mensagem';

@Injectable({ providedIn: 'root' })
export class ClienteService {
    private apiUrl = environment.apiUrl;
    private urlBase = `${this.apiUrl}/cliente`;

    constructor(private http: HttpClient) { }

    private clientesSubject = new BehaviorSubject<Cliente[]>([]);
    clientes = this.clientesSubject.asObservable();

    getAll() {
        this.http.get<Cliente[]>(`${this.urlBase}/listar`, { observe: 'response' }).subscribe(
            response => {
                this.clientesSubject.next(response.body ?? []);
            }
        );
    }

    listarClientes(): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(`${this.urlBase}/listar`);
    }

    create(usuario: Cliente) {
        return this.http.post<Cliente>(`${this.urlBase}/cadastrar`, usuario);
    }

    update(usuario: Cliente) {
        return this.http.put<Cliente>(`${this.urlBase}/atualizar`, usuario);
    }

    desativar(id: number):Observable<MensagemRespose> {
        return this.http.patch<MensagemRespose>(`${this.urlBase}/desativar/${id}`, {});
    }

    ativar(id: number):Observable<MensagemRespose> {
        return this.http.patch<MensagemRespose>(`${this.urlBase}/ativar/${id}`, {});
    }
}