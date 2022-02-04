import Router from 'koa-router';
import controller from '../controllers/auth-controller';

const router = new Router();
router.prefix('/auth');
router.post('/signin', controller.signin);
router.get('/refresh-token', controller.refreshToken);

export default router;
