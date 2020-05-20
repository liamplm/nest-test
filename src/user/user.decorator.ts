import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.schema';

export const UserInfo = createParamDecorator((key: string, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest()
    
    return key ? req.user?.[key] : req.user;
})
