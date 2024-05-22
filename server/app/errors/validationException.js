import AppError from "./appError.js";

export class ValidationException extends AppError {
  constructor(errors = []) {
    super("Validation failed", 400);
    this.errors = errors; // Additional property to store an array of errors
  }
}
