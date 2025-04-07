import { Router } from 'express';
import { healthRouter } from './healthRoutes';
import { apiDocsRouter } from './apidocsRoutes';
import { productRouter } from './productRoutes';
import { userRouter } from './userRoutes';

const router: Router = Router();

router.use('/api-docs', apiDocsRouter);
router.use('/health', healthRouter);
router.use('/product', productRouter);
router.use('/user', userRouter);

export default router;
