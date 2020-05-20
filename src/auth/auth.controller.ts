import { Controller, Post, Body, Request, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Validation } from '@pipes/joi-validation/joi-validation.pipe';
import { AuthLoginDTO, AuthRegisterDTO } from './auth.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        @Inject('JWT_EXTRACTOR') private JWT_EXTRACTOR
    ) {}

    @Post('/register')
    @Validation(AuthRegisterDTO)
    async register(@Body() dto: AuthRegisterDTO) {
        return await this.authService.register(dto);
    }

    @Post('/login')
    @Validation(AuthLoginDTO)
    async login(
        @Body() dto: AuthLoginDTO,
        @Request() req: Request
    ) {
        const token = this.JWT_EXTRACTOR(req as any);

        if (token) {
            return {
                token
            }
        }

        return this.authService.login(dto)
    }
}
