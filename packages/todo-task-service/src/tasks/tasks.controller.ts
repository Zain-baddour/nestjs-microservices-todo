import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class TasksController {
  @MessagePattern('create_task')
  createTask(data: any) {
    return {
      taskId: Date.now(),
      title: data.title,
      userId: data.userId,
      status: 'created'
    };
  }
  
  @MessagePattern('get_user_tasks')
  getUserTasks(userId: number) {
    return [
      { id: 1, title: 'Learn Microservices', userId },
      { id: 2, title: 'Build Portfolio', userId }
    ];
  }
}