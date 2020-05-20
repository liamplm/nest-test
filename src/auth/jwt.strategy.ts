import { Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common'
import { UserService } from '@user/user.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject('JWT_SECRET') JWT_SECRET: string,
        @Inject('JWT_EXTRACTOR') JWT_EXTRACTOR,
        private userService: UserService
    ) {
        super({
            ignoreExpiration: false,
            secretOrKey: JWT_SECRET,
            jwtFromRequest: JWT_EXTRACTOR
        })
    }

    async validate(payload: any) {
        payload.iat = new Date(payload.iat * 1000);

        const user = await this.userService.getById({
            _id: payload.userId
        });
        
        if (!user) {
            throw new UnauthorizedException('invalid auth token')
        } else if (user.lastLogin > payload.iat) {
            throw new UnauthorizedException('auth token is expired')
        }

        return user;
    }
}

