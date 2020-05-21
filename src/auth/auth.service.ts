import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthLoginDTO, AuthRegisterDTO, AuthValidateUserDTO } from './auth.dto'

import { UserService } from '@user/user.service';
import { User } from '@user/user.schema';
import { JwtStrategy } from './jwt.strategy';


@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtStrategy: JwtStrategy
    ) {}

    async register(dto: AuthRegisterDTO) {
        const user = await this.userService.create(dto);
       
        return this.jwtStrategy.generateToken(user._id)
    }

    async login(dto: AuthLoginDTO) {
        const user = await this.validateUser(dto);

        user.lastLogin = new Date()
        const [, tokenResult] = await Promise.all([
            user.save(),
            this.jwtStrategy.generateToken(user._id, user.lastLogin)
        ]);

        return tokenResult;
    }

    async validateUser(dto: AuthValidateUserDTO): Promise<User> {
        console.log(dto)
        const user = dto.user || await this.userService.getByUsername({
            username: dto.username 
        });

        console.log(user)

        if (!user) {
            throw new UnauthorizedException('user validation failed');
        }

        const compareResult = await user.comparePassword(dto.password);

        console.log(compareResult)

        if (compareResult) {
            return user;
        } else {
            throw new UnauthorizedException('user validation failed');
        }
    }
}
