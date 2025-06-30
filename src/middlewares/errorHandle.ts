import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { ValidationError } from "../errors/ValidationError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Se o erro for uma instância de AppError, formata a resposta
  if (err instanceof AppError) {
    const response: any = {
      status: "error",
      message: err.message,
    };

    // Se for uma instância de ValidationError, inclui os detalhes dos erros de validação
    if (err instanceof ValidationError) {
      response.errors = err.errors; // Já estão formatados pelo middleware de validação
    }

    // Retorna o status e a resposta de erro
    res.status(err.statusCode).json(response);
    return;
  }

  // Se o erro não for tratado, exibe no console e retorna erro genérico
  console.error("Unexpected error:", err);
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
}
