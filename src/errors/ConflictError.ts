import { AppError } from "./AppError";

export class ConflictError extends AppError {
  constructor(message = "Conflict error") {
    super(message, 409);
  }
}