import { check } from "express-validator";

export const createReviewValidationRules = [
  check("title")
    .isLength({ min: 1, max: 50 })
    .withMessage("Title must be between 1 and 100 characters long"),

  check("content")
    .not()
    .isEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Content must be between 10 and 1000 characters long"),

  check("rating")
    .not()
    .isEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be an integer between 1 and 5"),

  check("bookId")
    .not()
    .isEmpty()
    .withMessage("Book ID is required")
    .isInt()
    .withMessage("Book ID must be a valid integer"),
];
