import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./utils/testConnection";
import { setupSwagger } from "./swagger";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middlewares/errorHandle";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.use("/api/auth", authRoutes);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("seerparaçao")
  console.log("Documentação Swagger disponível em http://localhost:3333/api-docs");
  testConnection();
});

app.use(errorHandler);


