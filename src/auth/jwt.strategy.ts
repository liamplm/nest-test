import {
    Injectable,
    UnauthorizedException,
    BadRequestException,
} from '@nestjs/common';
import { UserService } from '@user/user.service';
import { Payload } from './jwt.constants';
import { JwtService } from '@nestjs/jwt';
import { JoiValidationPipe } from '@pipes/joi-validation/joi-validation.pipe';

@Injectable()
export class JwtStrategy {
    readonly AUTH_HEADER_NAME = 'authorization';
    readonly TOKEN_MARK = 'Bearer ';

    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) {}

    extractTokenFromRequset(requset: Request): string {
        const authHeader: string = requset.headers?.[this.AUTH_HEADER_NAME];

        if (!authHeader) {
            throw new BadRequestException('no auth token is provided');
        }

        const tokenArr = authHeader.split(this.TOKEN_MARK);
        if (tokenArr.length !== 2 || !tokenArr[1]) {
            throw new BadRequestException('no auth token is provided');
        }

        return tokenArr[1];
    }

    async generateToken(userId: string, iat: Date = new Date()): Promise<{ token: string }> {
        return {
            token: await this.jwtService.signAsync({
                userId,
                iat: iat.getTime()
            })
        }
    }

    async verifyToken(token: string): Promise<Payload> {
        let payload = await this.jwtService.verifyAsync<Payload>(token)

        payload = (new JoiValidationPipe(Payload, ['custom'])).transform(payload, {
            type: 'custom'
        })

        console.log(payload)
        return payload;
    }

    async extractPayload(payload: Payload) {
        const user = await this.userService.getById({
            _id: payload.userId,
        });

        if (!user) {
            throw new UnauthorizedException('invalid auth token');
        } else if (user.lastLogin > payload.iat) {
            throw new UnauthorizedException('auth token is expired');
        }

        return user;
    }
}
