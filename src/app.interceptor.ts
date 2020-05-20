import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';

import { Request } from 'express';

import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';


@Injectable()
export class AppInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log(`<== ${new Date()}`);

        const req = context.switchToHttp().getRequest<Request>()
        console.log(req.body)

        const route = req.route;

        return next.handle().pipe(
            map((data) => ['come again', data])
        )
    }
}
