import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const EXCLUDED_PATHS = ['/api/auth/login'];

  // Don't add token for authentication endpoints
  if (isPublicPath(req.url)) {
    return next(req);
  }

  // Add token if available
  const token = localStorage.getItem('token');
  if (token) {
    req = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        // Clear local storage
        localStorage.clear();

        // Get current URL for redirect after login
        const currentUrl = window.location.pathname;

        // Navigate to login with return URL
        router.navigate(['/login'], {
          queryParams: {
            returnUrl: currentUrl,
          },
        });
      }
      return throwError(() => error);
    })
  );

  function isPublicPath(url: string): boolean {
    return EXCLUDED_PATHS.some((path) => url.includes(path));
  }
};
