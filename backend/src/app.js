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

import editorConfigRoutes from "./routes/editorConfig.routes.js";

// Inicia app
const app = express();

// Vrifica se as variáveis de ambientes foram carregadas
if (!process.env.SERVER_PORT) {
  console.warn("⚠️ Variáveis de ambiente não carregadas corretamente!");
}

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

app.use("/api/editor-config", editorConfigRoutes);

// Arquivos estáticos (imagens, scorm, etc.)
app.use("/api/uploads", express.static(getRootPath("uploads")));

// Rota de saúde (health check)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------------
// SERVIR FRONTEND (em produção ou staging)
// -----------------------------------

if (["production", "staging"].includes(process.env.NODE_ENV)) {
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

// Loga o ambiente atual
console.log(`🔧 App iniciado em ambiente: ${process.env.NODE_ENV}`);
// Loga a URL do frontend
console.log("🌐 FRONTEND_URL permitido:", process.env.FRONTEND_URL);

export default app;
