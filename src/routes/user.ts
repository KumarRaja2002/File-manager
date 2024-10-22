import { Hono } from 'hono';
import { UserController } from '../controllers/userController';
import { AuthMiddleware } from '../middlewares/authMiddleware';

const userController = new UserController();
const authMiddleware = new AuthMiddleware();

export const userRoutes = new Hono();


userRoutes.post('/signup', userController.signUp.bind(userController));

userRoutes.post('/signin', userController.signIn.bind(userController));

userRoutes.get('/:id', userController.getOne.bind(userController));

userRoutes.patch('/:id', userController.update.bind(userController));

userRoutes.delete('/:id', userController.delete.bind(userController))

userRoutes.get('/profile',
    authMiddleware.checkAuthHeader,
    authMiddleware.validateAccessToken,
    userController.getProfile.bind(userController)
)