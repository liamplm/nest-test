import * as Joifull from 'joiful';

export const MongoObjectId = () => Joifull.string().exactLength(24);

export const Password = () => Joifull.string().min(6)

