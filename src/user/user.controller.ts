import {
    Controller,
    Get,
    Query,
    Body,
    Post,
    UsePipes,
    Put,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
    GetUserBySizeDTO,
    GetUserByIdDTO,
    UpdateUserDTO,
    GetUserByUsernameDTO,
} from './user.dto';
import { Validation } from '@pipes/joi-validation/joi-validation.pipe';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { UserInfo } from './user.decorator';
import { User } from './user.schema';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Put('/')
    @Validation(UpdateUserDTO)
    async update(@Body() dto: UpdateUserDTO) {
        return this.userService.update(dto);
    }

    @Get('/')
    @Validation(GetUserByIdDTO)
    async getById(@Query() dto: GetUserByIdDTO) {
        return this.userService.getById(dto);
    }

    @Get('/username')
    @Validation(GetUserByUsernameDTO)
    async getByUsername(@Query() dto: GetUserByUsernameDTO) {
        return this.userService.getByUsername(dto);
    }

    @Get('/size')
    @UseGuards(JwtAuthGuard)
    @Validation(GetUserBySizeDTO)
    async getBySize(
        @Query() dto: GetUserBySizeDTO,
    ) {
        return this.userService.getBySize(dto);
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    async getUserProfile(
        @UserInfo() userInfo: User
    ) {
        console.log(userInfo)        
        return userInfo
    }
}
