import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('create_task')
  async create(@Payload() data: any) {
    return this.tasksService.create(data);
  }

  @MessagePattern('get_tasks')
  async findAll(@Payload() data: { userId: number; filters?: any }) {
    return this.tasksService.findAll(data.userId, data.filters);
  }

  @MessagePattern('get_task')
  async findOne(@Payload() data: { id: number; userId: number }) {
    return this.tasksService.findOne(data.id, data.userId);
  }

  @MessagePattern('update_task')
  async update(@Payload() data: { id: number; userId: number; updates: any }) {
    return this.tasksService.update(data.id, data.userId, data.updates);
  }

  @MessagePattern('delete_task')
  async remove(@Payload() data: { id: number; userId: number }) {
    return this.tasksService.remove(data.id, data.userId);
  }

  @MessagePattern('toggle_task')
  async toggleComplete(@Payload() data: { id: number; userId: number }) {
    return this.tasksService.toggleComplete(data.id, data.userId);
  }
}