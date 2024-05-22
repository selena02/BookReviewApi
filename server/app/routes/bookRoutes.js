import express from "express";
import {
  getAllBooks,
  getBook,
  createBook,
  deleteBook,
  updateBook,
} from "../controllers/bookController.js";
import { authenticateToken } from "../middleware/authToken.js";
import { createBookValidationRules } from "../validators/createBookValidator.js";
import { authUserService } from "../services/authUserService.js";

const router = express.Router();

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Retrieve all books with pagination
 *     description: Fetches a list of all books available in the database, paginated. No authentication required.
 *     tags: [Books]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number of the results to fetch
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of books per page
 *     responses:
 *       200:
 *         description: A paginated list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalItems:
 *                   type: integer
 *                   example: 20
 *                   description: Total number of books available
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *                   description: Total number of pages
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *                   description: Current page number
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The book ID
 *                         example: 1
 *                       title:
 *                         type: string
 *                         description: The title of the book
 *                         example: "1984"
 *                       author:
 *                         type: string
 *                         description: The author of the book
 *                         example: "George Orwell"
 *                       user:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             description: The username of the book owner
 *                             example: "john_doe"
 *       500:
 *         description: Internal server error
 */
router.get("/", getAllBooks);

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Retrieve a book by ID along with its reviews
 *     description: Fetches a single book by its ID from the database along with all its associated reviews. No authentication required.
 *     tags: [Books]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the book to retrieve
 *     responses:
 *       200:
 *         description: Details of the book along with its reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The book ID
 *                   example: 1
 *                 title:
 *                   type: string
 *                   description: The title of the book
 *                   example: "To Kill a Mockingbird"
 *                 author:
 *                   type: string
 *                   description: The author of the book
 *                   example: "Harper Lee"
 *                 user:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       description: The username of the book owner
 *                       example: "alice"
 *                 reviews:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: The review ID
 *                         example: 100
 *                       title:
 *                         type: string
 *                         description: The title of the review
 *                         example: "Insightful Analysis"
 *                       content:
 *                         type: string
 *                         description: The content of the review
 *                         example: "A deep dive into the characters..."
 *                       rating:
 *                         type: integer
 *                         description: The rating given in the review
 *                         example: 5
 *                       user:
 *                         type: object
 *                         properties:
 *                           username:
 *                             type: string
 *                             description: The username of the reviewer
 *                             example: "john_doe"
 *       404:
 *         description: Book not found if no book exists with the given ID
 *       500:
 *         description: Internal server error
 */
router.get("/:id", getBook);

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     description: Adds a new book to the database. No authentication required.
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the book
 *                 example: "The Great Gatsby"
 *               author:
 *                 type: string
 *                 description: The name of the author
 *                 example: "F. Scott Fitzgerald"
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The book ID
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "The Great Gatsby"
 *                 author:
 *                   type: string
 *                   example: "F. Scott Fitzgerald"
 *       400:
 *         description: Bad request if data is invalid
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authenticateToken,
  authUserService,
  createBookValidationRules,
  createBook
);

/**
 * @swagger
 * /api/books/{id}:
 *   put:
 *     summary: Update a book's title or author
 *     description: Updates the title or author of a book. Only the owner of the book can perform this operation.
 *     tags: [Books]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the book to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the book
 *                 example: "New Book Title"
 *               author:
 *                 type: string
 *                 description: The new author of the book
 *                 example: "New Author Name"
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Book updated successfully"
 *                 book:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     title:
 *                       type: string
 *                       example: "New Book Title"
 *                     author:
 *                       type: string
 *                       example: "New Author Name"
 *                     user:
 *                       type: object
 *                       properties:
 *                         username:
 *                           type: string
 *                           example: "john_doe"
 *       400:
 *         description: Bad request if the data provided is invalid or missing
 *       403:
 *         description: Forbidden if the user is not the owner of the book
 *       404:
 *         description: Not found if no book exists with the given ID
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authenticateToken,
  authUserService,
  createBookValidationRules,
  updateBook
);

/**
 * @swagger
 * /api/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     description: Deletes a book from the database based on the book ID.
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the book to delete
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found if no book exists with the given ID
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authenticateToken, authUserService, deleteBook);

export default router;
