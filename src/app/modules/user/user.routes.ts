import express, { NextFunction, Request, Response } from 'express'
import { UserController } from './user.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';


const router = express.Router();

router.get(
    "/",
    auth(UserRole.ADMIN),
    UserController.getAllFromDB
)


router.post(
  "/register",
  (req: Request, res: Response, next: NextFunction) => {
    return UserController.createUserController(req, res, next);
  }
);


router.patch(
    '/:id/status',
    auth(UserRole.ADMIN),
    UserController.changeProfileStatus
);


export const userRoutes = router;