import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { userClient } from './user-client';
import { taskClient } from './task-client';
import { Catch, ExceptionFilter, HttpException, ArgumentsHost } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() { }

  @Get('health')
  getHealth(): string {
    return 'API Gateway is healthy!';
  }

  @Post('register')
  async register(@Body() data: any) {
    // إرسال الطلب لـ User Service
    return userClient.send('register_user', data).toPromise();
  }

  @Post('login')
  async login(@Body() data: any) {
    return userClient.send('login_user', data).toPromise();
  }

  @Post('tasks')
  @UseGuards(AuthGuard)
  async createTask(@Body() data: any) {
    return taskClient.send('create_task', data).toPromise();
  }

  @Get('users/:userId/tasks')
  @UseGuards(AuthGuard)
  async getUserTasks(@Param('userId') userId: string) {
    return taskClient.send('get_user_tasks', parseInt(userId)).toPromise();
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    
    // إذا كان خطأ من microservice
    if (exception?.response?.error?.status) {
      const error = exception.response.error;
      response.status(error.status).json({
        success: false,
        message: error.message,
        errors: error.errors,
      });
    } else {
      // أخطاء أخرى
      response.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}