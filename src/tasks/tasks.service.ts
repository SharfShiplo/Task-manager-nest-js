import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskEntity } from './entities/task.entity';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
  ) {}
  async getAllTasks(filterDto: GetTaskFilterDto): Promise<TaskEntity[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status: status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    return await query.getMany();
  }

  async getTaskById(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOneBy({ id });
    if (task) {
      return task;
    }

    throw new NotFoundException(`Task with Id: ${id} does not exist.`);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    const { title, description } = createTaskDto;
    const task = await this.taskRepository.save({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    return task;
  }

  async updateTaskStatus(id: number, status: TaskStatus): Promise<TaskEntity> {
    const task = await this.getTaskById(id);
    // console.log(task);
    task.status = status;
    return await task.save();
  }

  async deleteTaskById(taskId: number): Promise<string> {
    // with delete remove operation

    // const task = await this.getTaskById(taskId);
    // if (task && task.id) {
    //   await this.taskRepository.remove(task);
    //   return `Task with this id ${taskId} is deleted`;
    // }

    // with delete operation
    const result = await this.taskRepository.delete(taskId);
    if (!result.affected) {
      throw new NotFoundException(`Task with Id: ${taskId} does not exist.`);
    }
    return `Task with this id ${taskId} is deleted`;
  }
}
