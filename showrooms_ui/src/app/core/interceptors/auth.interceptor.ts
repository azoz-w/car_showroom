// src/app/core/interceptors/auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);
  const AUTH_HEADER = 'Authorization';
  const TOKEN_PREFIX = 'Bearer ';
  const EXCLUDED_PATHS = ['/api/auth/login'];

  // Don't add token for authentication endpoints
  if (isPublicPath(request.url)) {
    return next(request);
  }

  // Add token if available
  const token = localStorage.getItem('token');
  if (token) {
    request = addToken(request, token);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Forbidden - could handle differently if needed
        console.error('Access forbidden');
      }
      return throwError(() => error);
    })
  );
};

function addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    headers: request.headers.set('Authorization', `Bearer ${token}`)
  });
}

function isPublicPath(url: string): boolean {
  return ['/api/auth/login'].some(path => url.includes(path));
}