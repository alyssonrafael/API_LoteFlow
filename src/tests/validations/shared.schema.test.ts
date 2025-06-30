import {
  emailField,
  passwordField,
  companyCodeField,
  companyNameField,
  cpfField,
  cnpjField,
  phoneField,
  fullNameField,
  userNameField,
} from "../../validations";

describe("Zod field validations", () => {
  it("deve validar e-mail inválido", () => {
    const result = emailField.safeParse("invalido.com");
    expect(result.success).toBe(false);
    expect(result.success).toBeFalsy();
    if (!result.success) {
      expect(result.error.format()._errors).toContain("E-mail inválido");
    }
  });

  it("deve validar senha com menos de 6 caracteres", () => {
    const result = passwordField.safeParse("123");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format()._errors).toContain(
        "A senha deve ter pelo menos 6 caracteres"
      );
    }
  });

  it("deve validar código da empresa inválido", () => {
    const result = companyCodeField.safeParse("12AB34");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format()._errors).toContain(
        "Código da empresa deve conter 3 letras seguidas de 3 números"
      );
    }
  });

  it("deve validar nome da empresa curto", () => {
    const result = companyNameField.safeParse("Abc");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format()._errors).toContain(
        "O nome da empresa deve ter pelo menos 6 caracteres"
      );
    }
  });

  it("deve validar CPF inválido", () => {
    const result = cpfField.safeParse("1234567890"); // 10 dígitos
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format()._errors).toContain(
        "CPF deve conter 11 dígitos numéricos"
      );
    }
  });

  it("deve validar CNPJ inválido", () => {
    const result = cnpjField.safeParse("1234567890123"); // 13 dígitos
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format()._errors).toContain(
        "CNPJ deve conter 14 dígitos numéricos"
      );
    }
  });

  it("deve validar telefone com menos de 10 dígitos", () => {
    const result = phoneField.safeParse("81999999"); // muito curto
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format()._errors).toContain(
        "Telefone deve conter 10 ou 11 dígitos numéricos"
      );
    }
  });

  it("deve validar nome completo com menos de 4 caracteres", () => {
    const result = fullNameField.safeParse("Ana");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format()._errors).toContain(
        "O nome deve conter pelo menos 4 caracteres."
      );
    }
  });

  it("deve validar userName com menos de 6 caracteres", () => {
    const result = userNameField.safeParse("abc");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format()._errors).toContain(
        "O nome deve conter pelo menos 6 caracteres."
      );
    }
  });

  it("deve validar userName com mais de 10 caracteres", () => {
    const result = userNameField.safeParse("abcdefghijk");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.format()._errors).toContain(
        "O nome deve conter no máximo 10 caracteres"
      );
    }
  });
});
