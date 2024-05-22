import AppError from "./appError.js";

export class BadRequestException extends AppError {
  constructor(message) {
    super(message || "Bad request", 400);
  }
}
