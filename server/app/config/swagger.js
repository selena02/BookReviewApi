import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Book Review API",
      version: "1.0.0",
      description:
        "This is a Book Review API application made with Express and documented with Swagger, Admin User : Mail: admin@gmail.com  Password: Admin123@",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [path.join(__dirname, "../routes/*.js")],
};

const specs = swaggerJsdoc(options);

function swaggerDocs(app, port) {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));

  app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(specs);
  });

  console.log(`Swagger UI available at http://localhost:${port}/swagger`);
}

export default swaggerDocs;
