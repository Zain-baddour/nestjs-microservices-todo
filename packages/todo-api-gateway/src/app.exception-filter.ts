import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        if (exception?.error) {
            const error = exception.error;
            return response.status(error.status || 500).json({
                success: false,
                message: Array.isArray(error.message) ? error.message[0] : error.message,
                errors: error.errors,
            });
        }
        const request = ctx.getRequest<Request>();

        let status = 500;
        let message = 'Internal server error';
        let errors = undefined;

        // إذا كان خطأ من microservice
        if (exception?.response?.error) {
            const error = exception.response.error;
            status = error.status || 500;
            message = error.message || 'Error from microservice';
            errors = error.errors;
        }
        // إذا كان Validation error
        else if (exception?.response?.message) {
            status = exception.status || 400;
            message = 'Validation failed';
            errors = Array.isArray(exception.response.message)
                ? exception.response.message
                : [exception.response.message];
        }
        // إذا كان HTTP exception
        else if (exception.getStatus) {
            status = exception.getStatus();
            message = exception.message || 'Error occurred';
        }

        response.status(status).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}