import { PrismaClient } from "@prisma/client";
import userDto from "../models/userDto.js";
import { NotFoundException } from "../errors/notFoundException.js";
import { ServerErrorException } from "../errors/serverErrorException.js";
import { ValidationException } from "../errors/validationException.js";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        username: true,
        email: true,
      },
    });
    console.log("User:", user);

    if (!user) {
      return next(new NotFoundException("User not found"));
    }

    res.status(200).json(userDto(user));
  } catch (error) {
    next(new ServerErrorException("Error fetching user profile."));
  }
};

export const updateUserProfile = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationException(errors.array().map((err) => err.msg)));
  }

  const { username, email } = req.body;
  const userId = req.userId;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username, email },
      select: {
        username: true,
        email: true,
      },
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: userDto(updatedUser),
    });
  } catch {
    next(new ServerErrorException("Error updating user profile."));
  }
};
