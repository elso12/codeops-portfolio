import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = Date.now();
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        console.log(`[Timing] ${req.method} ${req.url} - ${duration}ms`);
        if (!res.headersSent) {
          res.setHeader('X-Response-Time', `${duration}ms`);
        }
      }),
    );
  }
}
