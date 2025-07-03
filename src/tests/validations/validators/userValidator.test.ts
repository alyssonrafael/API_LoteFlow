import { ConflictError, NotFoundError } from "../../../errors";
import { UserValidator } from "../../../validations";


describe("UserValidator", () => {
  const mockPrisma = {
    user: {
      findFirst: jest.fn(),
    },
  };

  const validator = new UserValidator(mockPrisma as any);

  const userId = "user-123";
  const companyId = "company-456";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("validateUniqueUserName", () => {
    it("deve lançar erro se o username já estiver em uso", async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce({ id: "123" });

      await expect(
        validator.validateUniqueUserName("empresa1", "rafael")
      ).rejects.toThrow(ConflictError);

      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { companyId: "empresa1", username: "rafael" },
      });
    });

    it("não deve lançar erro se o username for único", async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null);

      await expect(
        validator.validateUniqueUserName("empresa1", "rafael")
      ).resolves.toBeUndefined();
    });
  });

  describe("validateUniqueEmail", () => {
    it("deve lançar erro se o e-mail já estiver em uso", async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce({ id: "123" });

      await expect(
        validator.validateUniqueEmail("empresa1", "teste@email.com")
      ).rejects.toThrow(ConflictError);

      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { companyId: "empresa1", email: "teste@email.com" },
      });
    });

    it("não deve lançar erro se o e-mail for único", async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null);

      await expect(
        validator.validateUniqueEmail("empresa1", "teste@email.com")
      ).resolves.toBeUndefined();
    });
  });

describe("validateUserBelongsToCompanyOrFail", () => {
    it("deve retornar o usuário se ele pertencer à empresa", async () => {
      const mockUser = {
        id: userId,
        companyId,
        email: "teste@email.com",
        fullName: "Usuário Teste",
        username: "testuser",
        isActive: true,
        role: "SELLER",
        createdAt: new Date(),
      };

      mockPrisma.user.findFirst.mockResolvedValueOnce(mockUser);

      const result = await validator.validateUserBelongsToCompanyOrFail(userId, companyId);

      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: userId, companyId },
      });

      expect(result).toEqual(mockUser);
    });

    it("deve lançar NotFoundError se o usuário não pertencer à empresa", async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce(null);

      await expect(
        validator.validateUserBelongsToCompanyOrFail(userId, companyId)
      ).rejects.toThrow(NotFoundError);

      expect(mockPrisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: userId, companyId },
      });
    });
  });
});
