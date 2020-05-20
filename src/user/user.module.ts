import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

import { UserController } from './user.controller';
import { UserSchema, comparePassword, User } from './user.schema';
import { UserService } from './user.service';


@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            {
                name: 'User',
                imports: [ConfigModule],
                inject: [ConfigService],
                useFactory: (configService: ConfigService) => {
                    const BCRYPT_SALT_ROUNDS = parseInt(
                        configService.get('BCRYPT_SALT_ROUNDS'),
                    );
                    UserSchema.pre<User>('save', async function(next) {
                        this.password = await bcrypt.hash(
                            this.password,
                            BCRYPT_SALT_ROUNDS,
                        );
                        next();
                    });
                    UserSchema.methods.comparePassword = comparePassword;

                    return UserSchema;
                },
            },
        ]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
