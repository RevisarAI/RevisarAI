import initApp from "./app";
import http from "http";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

initApp().then((app) => {
  // Swagger setup for development
  if (process.env.NODE_ENV === "development") {
    const swaggerOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "ReviewsReceiver API",
          description: "This is the API for ReviewsReceiver service",
          version: "1.0.0",
        },
        servers: [{ url: "http://localhost:3000" }],
      },
      apis: ["./src/routes/*.ts", "./src/models/*.ts"],
    };
    const specs = swaggerJsDoc(swaggerOptions);
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  }

  // Start the server
  if (process.env.NODE_ENV !== "production") {
    http.createServer(app).listen(process.env.PORT);
  } else {
    console.log("production mode not supported yet");
  }
});
