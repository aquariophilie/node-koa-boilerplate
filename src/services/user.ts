import { hash } from 'bcrypt';
import createHttpError from 'http-errors';
import { inject, injectable } from 'inversify';

import { IUser, User } from '../interfaces/models/user.interface';
import { UserService } from '../interfaces/services/user.interface';
import { TYPES } from '../types';

@injectable()
export class UserServiceImpl implements UserService {

    constructor(
        @inject(TYPES.User) private userModel: User,
    ) {
    }

    async save(userData: IUser): Promise<IUser> {
        if (!this.userModel.validate(userData)) {
            throw createHttpError(400, 'Not valid data', { details: this.userModel.validatorErrors });
        }
        userData.password = await hash(userData.password, 10);
        delete userData._id;
        return this.userModel.insert(userData);
    }

    async update(id: string, userData: IUser): Promise<IUser> {
        const user = await this.userModel.findOne(id);
        if (!user) {
            throw createHttpError(404, 'Not found');
        }
        if (!this.userModel.validateUpdate(userData)) {
            throw createHttpError(400, 'Not valid data', { details: this.userModel.validatorErrors });
        }
        if (userData.password && typeof userData.password === 'string') {
            userData.password = await hash(userData.password, 10);
        }
        delete userData.email;
        delete userData._id;
        return this.userModel.update(id, userData).then(() => userData);
    }

    async getOne(id: string): Promise<IUser> {
        const data = await this.userModel.findOne(id);
        if (!data) {
            throw createHttpError(404, 'Not found');
        }
        return data;
    }

    async deleteOne(id: string): Promise<any> {
        const data = await this.userModel.findOne(id);
        if (!data) {
            throw createHttpError(404, 'Not found');
        }
        return this.userModel.deleteOne(id);
    }

    async list(): Promise<IUser[]> {
        const data = await this.userModel.findAll();
        return data;
    }

}
