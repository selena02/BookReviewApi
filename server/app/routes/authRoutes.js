import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { userValidationRules } from "../validators/registerValidator.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with username, email, and password.
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username.
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 format: email
 *               password:
 *                 type: string
 *                 description: The user's password.
 *               confirmPassword:
 *                 type: string
 *                 description: A confirmation of the user's password.
 *     responses:
 *       201:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request if the data provided is invalid.
 *       500:
 *         description: Internal server error.
 */
router.post("/register", userValidationRules, registerUser);

/**
 * @swagger
 * /api/auth//login:
 *   post:
 *     summary: User login
 *     description: Logs in a user using email and password.
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *                 format: email
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       200:
 *         description: Login successful, returns user data and token.
 *       401:
 *         description: Unauthorized if credentials are invalid.
 *       500:
 *         description: Internal server error.
 */
router.post("/login", loginUser);

export default router;
