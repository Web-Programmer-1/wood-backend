import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post("/register", UserController.register);
router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUser);
router.put("/:id", UserController.updateUser);

export const userRoutes = router;
