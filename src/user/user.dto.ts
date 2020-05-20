import * as Joifull from 'joiful';
import { MongoObjectId, Password } from '@global/joi-custom.validator';

export class GetUserByUsernameDTO {
    @Joifull.string().required()
    username: string;
}

export class CreateUserDTO {
    @Joifull.string().required()
    username: string;

    @Joifull.string()
    firstName: string;

    @Joifull.string()
    lastName: string;

    @Joifull.date()
    birthDate: Date;

    @Joifull.string().email()
    email: string;

    @Password().required()
    password: string;
}

export class UpdateUserDTO {
    @MongoObjectId()
    _id: string;

    @Joifull.string().required()
    username: string;

    @Joifull.string()
    firstName: string;

    @Joifull.string()
    lastName: string;

    @Joifull.date()
    birthDate: Date;

    @Joifull.string().email()
    email: string;

    @Password().required()
    password: string;
}

export class DeleteUserDTO {
    @MongoObjectId()
    _id: string;
}

export class GetUserByIdDTO {
    @MongoObjectId()
    _id: string;
}

export class GetUserBySizeDTO {
    @Joifull.number().integer().min(0)
    take: number;

    @Joifull.number().integer().min(0)
    skip: number;
}

