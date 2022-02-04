import { injectable } from 'inversify';
import Ajv, { Schema, ValidateFunction } from 'ajv';
import { Filter, ObjectId } from 'mongodb';

import { IUser, User } from '../interfaces/models/user.interface';
import { Model } from './model';

export const UserSchema: Schema = {
    type: 'object',
    properties: {
        _id: { type: 'string' },
        email: {
            type: 'string', minLength: 5,
        },
        password: {
            type: 'string', minLength: 4,
        },
        name: {
            type: 'string', minLength: 4,
        },
    },
    required: ['email', 'name'],
    additionalProperties: false,
};

const validatorCompiled = new Ajv().compile(Object.assign({ required: ['password'] }, UserSchema));
const validatorUpdateCompiled = new Ajv().compile(UserSchema);

@injectable()
export class UserModel extends Model<IUser> implements User {

    protected validator: ValidateFunction = validatorCompiled;
    protected validatorUpdate: ValidateFunction = validatorUpdateCompiled;
    protected collectionName = 'users';

    public async findByEmail(email: string): Promise<IUser | null> {
        return (await this.collection).findOne({ email });
    }

    public async findAll(): Promise<IUser[]> {
        return (await this.collection).find().project<IUser>({ password: 0 }).toArray();
    }

    public async findOne(id: string): Promise<IUser | any> {
        const user = (await this.collection).findOne({ _id: new ObjectId(id) as Filter<IUser> });
        delete (await user).password;
        return user;
    }

    public validateUpdate(data: IUser) {
        const res = this.validatorUpdate(data);
        return res;
    }
}
