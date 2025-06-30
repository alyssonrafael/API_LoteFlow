import { hashPassword, comparePasswords } from "../../utils/hash";

describe("hashPassword e comparePasswords", () => {
  it("deve gerar um hash diferente da senha original", async () => {
    const password = "minhaSenha123";
    const hashed = await hashPassword(password);

    expect(hashed).not.toBe(password);
    expect(typeof hashed).toBe("string");
  });

  it("deve validar a senha correta", async () => {
    const password = "minhaSenha123";
    const hashed = await hashPassword(password);

    const match = await comparePasswords(password, hashed);
    expect(match).toBe(true);
  });

  it("não deve validar senha incorreta", async () => {
    const password = "minhaSenha123";
    const hashed = await hashPassword(password);

    const match = await comparePasswords("senhaErrada", hashed);
    expect(match).toBe(false);
  });
});
