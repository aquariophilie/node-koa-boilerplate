import { compare, hash } from 'bcrypt';
import createHttpError from 'http-errors';
import { inject, injectable } from 'inversify';
import jwt, { Algorithm } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import config from '../config';
import { AuthService } from '../interfaces/services/IAuth';
import { IUser, User } from '../interfaces/models/user.interface';
import { TYPES } from '../types';

@injectable()
export class AuthServiceImpl implements AuthService {

    constructor(
        @inject(TYPES.User) private userModel: User,
    ) {
    }

    public async signIn(email: string, password: string): Promise<{ user: IUser; accessToken: string, refreshToken: string }> {
        const user = await this.userModel.findByEmail(email);
        if (!user) {
            throw Error('Invalid Credential');
        }
        const match = await compare(password, user.password);
        if (!match) {
            throw Error('Invalid Credential');
        }
        const accessToken = await this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user);
        delete user.password;
        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    public async register(userData: IUser): Promise<{ user: IUser; accessToken: string, refreshToken: string }> {
        if (!this.userModel.validate(userData)) {
            throw createHttpError(400, 'Not valid data', { details: this.userModel.validatorErrors });
        }
        userData.password = await hash(userData.password, 10);
        delete userData._id;
        const user = await this.userModel.insert(userData);
        const accessToken = await this.generateAccessToken(user);
        const refreshToken = await this.generateRefreshToken(user);
        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    public async generateRefreshToken(user: IUser): Promise<string> {
        const token = jwt.sign({
            data: {
                email: user.email,
                name: user.name,
                _id: user._id,
                jti: uuidv4(),
            },
        }, config.jwtPrivateKey, {
            algorithm: config.jwtAlgorithm as Algorithm,
            expiresIn: config.jwtRefreshExpiresIn,
        });
        return token;
    }

    public async generateAccessToken(user: IUser): Promise<string> {
        const accessToken = jwt.sign({
            data: {
                email: user.email,
                name: user.name,
                _id: user._id,
                jti: uuidv4(),
            },
        }, config.jwtPrivateKey, {
            algorithm: config.jwtAlgorithm as Algorithm,
            expiresIn: config.jwtExpiresIn,
        });
        return accessToken;
    }

    public async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; }> {
        try {
            const decoded: IUser = jwt.verify(refreshToken, config.jwtPublicKey, { algorithms: [config.jwtAlgorithm as Algorithm] }) as IUser;
            const accessToken = await this.generateAccessToken(decoded);
            return { accessToken };
        } catch (error) {
            throw createHttpError(401, 'Invalid Credential');
        }
    }
}
