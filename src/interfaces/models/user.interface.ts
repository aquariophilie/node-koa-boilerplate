import { IModel } from './model.interface';

export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    active: boolean,
    role: string
}

export interface User extends IModel<IUser> {
    findByEmail(email: string): Promise<IUser | null>;
    validateUpdate(data: IUser): any;
}
