import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequisicaoInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); 
    let headers: any = {};

    if (req.url.includes('ngrok-free.app')) {
      headers['ngrok-skip-browser-warning'] = 'true';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const cloned = req.clone({ setHeaders: headers });
    return next.handle(cloned);
  }
}
