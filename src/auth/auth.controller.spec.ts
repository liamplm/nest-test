import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthModule } from './auth.module';
import { ConfigDynamicModule } from '@app/app.module';
import { getModelToken } from '@nestjs/mongoose';

describe('Auth Controller', () => {
    let controller: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigDynamicModule, AuthModule],
        })
            .overrideProvider(getModelToken('User'))
            .useValue({})
            .compile();

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
