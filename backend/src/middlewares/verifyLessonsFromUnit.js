import fs from "fs/promises";
import path from "path";
import pool from "../config/database.js";
import { getRootPath } from "../utils/getRootPath.js";
import { patchRise } from "../utils/patchRise.js";
import { patchStoryline } from "../utils/patchStoryline.js";

export async function verifyLessonsFromUnit(req, res, next) {
  const unitId = req.params.unitId;
  if (!unitId) return next(); // Se não tiver unidade, segue sem fazer nada

  try {
    // Busca todas as lições associadas à unidade
    const [rows] = await pool.execute(
      "SELECT * FROM lessons WHERE unit_id = ?",
      [unitId]
    );

    // Gera um timestamp fixo para ser usado em todas as lições dessa execução
    const timestamp = new Date().toISOString();
    const patchMarker = `<!-- PATCH_APPLIED_BY_BACKEND_${timestamp} -->`;

    for (const lesson of rows) {
      if (!lesson.content_url || !lesson.content_type) continue;

      // Normaliza o content_url para garantir que termina com index.html
      const normalizedUrl =
        lesson.content_url.endsWith("/") ||
        !lesson.content_url.includes(".html")
          ? lesson.content_url +
            (lesson.content_url.endsWith("/") ? "index.html" : "/index.html")
          : lesson.content_url;

      const lessonPath = getRootPath(normalizedUrl); // Caminho absoluto do arquivo
      const dir = path.dirname(lessonPath); // Diretório base do conteúdo

      try {
        // Caso a lição seja RISE
        if (lesson.content_type === "rise") {
          if (lesson.content_url.includes("scormcontent")) continue; // Já patchado

          const targetFile = await findHtmlFile(dir, "index.html", [
            "scormcontent",
          ]);
          if (!targetFile) continue;

          let html = await fs.readFile(targetFile, "utf-8");
          if (html.includes("PATCH_APPLIED_BY_BACKEND")) continue;

          // Aplica o patch e adiciona o marcador no topo
          const fullyPatched = patchRise(html);
          const finalHtml = `${patchMarker}\n${fullyPatched}`;
          await fs.writeFile(targetFile, finalHtml, "utf-8");

          // Atualiza o content_url no banco para apontar para o novo path
          const parts = lesson.content_url.split("/");
          parts.pop();
          const newContentUrl = [...parts, "scormcontent", "index.html"].join(
            "/"
          );

          await pool.execute(
            "UPDATE lessons SET content_url = ? WHERE id = ?",
            [newContentUrl, lesson.id]
          );
        }

        // Caso a lição seja STORYLINE
        if (lesson.content_type === "storyline") {
          const indexLms = await findHtmlFile(dir, "index_lms.html");
          if (!indexLms) continue;

          const indexDir = path.dirname(indexLms);
          const indexHtml = path.join(indexDir, "index.html");

          try {
            // Remove index.html antigo se existir
            await fs.unlink(indexHtml);
          } catch {}

          let html = await fs.readFile(indexLms, "utf-8");
          if (!html.includes("PATCH_APPLIED_BY_BACKEND")) {
            // Aplica o patch e adiciona o marcador no topo
            const fullyPatched = patchStoryline(html);
            const finalHtml = `${patchMarker}\n${fullyPatched}`;
            await fs.writeFile(indexLms, finalHtml, "utf-8");
          }

          // Renomeia index_lms.html para index.html
          await fs.rename(indexLms, indexHtml);

          // Atualiza content_url no banco se estiver incompleto (sem index.html)
          if (!lesson.content_url.includes("index.html")) {
            const newContentUrl = lesson.content_url.endsWith("/")
              ? lesson.content_url + "index.html"
              : lesson.content_url + "/index.html";

            await pool.execute(
              "UPDATE lessons SET content_url = ? WHERE id = ?",
              [newContentUrl, lesson.id]
            );
          }
        }
      } catch (err) {
        console.warn(
          `[verifyLessonsFromUnit] erro na lição ${lesson.id}:`,
          err.message
        );
        continue; // Continua com a próxima lição mesmo em caso de erro
      }
    }
  } catch (err) {
    console.warn("[verifyLessonsFromUnit] erro geral:", err.message);
  } finally {
    next(); // Continua para o próximo middleware
  }
}

// Função utilitária para encontrar um arquivo HTML dentro de um diretório, com prioridade em subpastas
async function findHtmlFile(baseDir, filename, priorityDirs = []) {
  for (const dir of priorityDirs) {
    const filePath = path.join(baseDir, dir, filename);
    try {
      await fs.access(filePath);
      return filePath;
    } catch {}
  }

  const direct = path.join(baseDir, filename);
  try {
    await fs.access(direct);
    return direct;
  } catch {}

  const files = await fs.readdir(baseDir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      const filePath = path.join(baseDir, file.name, filename);
      try {
        await fs.access(filePath);
        return filePath;
      } catch {}
    }
  }

  return null; // Retorna null se o arquivo não for encontrado
}
