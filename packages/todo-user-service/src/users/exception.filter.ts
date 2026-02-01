import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class MicroserviceExceptionFilter implements RpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost): Observable<any> {
    // تحويل Validation errors
    if (exception.getResponse && exception.getStatus) {
      const response = exception.getResponse();
      const message = typeof response === 'string' 
        ? response 
        : response.message || 'Validation failed';
      
      return throwError(() => new RpcException({
        status: exception.getStatus(),
        message,
        errors: response.message || undefined,
      }));
    }

    // أخطاء Rpc موجودة
    if (exception instanceof RpcException) {
      return throwError(() => exception);
    }

    // أي خطأ آخر
    return throwError(() => new RpcException({
      status: 500,
      message: 'Internal server error',
    }));
  }
}