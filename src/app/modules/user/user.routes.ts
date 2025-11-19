import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post("/register", UserController.createUser);
router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUser);

export default router;
