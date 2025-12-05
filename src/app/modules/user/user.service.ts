
import bcrypt from "bcrypt";
import { prisma } from "../../shared/prisma";

export const UserService = {
  async createUser(data:any) {
    const hash = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash: hash,
        role: "CUSTOMER",
      },
    });

    // user profile auto-create
    await prisma.userProfile.create({
      data: { userId: user.id },
    });

    return user;
  },

  async getUsers() {
    return prisma.user.findMany();
  },

  async getById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async updateUser(id: string, data:any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },
};
