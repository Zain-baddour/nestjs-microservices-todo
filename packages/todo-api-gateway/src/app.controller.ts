import { Controller, Get, Post, Put, Delete, Body, Req, UseGuards, Query, Param } from '@nestjs/common';
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

  //****************
  // TASK APIs
  // *************** */


  @Post('tasks')
  @UseGuards(AuthGuard)
  async createTask(@Body() data: any, @Req() req) {
    const taskData = { ...data, userId: req.user.sub };
    return taskClient.send('create_task', taskData).toPromise();
  }

  // جلب كل tasks للمستخدم
  @Get('tasks')
  @UseGuards(AuthGuard)
  async getTasks(@Req() req, @Query() query: any) {
    const filters = {
      completed: query.completed === 'true' ? true :
        query.completed === 'false' ? false : undefined,
      fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
      toDate: query.toDate ? new Date(query.toDate) : undefined,
    };

    return taskClient.send('get_tasks', {
      userId: req.user.sub,
      filters
    }).toPromise();
  }

  // جلب task واحدة
  @Get('tasks/:id')
  @UseGuards(AuthGuard)
  async getTask(@Req() req, @Param('id') id: string) {
    return taskClient.send('get_task', {
      id: parseInt(id),
      userId: req.user.sub
    }).toPromise();
  }

  // تحديث task
  @Put('tasks/:id')
  @UseGuards(AuthGuard)
  async updateTask(
    @Param('id') id: string,
    @Body() updates: any,
    @Req() req
  ) {
    return taskClient.send('update_task', {
      id: parseInt(id),
      userId: req.user.sub,
      updates
    }).toPromise();
  }

  // حذف task
  @Delete('tasks/:id')
  @UseGuards(AuthGuard)
  async deleteTask(@Param('id') id: string, @Req() req) {
    return taskClient.send('delete_task', {
      id: parseInt(id),
      userId: req.user.sub
    }).toPromise();
  }

  // تبديل حالة الإنجاز
  @Put('tasks/:id/toggle')
  @UseGuards(AuthGuard)
  async toggleTask(@Param('id') id: string, @Req() req) {
    return taskClient.send('toggle_task', {
      id: parseInt(id),
      userId: req.user.sub
    }).toPromise();
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