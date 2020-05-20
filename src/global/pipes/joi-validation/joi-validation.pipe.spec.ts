import { JoiValidationPipe } from './joi-validation.pipe';
//import { JoiValidationPipe, Validation } from './joi-validation.pipe';
//import * as Joifull from 'joiful';

describe('Joi validation pipe', () => {
    it('should be defined', () => {
        expect(JoiValidationPipe).toBeDefined();
    });

    //it('should throw bad request exception', async () => {
        //class Schema {
            //@Joifull.string()
            //name: string;

            //@Joifull.number().positive()
            //age: number;
        //}

        //(new JoiValidationPipe(Schema)).transform()
    //});
});
