import { ZodError, ZodTypeAny } from "zod";
import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../errors/ValidationError";

type RequestPart = "body" | "query" | "params";

// Estende o tipo do Request para aceitar "validated"
declare module "express-serve-static-core" {
  interface Request {
    validated?: any;
    validatedParams?: any;
    validatedBody?: any;
    validatedQuery?: any;
  }
}

export const validate =
  (schema: ZodTypeAny, part: RequestPart = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req[part]);
      const key = `validated${part.charAt(0).toUpperCase() + part.slice(1)}` as
        | "validatedBody"
        | "validatedParams"
        | "validatedQuery";

      req[key] = parsed;
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
