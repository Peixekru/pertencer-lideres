import fs from "fs";
import path from "path";
import { getRootPath } from "../utils/getRootPath.js";
import pool from "../config/database.js";

export const patchLessonContent = async (req, res) => {
  const lessonId = req.params.id;

  // 1. Busca a lição no banco de dados
  const [rows] = await pool.execute("SELECT * FROM lessons WHERE id = ?", [
    lessonId,
  ]);
  const lesson = rows[0];

  if (!lesson || !lesson.content_url) {
    return res.status(404).send("Licao nao encontrada ou sem conteudo");
  }

  // 2. Determina o diret�rio base da lição a partir do content_url
  const lessonPath = getRootPath(lesson.content_url);
  const lessonDir = path.dirname(lessonPath);

  // 3. Localiza o index.html
  const indexPath = findIndexHtml(lessonDir);
  if (!indexPath) {
    return res.status(404).send("index.html nao encontrado");
  }

  // 4. L� o HTML original
  let html = fs.readFileSync(indexPath, "utf8");

  // 5. Substitui o trecho LMSProxyFuncs original
  html = html.replace(
    /var LMSProxyFuncs\s*=\s*pick\([\s\S]*?Function\.prototype\s*\);?/,
    `var LMSProxyFuncs = {};
LMSProxySelections.forEach(function (name) {
  LMSProxyFuncs[name] = function () {
    return null;
  };
});`
  );

  // 6. Salva o HTML modificado de volta no disco
  fs.writeFileSync(indexPath, html, "utf8");

  // 7. Retorna mensagem de sucesso
  res.send(`index.html da licao ${lessonId} modificado com sucesso.`);
};

function findIndexHtml(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      const result = findIndexHtml(fullPath);
      if (result) return result;
    } else if (file.name.toLowerCase() === "index.html") {
      return fullPath;
    }
  }
  return null;
}
