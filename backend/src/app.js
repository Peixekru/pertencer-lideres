import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import corsConfig from "./middlewares/corsConfigMiddleware.js";
// Routes
import statusRoutes from "./routes/statusRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import spacesRoutes from "./routes/spacesRoutes.js";
import usersRoutes from "./routes/usersRoutes.js";
import userCoursesRoutes from "./routes/userCoursesRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
// Documentação
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { getSwaggerTheme, theme } from "./docs/swaggerTheme.js";
// utils
import { getRootPath } from "./utils/getRootPath.js";

// Inicializa o Express
const app = express();

// Middlewares
app.use(corsConfig);
app.use(express.json());
app.use(cookieParser());

// Caminho para a pasta 'dist' gerada pelo Vite
const frontendDistPath = getRootPath("../frontend/dist");

// Carregando o arquivo YAML
const swaggerDocument = YAML.load(getRootPath("src/docs/openapi.yaml"));

// Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    ...getSwaggerTheme(theme.DARK),
    customSiteTitle: "Pertencer API Docs",
    //customfavIcon: "uploads/app/space/1/favicon.svg",
  })
);

// Rotas da API
app.use("/api", statusRoutes);
app.use("/api", authRoutes);
app.use("/api", spacesRoutes);
app.use("/api", usersRoutes);
app.use("/api", userCoursesRoutes);
app.use("/api", courseRoutes);

// Servindo arquivos estáticos da pasta 'uploads'
app.use("/uploads", express.static(getRootPath("uploads")));

// Servindo os arquivos estáticos da build do Vue
app.use(express.static(frontendDistPath));

// Captura todas as outras rotas (SPA), mas ignora /api e /uploads pra não interferir nas rotas do backend
app.get("*", (req, res, next) => {
  if (
    req.path.startsWith("/api") ||
    req.path.startsWith("/uploads") ||
    req.path.startsWith("/redoc") ||
    req.path.startsWith("/docs")
  ) {
    return next();
  }

  res.sendFile(path.join(frontendDistPath, "index.html"));
});

export default app;
