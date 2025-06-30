import jwt, { Secret } from "jsonwebtoken";
import { JwtPayloadCustom } from "../types/jwtPayload";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET não definido no .env");
}

// Cria o token
export function generateToken(
  payload: Record<string, any>,
  expiresIn?: string
): string {
  const expiration = expiresIn || process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(payload, secret as Secret, {
    expiresIn: expiration as `${number}${"s" | "m" | "h" | "d"}`,
  });
}

// Verifica o token e retorna o payload (lança erro se inválido)
export function verifyToken(token: string): JwtPayloadCustom {
  const decoded = jwt.verify(token, secret as Secret);

  if (
    typeof decoded === "object" &&
    decoded !== null &&
    "sub" in decoded &&
    "role" in decoded
  ) {
    return decoded as JwtPayloadCustom;
  }

  throw new Error("Token inválido: payload sem sub ou role");
}