import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Roomix API",
      version: "1.0.0",
      description: "Documentación de la API de Roomix",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },

  apis: ["./api/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);