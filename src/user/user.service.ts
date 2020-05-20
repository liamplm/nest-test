import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from './user.schema';
import {
    CreateUserDTO,
    UpdateUserDTO,
    DeleteUserDTO,
    GetUserByIdDTO,
    GetUserBySizeDTO,
    GetUserByUsernameDTO,
} from './user.dto';

import { GetBySizeResponseDTO } from '@dto/get-by-size-response.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) {}

    async create(dto: CreateUserDTO): Promise<User> {
        const user = new this.userModel(dto);

        let result: User;
        try {
            result = await user.save();
        } catch (err) {
            if (err.errors.username) {
                throw new BadRequestException('username is exist');
            }
        }

        return result;
    }

    async update(dto: UpdateUserDTO): Promise<User> {
        const user = new this.userModel(dto);
        return user.save();
    }

    async delete(dto: DeleteUserDTO): Promise<User> {
        const user = new this.userModel(dto);
        return user.remove();
    }

    async getById(dto: GetUserByIdDTO): Promise<User> {
        return this.userModel.findById(dto._id);
    }

    async getByUsername(dto: GetUserByUsernameDTO): Promise<User> {
        return this.userModel.findOne({
            username: dto.username,
        });
    }

    async getBySize(
        dto: GetUserBySizeDTO,
    ): Promise<GetBySizeResponseDTO<User>> {
        const result = (
            await this.userModel.aggregate([
                {
                    $facet: {
                        result: [
                            {
                                $skip: dto.skip,
                            },
                            {
                                $limit: dto.take,
                            },
                        ],
                        meta: [
                            {
                                $count: 'total',
                            },
                        ],
                    },
                },
            ])
        )[0];

        return result;
    }
}
