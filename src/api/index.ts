import Router from 'koa-router';

import config from '../config';
import status from './routes/status';
import auth from './routes/auth';
import user from './routes/user';

const api = new Router();
api.prefix(config.api.prefix);
api.use(status.routes()).use(status.allowedMethods());
api.use(auth.routes()).use(auth.allowedMethods());
api.use(user.routes()).use(user.allowedMethods());

export default api;
