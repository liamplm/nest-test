import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserSchema, comparePassword } from './user.schema';
import { UserService } from './user.service';
import { AuthModule } from '@auth/auth.module';

@Module({
    imports: [
        ConfigModule,
        MongooseModule.forFeatureAsync([
            {
                name: 'User',
                useFactory: () => {
                    UserSchema.methods.comparePassword = comparePassword;

                    return UserSchema;
                },
            },
        ]),
        forwardRef(() => AuthModule),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
