import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { UserService } from '@user/user.service';
import { ExtractJwt } from 'passport-jwt';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '@user/user.schema';

describe('JWT Strategy', () => {
    let jwtStrategy: JwtStrategy;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy, 
                UserService, 
                {
                    provide: 'JWT_SECRET',
                    useValue: 'secret'
                },
                {
                    provide: 'JWT_EXTRACTOR',
                    useValue: ExtractJwt.fromAuthHeaderAsBearerToken()
                },
                {
                    provide: getModelToken('User'),
                    useValue: {}
                }
            ],
        }).compile();

        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(jwtStrategy).toBeDefined();
    });

    describe('validation', () => {
 
        it('should return user', async () => {
            const payload = {
                userId: 'abcd',
                iat: Math.floor(Date.now() / 1000)
            };

            const user = {
                lastLogin: new Date(Date.now() - (60 * 1000))
            }

            jest.spyOn(userService, 'getById').mockImplementation(async () => user as User)

            await expect(jwtStrategy.validate(payload)).resolves.toBe(user);
        })

        it('should throw "auth token is expired" exception', async () => {
            const payload = {
                userId: 'abcd',
                iat: Math.floor(Date.now() / 1000)
            };

            const user = {
                lastLogin: new Date(Date.now() + (60 * 1000))
            }

            jest.spyOn(userService, 'getById').mockImplementation(async () => user as User)

            await expect(jwtStrategy.validate(payload)).rejects.toThrow(new UnauthorizedException('auth token is expired'))
        })

        it('should throw "invalid auth token" exception', async () => {
            const payload = {
                userId: 'abcd',
                iat: Math.floor(Date.now() / 1000)
            };

            jest.spyOn(userService, 'getById').mockImplementation(async () => undefined)
            
            await expect(jwtStrategy.validate(payload)).rejects.toThrow(new UnauthorizedException('invalid auth token'))
        })

    })
});
