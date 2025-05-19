import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import corsConfig from "./middlewares/corsConfigMiddleware.js";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { getSwaggerTheme, theme } from "./docs/swaggerTheme.js";
import { getRootPath } from "./utils/getRootPath.js";

// Rotas
import statusRoutes from "./routes/statusRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import spacesRoutes from "./routes/spacesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import userCoursesRoutes from "./routes/userCoursesRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";

// Inicia app
const app = express();

// Middlewares
app.use(corsConfig);
app.use(express.json());
app.use(cookieParser());

// Swagger
const swaggerDocument = YAML.load(getRootPath("src/docs/openapi.yaml"));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    ...getSwaggerTheme(theme.DARK),
    customSiteTitle: "Pertencer API Docs",
  })
);

// Rotas de API
app.use("/api", statusRoutes);
app.use("/api", authRoutes);
app.use("/api", spacesRoutes);
app.use("/api", usersRoutes);
app.use("/api", userCoursesRoutes);
app.use("/api", courseRoutes);

// Arquivos estáticos (imagens, scorm, etc.)
app.use("/api/uploads", express.static(getRootPath("uploads")));

// ----------------------------------
// SERVIR FRONTEND (apenas em produção)
// ----------------------------------
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = getRootPath("../frontend/dist");

  app.use(express.static(frontendDistPath));

  // SPA fallback: qualquer rota não-API serve o index.html
  app.get("*", (req, res, next) => {
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/uploads") ||
      req.path.startsWith("/docs")
    ) {
      return next();
    }

    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

console.log("NODE_ENV atual:", process.env.NODE_ENV);

export default app;
