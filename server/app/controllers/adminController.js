import { PrismaClient } from "@prisma/client";
import { ServerErrorException } from "../errors/serverErrorException.js";
import { BadRequestException } from "../errors/badRequestException.js";
import { NotFoundException } from "../errors/notFoundException.js";

const prisma = new PrismaClient();

export const listUsers = async (req, res, next) => {
  try {
    const currentUserId = req.userId;

    const users = await prisma.user.findMany({
      where: {
        id: {
          not: currentUserId, // this will exclude the current user from the list
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        roles: true,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    next(new ServerErrorException("Error fetching users"));
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = parseInt(req.params.id);
  if (!userId) {
    next(new BadRequestException("User ID is required"));
  }

  try {
    const user = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    res.status(200).json({ message: "User deleted successfully", user });
  } catch (error) {
    if (error.code === "P2025") {
      next(new NotFoundException("User with email not found"));
    }
    next(new ServerErrorException("Error fetching users"));
  }
};
