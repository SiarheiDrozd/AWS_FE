import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      tap({
        error: (err: HttpErrorResponse) => {
          const url = new URL(request.url);
          let errorMessage = `Request to "${url.pathname}" failed. Check the console for the details`;

          switch (err.status) {
            case 401:
            case 403:
              errorMessage = err.error.message
          }

          this.notificationService.showError(
            errorMessage,
            0
          );
        },
      })
    );
  }
}
