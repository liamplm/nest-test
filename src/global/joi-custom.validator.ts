import * as Joifull from 'joiful';

//export const MongoObjectId = () => Joifull.any().custom((joifullCtx) => {
    //console.log('hell')
    //return Joi.custom((value, helper) => {
        //console.log('hell')
        //if (mongoose.isValidObjectId(value)) {
            //return new ObjectId(value);
        //} else {
            //return helper.error('id.invalid')
        //}
    //}) as any
//})
export const MongoObjectId = () => Joifull.string().exactLength(24);

export const Password = () => Joifull.string().min(6)

