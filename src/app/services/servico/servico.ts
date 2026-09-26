import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Servico } from '../../models/servico';
import { environment } from '../../../environments/environment';
import { AuthUtil } from '../../util/auth-util';
import { UsuarioLogado } from '../../models/usuario';
import { MensagemRespose } from '../../models/mensagem';

@Injectable({ providedIn: 'root' })
export class ServicoService {
    private apiUrl = environment.apiUrl;
    private urlBase = `${this.apiUrl}/servico`;

    constructor(private http: HttpClient) { }
    usuarioLogado: UsuarioLogado = AuthUtil.obterDadosUsuarioLogado();

    private servicoSubject = new BehaviorSubject<Servico[]>([]);
    servicos = this.servicoSubject.asObservable();

    getAll() {
        this.http.get<Servico[]>(`${this.urlBase}/listar`).subscribe(
            data => {
                this.servicoSubject.next(data);
            }
        );
    }

    create(usuario: Servico) {
        return this.http.post<Servico>(`${this.urlBase}/criar`, usuario).pipe(
            tap(() => this.getAll())
        );
    }

    update(usuario: Servico) {
        return this.http.put<Servico>(`${this.urlBase}/atualizar`, usuario).pipe(
            tap(() => this.getAll())
        );
    }

    ativar(id: number): Observable<MensagemRespose> {
        return this.http.patch<MensagemRespose>(`${this.urlBase}/ativar/${id}`, {}).pipe(
            tap(() => this.getAll())
        )
    }

    desativar(id: number): Observable<MensagemRespose> {
        return this.http.patch<MensagemRespose>(`${this.urlBase}/desativar/${id}`, {}).pipe(
            tap(() => this.getAll())
        )
    }
}