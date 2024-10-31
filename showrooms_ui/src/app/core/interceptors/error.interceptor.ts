// src/app/core/interceptors/error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../../core/services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        switch (error.status) {
          case 404:
            errorMessage = 'Resource not found';
            break;
          case 400:
            if (error.error?.errors) {
              errorMessage = Object.values(error.error.errors).join('\n');
            } else {
              errorMessage = error.error?.message || 'Bad request';
            }
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflict occurred';
            break;
          case 401:
            errorMessage = 'Unauthorized access';
            break;
          case 403:
            errorMessage = 'Access forbidden';
            break;
          case 500:
            errorMessage = 'Server error occurred';
            break;
          default:
            errorMessage = `Error: ${
              error.error?.message || 'Unknown error occurred'
            }`;
        }
      }

      toastService.show(errorMessage, 'error');
      return throwError(() => error);
    })
  );
};
