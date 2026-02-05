import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(taskData: Partial<Task>): Promise<Task> {
    const task = this.tasksRepository.create(taskData);
    return this.tasksRepository.save(task);
  }

  async findAll(userId: number, filters?: {
    completed?: boolean;
    fromDate?: Date;
    toDate?: Date;
  }): Promise<Task[]> {
    const where: any = { userId };
    
    if (filters?.completed !== undefined) {
      where.completed = filters.completed;
    }
    
    if (filters?.fromDate && filters?.toDate) {
      where.dueDate = Between(filters.fromDate, filters.toDate);
    }

    return this.tasksRepository.find({ 
      where,
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number, userId: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ 
      where: { id, userId } 
    });
    
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    
    return task;
  }

  async update(id: number, userId: number, updates: Partial<Task>): Promise<Task> {
    const task = await this.findOne(id, userId);
    Object.assign(task, updates);
    return this.tasksRepository.save(task);
  }

  async remove(id: number, userId: number): Promise<void> {
    const result = await this.tasksRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async toggleComplete(id: number, userId: number): Promise<Task> {
    const task = await this.findOne(id, userId);
    task.completed = !task.completed;
    return this.tasksRepository.save(task);
  }
}