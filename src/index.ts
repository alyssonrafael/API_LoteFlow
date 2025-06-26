import express from "express";
import dotenv from "dotenv";
import { testConnection } from "./config/testConnection";
import { setupSwagger } from "./swagger";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("seerparaçao")
  console.log("Documentação Swagger disponível em http://localhost:3333/api-docs");
  testConnection();
});


