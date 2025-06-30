import { AppError } from "./AppError";

export type FieldErrors = Record<string, string[]>;

export class ValidationError extends AppError {
  constructor(
    public readonly errors: FieldErrors,
    message: string = "Validation failed"
  ) {
    super(message, 400);
  }
}