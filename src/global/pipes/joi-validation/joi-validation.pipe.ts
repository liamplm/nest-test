import {
    ArgumentMetadata,
    Injectable,
    PipeTransform,
    BadRequestException,
    Paramtype,
    applyDecorators,
    UsePipes,
} from '@nestjs/common';
import * as Joifull from 'joiful';

@Injectable()
export class JoiValidationPipe<T = any> implements PipeTransform {
    constructor(
        private schema: new (...args: any[]) => T,
        private types: Paramtype[] = [],
    ) {}

    transform(value: any, metadata: ArgumentMetadata) {
        if (this.types?.length) {
            if (this.types.indexOf(metadata.type) === -1) {
                return value;
            }
        } else if (metadata.type === 'custom') {
            return value;
        }

        const { error, value: resultValue } = Joifull.validateAsClass(
            value,
            this.schema,
            {
                convert: true,
            },
        );

        if (error) {
            delete error.isJoi;
            throw new BadRequestException(error);
        }
        return resultValue || value;
    }
}

export const Validation = <T>(schema: new (...args: any[]) => T, types: Paramtype[] = []) => applyDecorators(
    UsePipes(new JoiValidationPipe(schema, types))
);



