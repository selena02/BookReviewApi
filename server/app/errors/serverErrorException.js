import AppError from "./appError.js";

export class ServerErrorException extends AppError {
  constructor(message) {
    super(message || "Internal Server Error", 500);
  }
}
