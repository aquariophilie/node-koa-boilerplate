import { IUser } from '../models/user.interface';

export interface AuthService {
    signIn(email: string, password: string): Promise<{ user: IUser; accessToken: string, refreshToken: string }>;
    register(userData: IUser): Promise<{ user: IUser; accessToken: string, refreshToken: string }>;
    refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }>;
    generateRefreshToken(user: IUser): Promise<string>;
    generateAccessToken(user: IUser): Promise<string>;
}
