import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API PROJETO LOTEAMENTO",
      version: "1.0.0",
      description:
        "API com rotas para aplicação da gestao de loteamento de forma eficiente.",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    servers: [
      {
        url: "http://localhost:3333/api",
        description: "Servidor local",
      },
    ],
  },
apis: ["./src/**/*.routes.ts"]
};

export const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: any) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
