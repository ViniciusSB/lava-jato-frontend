import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class RequisicaoInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    const router = inject(Router);
    let headers: any = {};

    if (req.url.includes('ngrok-free.app')) {
      headers['ngrok-skip-browser-warning'] = 'true';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const cloned = req.clone({ setHeaders: headers });
    return next.handle(cloned).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {

        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status == 401) {
          localStorage.setItem('token', '');
          localStorage.setItem("idUsuario", "");
          localStorage.setItem("tipoUsuaio", "");
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
