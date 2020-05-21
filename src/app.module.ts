import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';

import { GlobalModule } from './global/global.module';

import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import * as Joi from '@hapi/joi';
import { ModuleMetadata } from '@nestjs/common/interfaces';

export const AppModuleMetadata: ModuleMetadata = {
    imports: [
        GlobalModule,
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get<string>('DATABASE_URI'),
                useFindAndModify: false,
                connectionFactory: async connection => {
                    connection.plugin(
                        await import('mongoose-beautiful-unique-validation'),
                    );
                    return connection;
                },
            }),
        }),
        UserModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
};

export const ConfigDynamicModule = ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.dev.env', '.env'],
    validationSchema: Joi.object({
        NODE_ENV: Joi.string()
            .valid('development', 'production', 'test', 'provision')
            .default('development'),
        PORT: Joi.number()
            .port()
            .default(3000),
        DATABASE_URI: Joi.string().required(),
        BCRYPT_SALT_ROUNDS: Joi.number()
            .integer()
            .positive()
            .default(10),
        JWT_SECRET: Joi.string()
            .min(6)
            .required(),
    }),
    validationOptions: {
        abortEarly: false,
        convert: true,
    },
});

@Module({
    ...AppModuleMetadata,
    imports: [...AppModuleMetadata.imports, ConfigDynamicModule],
})
export class AppModule {}
