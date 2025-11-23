// Node modules
import { Router } from "express";
const router = Router();


// Routes
import authRoutes from "@/routes/v1/auth";
import userRoutes from '@/routes/v1/user';
import blogRoutes from '@/routes/v1/blog';
import likeRoutes from '@/routes/v1/like';


// Root Route
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is Live...',
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});


router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);
router.use('/Likes', likeRoutes);

export default router;