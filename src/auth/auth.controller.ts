import { Controller, Post, Body, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Validation } from '@pipes/joi-validation/joi-validation.pipe';
import { AuthLoginDTO, AuthRegisterDTO } from './auth.dto';
import { JwtStrategy } from './jwt.strategy';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private jwtStrategy: JwtStrategy,
    ) {}

    @Post('/register')
    @Validation(AuthRegisterDTO)
    async register(@Body() dto: AuthRegisterDTO) {
        return await this.authService.register(dto);
    }

    @Post('/login')
    @Validation(AuthLoginDTO)
    async login(@Body() dto: AuthLoginDTO, @Request() req: Request) {
        try {
            return {
                token: this.jwtStrategy.extractTokenFromRequset(req),
            };
        } catch (err) {
            return this.authService.login(dto);
        }
    }
}
