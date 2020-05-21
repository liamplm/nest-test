import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '@user/user.service';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { User } from '@user/user.schema';
import { AUTH_HEADER_NAME } from './jwt.constants';
import { AuthModule } from './auth.module';
import { ConfigDynamicModule } from '@app/app.module';

describe('JWT Strategy', () => {
    const TEST_TOKEN =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWM1ZTM2YjQ3Nzg1ODI3OGVjMzJmYWYiLCJpYXQiOjEwNTMyMTYwMDAwMDB9.UM4fwRVYQELgwIktja0om7GFlGMcW9alYu2tTgZdEhI';
    const TEST_FAKE_TOKEN =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZWM1ZTM2YjQ3Nzg1ODI3OGVjMzJmYWYiLCJpYXQiOjEwNTMyMTYwMDAwMDB9._QDY_glK1BK543FDLtWH28uP-LSLSis6hosByIM6S80';
    const TEST_PAYLOAD = {
        userId: '5ec5e36b477858278ec32faf',
        iat: new Date('2003-05-18'),
    };

    let jwtStrategy: JwtStrategy;
    let userService: UserService;
    //let jwtSecret: string;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigDynamicModule,
                AuthModule,
            ],
        })
            .overrideProvider(getModelToken('User'))
            .useValue({})
            .compile();

        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(jwtStrategy).toBeDefined();
    });

    describe('extractToken', () => {
        it('should throw "no auth token is provided" exception', () => {
            expect(() =>
                jwtStrategy.extractTokenFromRequset({
                    headers: {
                        [AUTH_HEADER_NAME]: '',
                    },
                } as any),
            ).toThrow(new BadRequestException('no auth token is provided'));

            expect(() =>
                jwtStrategy.extractTokenFromRequset({
                    headers: {
                        [AUTH_HEADER_NAME]: 'Bearer',
                    },
                } as any),
            ).toThrow(new BadRequestException('no auth token is provided'));

            expect(() =>
                jwtStrategy.extractTokenFromRequset({
                    headers: {
                        [AUTH_HEADER_NAME]: 'Bearer ',
                    },
                } as any),
            ).toThrow(new BadRequestException('no auth token is provided'));

            expect(() =>
                jwtStrategy.extractTokenFromRequset({
                    headers: {
                        [AUTH_HEADER_NAME]: TEST_TOKEN,
                    },
                } as any),
            ).toThrow(new BadRequestException('no auth token is provided'));

            expect(() =>
                jwtStrategy.extractTokenFromRequset({
                    headers: {
                        [AUTH_HEADER_NAME]: `    ${TEST_TOKEN}   `,
                    },
                } as any),
            ).toThrow(new BadRequestException('no auth token is provided'));

            expect(() =>
                jwtStrategy.extractTokenFromRequset({
                    headers: {
                        [AUTH_HEADER_NAME]: `Pearer ${TEST_TOKEN}`,
                    },
                } as any),
            ).toThrow(new BadRequestException('no auth token is provided'));
        });

        it('should return token', () => {
            expect(
                jwtStrategy.extractTokenFromRequset({
                    headers: {
                        [AUTH_HEADER_NAME]: `Bearer ${TEST_TOKEN}`,
                    },
                } as any),
            ).toBe(TEST_TOKEN);
        });
    });

    describe('generateToken', () => {
        it('should be defined', () => {
            expect(jwtStrategy.generateToken).toBeDefined();
        });

        it('should generate same token', async () => {
            await expect(
                jwtStrategy.generateToken(
                    TEST_PAYLOAD.userId,
                    TEST_PAYLOAD.iat,
                ),
            ).resolves.toEqual({ token: TEST_TOKEN });
        });

        it('should generate another token as the payload changes', async () => {
            // iat is setting to new Date
            await expect(
                jwtStrategy.generateToken(TEST_PAYLOAD.userId),
            ).resolves.not.toEqual({ token: TEST_TOKEN });
        });
    });

    describe('verifyToken', () => {
        it('should be defined', () => {
            expect(jwtStrategy.verifyToken).toBeDefined();
        });

        it('should return payload', async () => {
            await expect(jwtStrategy.verifyToken(TEST_TOKEN)).resolves.toEqual(
                TEST_PAYLOAD,
            );
        });

        it('should throw', async () => {
            await expect(
                jwtStrategy.verifyToken(TEST_FAKE_TOKEN),
            ).rejects.toThrow();
        });
    });

    describe('validation', () => {
        it('should return user', async () => {
            const payload = {
                userId: 'abcd',
                iat: new Date(),
            };

            const userLateToken = {
                lastLogin: new Date(Date.now() - 60 * 1000),
            };
            const user = {
                lastLogin: payload.iat,
            };

            jest.spyOn(userService, 'getById').mockImplementation(
                async () => userLateToken as User,
            );

            await expect(jwtStrategy.extractPayload(payload)).resolves.toBe(
                userLateToken,
            );

            jest.spyOn(userService, 'getById').mockImplementation(
                async () => user as User,
            );

            await expect(jwtStrategy.extractPayload(payload)).resolves.toBe(
                user,
            );
        });

        it('should throw "auth token is expired" exception', async () => {
            const payload = {
                userId: 'abcd',
                iat: new Date(),
            };

            jest.spyOn(userService, 'getById').mockImplementation(
                async () =>
                    ({
                        lastLogin: new Date(Date.now() + 60 * 1000),
                    } as User),
            );

            await expect(jwtStrategy.extractPayload(payload)).rejects.toThrow(
                new UnauthorizedException('auth token is expired'),
            );
        });

        it('should throw "invalid auth token" exception', async () => {
            const payload = {
                userId: 'abcd',
                iat: new Date(),
            };

            jest.spyOn(userService, 'getById').mockImplementation(
                async () => undefined,
            );

            await expect(jwtStrategy.extractPayload(payload)).rejects.toThrow(
                new UnauthorizedException('invalid auth token'),
            );
        });
    });
});
