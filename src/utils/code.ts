import { randomBytes } from "crypto";

//gera o token para receração de senha
export function generateShortToken(length = 6): string {
  return randomBytes(length).toString("hex").slice(0, length);
}
