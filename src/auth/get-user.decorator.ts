import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
