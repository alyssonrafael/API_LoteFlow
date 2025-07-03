import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export async function testConnection() {
  try {
    console.log("Tentando conectar ao banco de dados...");
    await prisma.$connect();
    console.log("Conexão estabelecida com sucesso!");
  } catch (err) {
    console.error("Falha ao conectar ao banco de dados.");

    if (err instanceof Prisma.PrismaClientInitializationError) {
      console.error("O banco de dados está offline ou inacessível.");
    } else if (err instanceof Prisma.PrismaClientRustPanicError) {
      console.error("O Prisma enfrentou um erro interno inesperado.");
    } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(`Erro conhecido do Prisma: ${err.message}`);
    } else {
      console.error("Erro desconhecido:", err);
    }
  } finally {
    await prisma.$disconnect();
    console.log("Desconectado do banco. Teste concluído.");
  }
}
