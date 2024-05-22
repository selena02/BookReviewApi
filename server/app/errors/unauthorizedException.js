import AppError from "./appError.js";

export class UnauthorizedException extends AppError {
  constructor(message) {
    super(message || "You are not authorized to access this resource", 401);
  }
}
