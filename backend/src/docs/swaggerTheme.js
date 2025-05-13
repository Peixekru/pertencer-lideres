import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import fs from "fs";

// utils
import { getRootPath } from "../utils/getRootPath.js";

export const theme = {
  DARK: SwaggerThemeNameEnum.DARK,
  LIGHT: SwaggerThemeNameEnum.LIGHT,
  MONOKAI: SwaggerThemeNameEnum.MONOKAI,
  FEELING_BLUE: SwaggerThemeNameEnum.FEELING_BLUE,
  FLATTOP: SwaggerThemeNameEnum.FLATTOP,
  MATERIAL: SwaggerThemeNameEnum.MATERIAL,
  MUTED: SwaggerThemeNameEnum.MUTED,
  NEWSPAPER: SwaggerThemeNameEnum.NEWSPAPER,
  OUTLINE: SwaggerThemeNameEnum.OUTLINE,
};

export const getSwaggerTheme = (themeName) => {
  // Caminho do CSS customizado com o logo
  const customLogoCssPath = getRootPath("./src/docs/swagger-logo.css");
  // Lê o conteúdo do arquivo CSS
  const customLogoCss = fs.existsSync(customLogoCssPath)
    ? fs.readFileSync(customLogoCssPath, "utf8")
    : "";
  // Cria uma instância do SwaggerTheme
  const theme = new SwaggerTheme();
  const options = {
    customCss: theme.getBuffer(themeName) + "\n" + customLogoCss,
    explorer: true,
  };
  console.log("Custom Logo CSS:", customLogoCss.substring(0, 100)); // mostra só os primeiros 100 chars

  return options;
};
