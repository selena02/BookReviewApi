import express from "express";
import { createReview, deleteReview } from "../controllers/reviewController.js";
import { authenticateToken } from "../middleware/authToken.js";
import { authUserService } from "../services/authUserService.js";
import { createReviewValidationRules } from "../validators/createReviewValidator.js";

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Create a new review
 *     description: Allows a user to post a review for a book. The user must be authenticated.
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - rating
 *               - bookId
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the review.
 *                 example: "Excellent read!"
 *               content:
 *                 type: string
 *                 description: Detailed content of the review.
 *                 example: "This book provides deep insights into..."
 *               rating:
 *                 type: integer
 *                 description: The rating given to the book from 1 to 5.
 *                 example: 5
 *               bookId:
 *                 type: integer
 *                 description: The ID of the book being reviewed.
 *                 example: 1
 *     responses:
 *       201:
 *         description: Review created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review created successfully"
 *       400:
 *         description: Invalid input data.
 *       403:
 *         description: Unauthorized access, if user is not logged in.
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/",
  authenticateToken,
  authUserService,
  createReviewValidationRules,
  createReview
);

/**
 * @swagger
 * /api/reviews/{id}:
 *   delete:
 *     summary: Delete a review
 *     description: Allows a user to delete their own review. The user must be authenticated and must be the owner of the review.
 *     tags: [Reviews]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the review to delete.
 *     responses:
 *       200:
 *         description: Review deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Review deleted successfully"
 *       403:
 *         description: Unauthorized if the user is not the owner of the review.
 *       404:
 *         description: Not found if the review does not exist.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", authenticateToken, authUserService, deleteReview);

export default router;
