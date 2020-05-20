import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthLoginDTO, AuthRegisterDTO, AuthValidateUserDTO } from './auth.dto'

import { UserService } from '@user/user.service';
import { User } from '@user/user.schema';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async register(dto: AuthRegisterDTO) {
        const user = await this.userService.create(dto);
       
        return this.getToken(user._id)
    }

    async login(dto: AuthLoginDTO) {
        const user = await this.validateUser(dto);

        user.lastLogin = new Date()
        const [, tokenResult] = await Promise.all([
            user.save(),
            this.getToken(user._id, user.lastLogin)
        ]);

        return tokenResult;
    }

    async getToken(userId: string, iat: Date = new Date()) {
        return {
            token: await this.jwtService.signAsync({
                userId,
                iat: Math.floor(iat.getTime() / 1000) + 1
            })
        }
    }

    async validateUser(dto: AuthValidateUserDTO): Promise<User> {
        const user = dto.user || await this.userService.getByUsername({
            username: dto.username 
        });

        if (!user) {
            throw new UnauthorizedException('user validation failed');
        }

        const compareResult = await user.comparePassword(dto.password);

        if (compareResult) {
            return user;
        } else {
            throw new UnauthorizedException('user validation failed');
        }
    }
}
