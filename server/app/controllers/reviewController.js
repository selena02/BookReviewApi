import { PrismaClient } from "@prisma/client";
import { ValidationException } from "../errors/validationException.js";
import { validationResult } from "express-validator";
import { NotFoundException } from "../errors/notFoundException.js";
import { ServerErrorException } from "../errors/serverErrorException.js";

const prisma = new PrismaClient();

export const createReview = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ValidationException(errors.array().map((err) => err.msg)));
  }

  const { title, content, rating, bookId } = req.body;
  const userId = req.userId;

  try {
    const review = await prisma.review.create({
      data: {
        title,
        content,
        rating,
        bookId,
        userId,
      },
    });

    res.status(201).json({
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    next(new ServerErrorException("Error creating review"));
  }
};

export const deleteReview = async (req, res, next) => {
  const reviewId = parseInt(req.params.id);
  if (!reviewId) {
    return next(new ValidationException("Review ID is required"));
  }

  const userId = req.userId;

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return next(new NotFoundException("Review not found"));
    }

    if (review.userId !== userId) {
      return new next(
        UnauthorizedException("You are not authorized to delete this review")
      );
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    next(new ServerErrorException("Error deleting review"));
  }
};
