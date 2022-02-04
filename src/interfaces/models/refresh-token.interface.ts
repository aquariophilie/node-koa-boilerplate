import { IModel } from './model.interface';

export interface IRefreshToken {
    _id: string;
    userId: string;
    exp: Date;

}

export type RefreshToken = IModel<IRefreshToken>
