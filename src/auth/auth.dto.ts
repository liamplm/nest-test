import * as Joifull from 'joiful';
import { Password } from '@global/joi-custom.validator';
import { CreateUserDTO } from '@user/user.dto';
import { User } from '@user/user.schema';

export class AuthRegisterDTO extends CreateUserDTO {}

export class AuthLoginDTO {
    @Joifull.string().required()
    username: string;

    @Password().required()
    password: string;
}

export class AuthValidateUserDTO extends AuthLoginDTO {
    user?: User;
}
