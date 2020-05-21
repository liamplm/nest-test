import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtStrategy: JwtStrategy) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest<Request>();

        const user = await this.jwtStrategy.extractPayload(
            await this.jwtStrategy.verifyToken(
                this.jwtStrategy.extractTokenFromRequset(req)
            )
        );

        req['user'] = user;

        return true;
    }
}
