
import jwt from "jsonwebtoken";
import { JwtPayloadCustom } from "../../types/jwtPayload";
import { generateToken, verifyToken } from "../../utils/jwt";

describe("JWT Utils", () => {
  const payload: JwtPayloadCustom = {
    sub: "user-id-123",
    role: "ADMIN",
    companyId: "company-id-456",
    accessCode: "ABC123"
  };

  it("deve gerar um token válido", () => {
    const token = generateToken(payload, "1h");

    expect(typeof token).toBe("string");
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    expect(decoded).toHaveProperty("sub", payload.sub);
    expect(decoded).toHaveProperty("role", payload.role);
    expect(decoded).toHaveProperty("companyId", payload.companyId);
  });

  it("deve verificar e retornar o payload corretamente", () => {
    const token = generateToken(payload, "1h");
    const verified = verifyToken(token);

    expect(verified.sub).toBe(payload.sub);
    expect(verified.role).toBe(payload.role);
    expect(verified.companyId).toBe(payload.companyId);
    expect(verified.accessCode).toBe(payload.accessCode);
  });

  it("deve lançar erro ao verificar token inválido", () => {
    expect(() => verifyToken("token-invalido")).toThrow("jwt malformed");
  });

  it("deve lançar erro se o payload não tiver sub ou role", () => {
    const token = jwt.sign({ foo: "bar" }, process.env.JWT_SECRET as string);
    expect(() => verifyToken(token)).toThrow("Token inválido: payload sem sub ou role");
  });
});
