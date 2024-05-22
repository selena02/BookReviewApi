import { check } from "express-validator";

export const updateUserValidationRules = [
  check("username")
    .not()
    .isEmpty()
    .withMessage("Username is required")
    .isLength({ min: 4, max: 12 })
    .withMessage("Username must be between 4 and 12 characters long"),

  check("email")
    .not()
    .isEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Must be a valid email address"),
];
