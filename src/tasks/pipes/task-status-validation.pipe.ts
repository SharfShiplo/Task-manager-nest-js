import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any) {
    const status = value.toUpperCase();
    if (this.isStatusValid(status)) return status;
    throw new BadRequestException(`${status} is an invalid status.`);
  }

  private isStatusValid(status: any) {
    return this.allowedStatuses.includes(status);
  }
}
