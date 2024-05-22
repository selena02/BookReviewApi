import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authToken.js";
import { authUserService } from "../services/authUserService.js";
import { updateUserValidationRules } from "../validators/updateUserValidator.js";

const router = express.Router();
/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Retrieve user profile
 *     description: Returns user's profile information to authenticated users.
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: johndoe
 *                 email:
 *                   type: string
 *                   example: johndoe@gmail.com
 *       401:
 *         description: Unauthorized if token is invalid or missing.
 *       500:
 *         description: Internal server error.
 */
router.get("/profile", authenticateToken, authUserService, getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     description: Allows users to update their username and Gmail address.
 *     tags: [Profile]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *                 description: New username, must be 4-20 characters long.
 *                 example: newjohndoe
 *               email:
 *                 type: string
 *                 description: New Gmail address, must be a valid Gmail.
 *                 example: newjohndoe@gmail.com
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profile updated successfully
 *                 updatedUser:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: newjohndoe
 *       400:
 *         description: Validation error for username or email.
 *       401:
 *         description: Unauthorized if token is invalid or missing.
 *       500:
 *         description: Internal server error.
 */
router.put(
  "/profile",
  authenticateToken,
  authUserService,
  updateUserValidationRules,
  updateUserProfile
);

export default router;
