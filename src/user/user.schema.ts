import { Schema, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new Schema({
    username: { type: String, unique: true },
    firstName: String,
    lastName: String,
    birthDate: Date,
    email: String,
    password: String,
    lastLogin: { type: Date, default: () => new Date() }
});

export async function comparePassword(inputPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, this.password);
};

export class User extends Document {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    birthDate: Date;
    email: string;
    password: string;
    lastLogin: Date;

    comparePassword: typeof comparePassword; 
}
