import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi'
import { AppModuleMetadata } from '../src/app.module';


@Module({
    ...AppModuleMetadata,
    imports: [
        ...AppModuleMetadata.imports,
        ConfigModule.forRoot({
            envFilePath: '.test.env',
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'production', 'test', 'provision')
                    .default('development'),
                PORT: Joi.number()
                    .port()
                    .default(3000),
                DATABASE_URI: Joi.string(),
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
        }),
    ],
})
export class TestAppModule {}
