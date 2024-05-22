import AppError from "./appError.js";

export class NotFoundException extends AppError {
  constructor(message) {
    super(message || "The requested resource was not found", 404);
  }
}
