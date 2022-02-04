import { Container } from 'inversify';

import { TYPES } from '../types';
import { MongoDBClient } from '../loaders/mongo-client';
import { User } from '../interfaces/models/user.interface';
import { UserModel } from '../models/user';
import { AuthService } from '../interfaces/services/IAuth';
import { AuthServiceImpl } from '../services/auth';
import { UserService } from '../interfaces/services/IUser';
import { UserServiceImpl } from '../services/user';

const myContainer = new Container();
myContainer.bind<MongoDBClient>(TYPES.MongoClient).to(MongoDBClient).inSingletonScope();
// Models
myContainer.bind<User>(TYPES.User).to(UserModel);
// Services
myContainer.bind<AuthService>(TYPES.AuthService).to(AuthServiceImpl).inSingletonScope();
myContainer.bind<UserService>(TYPES.UserService).to(UserServiceImpl);

export default myContainer;
