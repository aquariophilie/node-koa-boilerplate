import { IUser } from '../models/user.interface';

export interface UserService {
    save(userData: IUser): Promise<IUser>;
    update(id: string, userData: IUser): Promise<IUser>;
    getOne(id: string): Promise<IUser>;
    deleteOne(id: string): Promise<any>;
    list(): Promise<IUser[]>;
}
