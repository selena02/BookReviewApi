import { check } from "express-validator";

export const createBookValidationRules = [
  check("title")
    .not()
    .isEmpty()
    .withMessage("Title is required")
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be between 1 and 100 characters long"),

  check("author")
    .not()
    .isEmpty()
    .withMessage("Author is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Author must be between 2 and 50 characters long"),
];
