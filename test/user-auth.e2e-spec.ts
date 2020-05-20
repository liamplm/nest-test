import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { TestAppModule } from './test-app.module';

describe('User Auth (e2e)', () => {
    const RANDOM_TOKEN = (Math.random() * 999999).toString(16);
    const testUserInfo = {
        username: `mplm-${RANDOM_TOKEN}`,
        firstName: 'pouya',
        lastName: 'liaghat',
        birthDate: '2003-05-18T00:00:02.019Z',
        email: 'liamplm82@gmail.com',
        password: 'pass12356890',
    };

    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TestAppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    describe('Authentication', () => {
        let token: string;
        it('should register and login a new user', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send(testUserInfo)
                .expect(201)
                .expect(({ body }) => {
                    expect(body?.token).toBeTruthy();
                    expect(body).toHaveProperty('token');

                    token = body?.token;
                });
        });
        it('should allow to use protected route', () => {
            return request(app.getHttpServer())
                .get('/user/size')
                .set('Authorization', `Bearer ${token}`)
                .query({
                    skip: 0,
                    take: 5,
                })
                .expect(200)
                .expect(({ body }) => {
                    expect(body?.result?.length).toBeLessThan(6);
                });
        });
    });

    //it('register and login', () => {
    //return request(app.getHttpServer())
    //.post('/api/v1/auth/register')
    //.send(testUserInfo)
    //.expect(200)
    //.expect(({ body }) => {
    //expect(body?.token).toBeTruthy();
    //expect(body).toHaveProperty('token');
    //const token = body.token;

    //request(app.getHttpServer())
    //.post('api/v1/auth/login')
    //.send({
    //username: testUserInfo.username,
    //password: testUserInfo.password,
    //})
    //.expect(200)
    //.expect(({ body }) => {
    //expect(body?.token).toBe(token);
    //});

    //request(app.getHttpServer())
    //.get('api/v1/user/size')
    //.query({
    //skip: 0,
    //take: 5,
    //})
    //.expect(200)
    //.expect(({ body }) => {
    //expect(body?.token).toBe(token);
    //});
    //});
    //});
    afterAll(async () => {
        await app.close();
    });
});
