import { ConflictError, NotFoundError } from "../../../errors";
import { CompanyValidator } from "../../../validations";

describe("CompanyValidator", () => {
  const mockPrisma = {
    company: {
      findUnique: jest.fn(),
    },
  };

  const validator = new CompanyValidator(mockPrisma as any);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUniqueAccessCode", () => {
    it("deve lançar erro se o código de acesso já estiver em uso", async () => {
      mockPrisma.company.findUnique.mockResolvedValueOnce({ id: "123" });

      await expect(
        validator.validateUniqueAccessCode("ABC123")
      ).rejects.toThrow(ConflictError);

      expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({
        where: { accessCode: "ABC123" },
      });
    });

    it("não deve lançar erro se o código de acesso for único", async () => {
      mockPrisma.company.findUnique.mockResolvedValueOnce(null);

      await expect(
        validator.validateUniqueAccessCode("XYZ789")
      ).resolves.toBeUndefined();
    });
  });

  describe("validateUniqueCnpj", () => {
    it("deve lançar erro se o CNPJ já estiver cadastrado", async () => {
      mockPrisma.company.findUnique.mockResolvedValueOnce({ id: "123" });

      await expect(
        validator.validateUniqueCnpj("12345678901234")
      ).rejects.toThrow(ConflictError);

      expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({
        where: { cnpj: "12345678901234" },
      });
    });

    it("não deve lançar erro se o CNPJ for único", async () => {
      mockPrisma.company.findUnique.mockResolvedValueOnce(null);

      await expect(
        validator.validateUniqueCnpj("12345678901234")
      ).resolves.toBeUndefined();
    });
  });

  describe("validateExistingAccessCode", () => {
    it("deve lançar erro se o código de acesso não existir", async () => {
      mockPrisma.company.findUnique.mockResolvedValueOnce(null);

      await expect(
        validator.validateExistingAccessCode("INVALID123")
      ).rejects.toThrow(NotFoundError);

      expect(mockPrisma.company.findUnique).toHaveBeenCalledWith({
        where: { accessCode: "INVALID123" },
      });
    });

    it("não deve lançar erro se o código de acesso existir", async () => {
      mockPrisma.company.findUnique.mockResolvedValueOnce({ id: "123" });

      await expect(
        validator.validateExistingAccessCode("VALID123")
      ).resolves.toBeUndefined();
    });
  });
});
