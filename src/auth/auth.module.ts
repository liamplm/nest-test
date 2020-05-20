import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@user/user.module';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ExtractJwt } from 'passport-jwt';

@Module({
    imports: [
        UserModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET')
            }),
            inject: [ConfigService]
        }),
        PassportModule
    ],
    providers: [
        AuthService,
        JwtStrategy,
        {
            provide: 'JWT_SECRET',
            useFactory: (configService: ConfigService) => configService.get('JWT_SECRET'),
            inject: [ConfigService]
        },
        {
            provide: 'JWT_EXTRACTOR',
            useValue: ExtractJwt.fromAuthHeaderAsBearerToken()
        }
    ],
    controllers: [AuthController]
})
export class AuthModule {}
