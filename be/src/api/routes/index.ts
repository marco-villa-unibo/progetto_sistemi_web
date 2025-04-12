import { Router } from 'express';
import { healthRouter } from './healthRoutes';
import { apiDocsRouter } from './apidocsRoutes';
import { productRouter } from './productRoutes';
import { userRouter } from './userRoutes';
import { authRouter } from './authRoutes';
import { cartRouter } from './cartRoutes';
import { orderRouter } from './orderRoutes';

const router: Router = Router();

router.use('/api-docs', apiDocsRouter);
router.use('/health', healthRouter);
router.use('/product', productRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/cart', cartRouter);
router.use('/order', orderRouter);

export default router;
