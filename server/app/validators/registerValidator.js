import { check } from "express-validator";

export const userValidationRules = [
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

  check("password")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4, max: 12 })
    .withMessage("Password must be between 4 and 12 characters long")
    .matches(/.*[a-zA-Z]+.*/)
    .withMessage("Password must include at least one letter"),

  check("confirmPassword")
    .not()
    .isEmpty()
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];
