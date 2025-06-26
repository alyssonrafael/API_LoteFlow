import prisma from "../prisma";

export async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Conexão estabelecida com sucesso!");
    await prisma.$disconnect();
    console.log("Desconectado do banco. Teste concluído!");
  } catch (err) {
    console.error("Erro ao conectar ou realizar operação no banco:", err);
  }
}
