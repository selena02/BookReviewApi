import express from "express";
import { listUsers, deleteUser } from "../controllers/adminController.js";
import { authenticateToken } from "../middleware/authToken.js";
import { authUserService } from "../services/authUserService.js";
import { requireRole } from "../middleware/roleCheck.js";

const router = express.Router();

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Lists all users other than Admin
 *     description: Retrieves a list of all users from the database, accessible only by administrators.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The user ID
 *                     example: 1
 *                   username:
 *                     type: string
 *                     description: The user's username
 *                     example: johndoe
 *                   email:
 *                     type: string
 *                     description: The user's email address
 *                     example: johndoe@example.com
 *                   roles:
 *                     type: array
 *                     items:
 *                       type: string
 *                     description: The roles assigned to the user
 *                     example: ["admin", "user"]
 *       401:
 *         description: Unauthorized if the user is not authenticated
 *       403:
 *         description: Forbidden if the user is not an administrator
 *       500:
 *         description: Internal server error
 */
router.get(
  "/users",
  authenticateToken,
  requireRole("Admin"),
  authUserService,
  listUsers
);

/**
 * @swagger
 * /api/admin/user/{id}:
 *   delete:
 *     summary: Deletes a user
 *     description: Allows an administrator to delete a user by user ID.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *       401:
 *         description: Unauthorized if the user is not authenticated
 *       403:
 *         description: Forbidden if the user is not an administrator
 *       404:
 *         description: Not found if the user ID does not exist
 *       500:
 *         description: Internal server error
 */

router.delete("/user/:id", authenticateToken, requireRole("Admin"), deleteUser);

export default router;
