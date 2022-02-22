import Router from 'koa-router';
import controller from '../controllers/user-controller';

const router = new Router();
router.prefix('/user');
router.get('/', controller.list);
router.post('/', controller.save);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

export default router;
