import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/entities/user.entity';
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
  async getAllTasks(
    filterDto: GetTaskFilterDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

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

  async getTaskById(id: number, user: UserEntity): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (task) {
      return task;
    }

    throw new NotFoundException(`Task with Id: ${id} does not exist.`);
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const { title, description } = createTaskDto;
    const task = await this.taskRepository.save({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    delete task.user;
    return task;
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: UserEntity,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id, user);
    // console.log(task);
    task.status = status;
    return await task.save();
  }

  async deleteTaskById(taskId: number, user: UserEntity): Promise<string> {
    // with delete remove operation

    // const task = await this.getTaskById(taskId);
    // if (task && task.id) {
    //   await this.taskRepository.remove(task);
    //   return `Task with this id ${taskId} is deleted`;
    // }

    // with delete operation
    const result = await this.taskRepository.delete({
      id: taskId,
      userId: user.id,
    });
    if (!result.affected) {
      throw new NotFoundException(`Task with Id: ${taskId} does not exist.`);
    }
    return `Task with this id ${taskId} is deleted`;
  }
}
