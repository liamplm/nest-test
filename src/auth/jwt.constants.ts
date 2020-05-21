import { MongoObjectId } from '@global/joi-custom.validator';
import * as Joifull from 'joiful';

export const AUTH_HEADER_NAME = 'authorization';

export class Payload {
    @MongoObjectId()
    userId: string;

    @Joifull.date()
    iat: Date
}
