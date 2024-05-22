import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../services/tokenService.js";
import { NotFoundException } from "../errors/notFoundException.js";
import { BadRequestException } from "../errors/badRequestException.js";
import { ServerErrorException } from "../errors/serverErrorException.js";
import { ValidationException } from "../errors/validationException.js";
import { validationResult } from "express-validator";

const prisma = new PrismaClient();

export const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ValidationException(errors.array().map((err) => err.msg)));
  }

  const { username, email, password } = req.body;

  try {
    // Hashing and salting the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
        roles: {
          connect: [{ name: "Member" }], // Assign the "Member" role to the user
        },
      },
      include: {
        roles: true, // Included roles in the response to make it easier  for the client UI to handle roles
      },
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token: token,
      roles: user.roles.map((role) => role.name),
    });
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma error code for unique constraint violation
      next(new BadRequestException("Email or username already exists."));
    } else {
      next(new ServerErrorException("Error registering user."));
    }
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Checking if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,
      },
    });

    if (!user) {
      next(new NotFoundException("Invalid username or password"));
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      next(new BadRequestException("Invalid username or password")); // Do not want to reveal which one is incorrect
    }

    // Generate JWT
    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token: token,
      roles: user.roles.map((role) => role.name), // Return roles as an array of strings for client
    });
  } catch {
    next(new ServerErrorException("Error logging in user."));
  }
};
