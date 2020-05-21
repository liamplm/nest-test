import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { ConfigDynamicModule } from '@app/app.module';
import { getModelToken } from '@nestjs/mongoose';

describe('User Controller', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [ConfigDynamicModule, UserModule]
    })
        .overrideProvider(getModelToken('User'))
        .useValue({})
        .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
