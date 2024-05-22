import { PrismaClient } from "@prisma/client";
import { ValidationException } from "../errors/validationException.js";
import { validationResult } from "express-validator";
import { ServerErrorException } from "../errors/serverErrorException.js";
import { NotFoundException } from "../errors/notFoundException.js";
import { UnauthorizedException } from "../errors/unauthorizedException.js";

const prisma = new PrismaClient();

export const getAllBooks = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 8;
  if (page < 1) {
    next(new ValidationException("Page number must be greater than 0"));
  } else if (limit < 1) {
    next(new ValidationException("Limit must be greater than 0"));
  } else if (limit > 15) {
    limit = 15;
  }
  const offset = (page - 1) * limit;

  try {
    const books = await prisma.book.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        title: "asc", // Ordering books by title
      },
      select: {
        id: true,
        title: true,
        author: true,
        user: {
          select: {
            username: true, // Will also return the username of the user who created the book
          },
        },
      },
    });
    const totalBooks = await prisma.book.count();
    const totalPages = Math.ceil(totalBooks / limit);

    res.status(200).json({
      data: books,
      meta: {
        totalBooks,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    next(new ServerErrorException("Error fetching books"));
  }
};

export const getBook = async (req, res, next) => {
  const bookId = parseInt(req.params.id);
  if (!bookId) {
    next(new ValidationException("Book ID is required"));
  }

  try {
    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
      include: {
        user: {
          select: {
            username: true, // Include the username of the book owner
          },
        },
        reviews: {
          // Including associated reviews
          select: {
            id: true,
            title: true,
            content: true,
            rating: true,
            user: {
              select: {
                username: true, // Include the username of the review author
              },
            },
          },
        },
      },
    });

    if (!book) {
      next(new NotFoundException("Book not found."));
    }

    res.status(200).json(book);
  } catch (error) {
    next(new ServerErrorException("Error fetching book"));
  }
};

export const createBook = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new ValidationException(errors.array().map((err) => err.msg)));
  }

  const { title, author } = req.body;
  const userId = req.userId;

  try {
    const newBook = await prisma.book.create({
      data: {
        title: title,
        author: author,
        userId: userId, // Assign the book to the authenticated user
      },
    });

    res.status(201).json(newBook);
  } catch (error) {
    next(new ServerErrorException("Error creating book"));
  }
};

export const updateBook = async (req, res, next) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;

  if (!bookId) {
    next(new ValidationException("Book ID is required"));
  }

  try {
    const updateData = {};

    if (title) updateData.title = title;
    if (author) updateData.author = author;

    if (Object.keys(updateData).length > 0) {
      const book = await prisma.book.findUnique({
        where: { id: bookId },
        select: {
          userId: true,
        },
      });

      if (!book) {
        next(new NotFoundException("Book not found."));
      }

      const currentUserId = req.user?.id;
      if (!currentUserId || book.userId !== currentUserId) {
        next(
          new UnauthorizedException(
            "You are not authorized to update this book."
          )
        );
      }

      const updatedBook = await prisma.book.update({
        where: { id: bookId },
        data: updateData,
        select: {
          id: true,
          title: true,
          author: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      });

      return res.status(200).json({
        message: "Book updated successfully",
        book: updatedBook,
      });
    } else {
      next(new ValidationException("No new data provided to update the book."));
    }
  } catch (error) {
    next(new ServerErrorException("Error updating book"));
  }
};

export const deleteBook = async (req, res, next) => {
  const bookId = parseInt(req.params.id);

  if (!bookId) {
    next(new ValidationException("Book ID is required"));
  }

  const userId = req.userId;

  try {
    const book = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });

    if (!book) {
      next(new NotFoundException("Book not found."));
    }

    // Check if the user is authorized to delete the book
    if (book.userId !== userId) {
      next(
        new UnauthorizedException("You are not authorized to delete this book.")
      );
    }

    await prisma.book.delete({
      where: {
        id: bookId,
      },
    });

    res.status(200).json({ message: "Book deleted successfully." });
  } catch (error) {
    next(new ServerErrorException("Error deleting book."));
  }
};
