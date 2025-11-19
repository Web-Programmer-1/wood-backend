import { Request, Response } from "express";
import { UserService } from "./user.service";
import { createUserSchema } from "./user.validation";

export const UserController = {
  async createUser(req: Request, res: Response) {
    try {
      const parsed = createUserSchema.parse(req.body);
      const user = await UserService.createUser(parsed);
      res.status(201).json({
        message: "User created successfully",
        data: user,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  },

  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.json(user);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },
};
