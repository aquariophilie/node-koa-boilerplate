import Router from 'koa-router';
import controller from '../controllers/status-controller';

const router = new Router();
router.prefix('/status');
router.get('/', controller.status);

export default router;
