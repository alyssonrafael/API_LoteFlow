import { ZodError, ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/ValidationError";

export const validate =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      // Formata os erros de validação para uma estrutura mais legível
      if (error instanceof ZodError) {
        const errors = error.issues.reduce((acc, issue) => {
          const key = issue.path.join(".");
          acc[key] = acc[key] || [];
          acc[key].push(issue.message);
          return acc;
        }, {} as Record<string, string[]>);

        // Lança um erro de validação para ser tratado pelo handler global
        next(new ValidationError(errors));
      } else {
        // Caso não seja um erro de validação, passa o erro para o próximo middleware
        next(error);
      }
    }
  };
