import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ExtractJwt } from 'passport-jwt';
import { UserService } from '@user/user.service';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('Auth Controller', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                JwtModule.registerAsync({
                    imports: [ConfigModule],
                    useFactory: async (configService: ConfigService) => ({
                        secret: configService.get('JWT_SECRET'),
                    }),
                    inject: [ConfigService],
                }),
            ],
            controllers: [AuthController],
            providers: [
                AuthService,
                UserService,
                {
                    provide: 'JWT_SECRET',
                    useValue: 'secret',
                },
                {
                    provide: 'JWT_EXTRACTOR',
                    useValue: ExtractJwt.fromAuthHeaderAsBearerToken(),
                },
                {
                    provide: getModelToken('User'),
                    useValue: {},
                },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('login', () => {
        it('should return the same token (relogin)', async () => {
            const token = 'my-token';

            await expect(
                controller.login(
                    {
                        password: 'pass',
                        username: 'user',
                    },
                    {
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    } as any,
                ),
            ).resolves.toEqual({
                token,
            });
        });
    });
});
