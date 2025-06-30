import { ConflictError } from "../../../errors";
import { UserValidator } from "../../../validations";


describe("UserValidator", () => {
  const mockPrisma = {
    user: {
      findFirst: jest.fn(),
    },
  };

  const validator = new UserValidator(mockPrisma as any);

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
});
