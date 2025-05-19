import path from "path";
const fs = await import("fs/promises");

import {
  getSpaceSettings,
  updateSpaceSettings,
} from "../services/editorConfig.service.js";

import {
  getCourseData,
  updateCourseData,
} from "../services/editorConfig.service.js";

// Prefixo de rota estática
const URL_PREFIX = "/api/";

// Adiciona o prefixo /api/ nos campos de imagem
function withBaseUploadPath(settings) {
  return Object.fromEntries(
    Object.entries(settings).map(([key, value]) => {
      if (typeof value === "string" && value.startsWith("uploads/")) {
        return [key, URL_PREFIX + value];
      }
      return [key, value];
    })
  );
}

// Remove /api/ antes de salvar no banco
function stripUploadPrefix(settings) {
  return Object.fromEntries(
    Object.entries(settings).map(([key, value]) => {
      if (
        typeof value === "string" &&
        value.startsWith(URL_PREFIX + "uploads/")
      ) {
        return [key, value.replace(URL_PREFIX, "")];
      }
      return [key, value];
    })
  );
}

export async function getSpaceConfig(req, res) {
  try {
    const rawSettings = await getSpaceSettings();
    const config = withBaseUploadPath(rawSettings);
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar configurações do espaço" });
  }
}

export async function updateSpaceConfig(req, res) {
  try {
    const cleanSettings = stripUploadPrefix(req.body);
    const result = await updateSpaceSettings(cleanSettings);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar configurações do espaço" });
  }
}

export async function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  const fileName = req.file.filename;
  const fileExt = path.extname(req.file.originalname);
  const finalName = `${fileName}${fileExt}`;

  try {
    await fs.rename(`uploads/${fileName}`, `uploads/${finalName}`);
    const url = `${URL_PREFIX}uploads/${finalName}`;
    res.json({ url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao salvar imagem" });
  }
}
//Reset
export async function resetSpaceSettings(req, res) {
  const defaultSettings = {
    page_title: "Pertencer Líderes",
    favicon_url: "uploads/app/space/1/favicon.svg",
    login_icon_url: "uploads/app/space/1/login_icon.svg",
    login_logo_url: "uploads/app/space/1/login_logo.svg",
    footer_logo_url: "uploads/app/space/1/footer_logo.svg",
    login_background_color_1: "#E4E4E4",
    login_background_color_2: "#E4E4E4",
    login_background_image_url:
      "uploads/app/space/1/login_background_image.svg",
  };

  try {
    const result = await updateSpaceSettings(defaultSettings);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao resetar configurações do espaço" });
  }
}

///Course

export async function getCourseConfig(req, res) {
  try {
    const course = await getCourseData();
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar dados do curso" });
  }
}

export async function updateCourseConfig(req, res) {
  try {
    const cleanData = stripUploadPrefix(req.body);
    const result = await updateCourseData(cleanData);
    res.json(result);
  } catch (error) {
    console.error("🔥 ERRO AO ATUALIZAR CURSO:", error);
    res.status(500).json({ error: "Erro ao atualizar dados do curso" });
  }
}

//Reset
export async function resetCourseConfig(req, res) {
  const defaultCourse = {
    title: "Curso Padrão",
    subtitle: "Subtítulo padrão do curso",
    background_color_1: "#E4E4E4",
    background_color_2: "#E4E4E4",
    background_image_url: "uploads/app/course/1/background_image.svg",
  };

  try {
    const result = await updateCourseData(defaultCourse);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao resetar configurações do curso" });
  }
}

import {
  getCourseUnits,
  updateCourseUnits,
  resetCourseUnits,
} from "../services/editorConfig.service.js";

export async function getUnits(req, res) {
  try {
    const data = await getCourseUnits();
    res.json(data);
  } catch (err) {
    console.error("Erro ao buscar unidades:", err);
    res.status(500).json({ error: "Erro ao buscar unidades" });
  }
}

export async function updateUnits(req, res) {
  try {
    const cleanUnits = req.body.map((unit) => ({
      ...unit,
      image_url: unit.image_url?.replace(/^\/api\//, "") || null,
    }));

    console.log("📥 Unidades recebidas (limpas):", cleanUnits);

    const result = await updateCourseUnits(cleanUnits);
    res.json(result);
  } catch (err) {
    console.error("Erro ao atualizar unidades:", err);
    res.status(500).json({ error: "Erro ao atualizar unidades" });
  }
}

export async function resetUnits(req, res) {
  try {
    const result = await resetCourseUnits();
    res.json(result);
  } catch (err) {
    console.error("Erro ao resetar unidades:", err);
    res.status(500).json({ error: "Erro ao resetar unidades" });
  }
}
