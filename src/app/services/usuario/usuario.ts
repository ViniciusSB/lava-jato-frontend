import { Injectable, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario, UsuarioRequest, UsuarioResponse } from '../../models/usuario';
import { environment } from '../../../environments/environment';

@Injectable({providedIn: 'root'})
export class UsuarioService {
    private apiUrl = environment.apiUrl;
    private urlBase = `${this.apiUrl}/usuario`;

    constructor(private http: HttpClient){}

    private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
    usuarios = this.usuariosSubject.asObservable();

    getAll() {
        this.http.get<Usuario[]>(`${this.urlBase}/listar`).subscribe(
            data => {
                this.usuariosSubject.next(data);
            }
        );
    }

    listarTodosOsUsuarios(): Observable<UsuarioResponse[]> {
        return this.http.get<UsuarioResponse[]>(`${this.urlBase}/listar`);
    }

    listarUsuarioInativos() {
        this.http.get<Usuario[]>(`${this.urlBase}/listarInativos`).subscribe(
            data => {
                this.usuariosSubject.next(data);
            }
        );
    }

    create(usuario: Usuario){
        return this.http.post<Usuario>(`${this.urlBase}/cadastrar`, usuario).pipe(
            tap( () => this.getAll() )
        );
    }

    update(usuario: Usuario){
        return this.http.put<Usuario>(`${this.urlBase}/atualizar`, usuario).pipe(
            tap( () => this.getAll() )
        );
    }

    updateUsuarioOpcoes(usuario: UsuarioRequest){
        return this.http.put<Usuario>(`${this.urlBase}/atualizar`, usuario);
    }

    atualizarSenha(senhaAtual: string, novaSenha: string, usuarioId: number): Observable<UsuarioResponse> {
        return this.http.put<UsuarioResponse>(`${this.urlBase}/atualizarSenha`, {senhaAtual, novaSenha, usuarioId});
    }

    desativar(id: number): Observable<UsuarioResponse> {
        return this.http.patch<UsuarioResponse>(`${this.urlBase}/desativar/${id}`, {}).pipe(
            tap( () => this.getAll() )
        )
    }

    desativarPropriaConta(id: number): Observable<UsuarioResponse> {
        return this.http.patch<UsuarioResponse>(`${this.urlBase}/desativarPropriaConta/${id}`, {})
    }

    ativar(id: number): Observable<UsuarioResponse> {
        return this.http.patch<UsuarioResponse>(`${this.urlBase}/ativar/${id}`, {}).pipe(
            tap( () => this.listarUsuarioInativos() )
        )
    }
}