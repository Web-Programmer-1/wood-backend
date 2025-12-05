import { Request, Response } from "express";
import { UserService } from "./user.service";
import { createUserSchema } from "./user.validation";

export const UserController = {
  async register(req: Request, res: Response) {
    try {
      const parsed = createUserSchema.parse(req.body);
      const user = await UserService.createUser(parsed);

      res.status(201).json({ message: "User Registered", data: user });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  },

  async getUsers(req: Request, res: Response) {
    const users = await UserService.getUsers();
    res.json(users);
  },

  async getUser(req: Request, res: Response) {
    const user = await UserService.getById(req.params.id);
    res.json(user);
  },

  async updateUser(req: Request, res: Response) {
    const updated = await UserService.updateUser(req.params.id, req.body);
    res.json(updated);
  },
};
