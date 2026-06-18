const swaggerJsdoc = require("swagger-jsdoc")

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "HireFlow API",
      version: "1.0.0",
      description: `
        Production-grade Job Board Platform REST API.

        ## Roles
        - **candidate** — Apply for jobs, upload resume, save jobs
        - **employer** — Post jobs, view applicants, update status
        - **admin** — Full access + analytics

        ## Authentication
        Login to get access token.
        Click Authorize and enter: Bearer YOUR_TOKEN
      `,
      contact: {
        name: "Vikas Sharma",
        url: "https://github.com/Viks2202"
      }
    },
    servers: [
      {
        url: "https://hireflow-api.onrender.com/api/v1",
        description: "Production"
      },
      {
        url: "http://localhost:9000/api/v1",
        description: "Development"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ["./src/routes/*.js"]
}

module.exports = swaggerJsdoc(options)