import pool from "../config/database.js";
const SPACE_ID = 1;

export async function getSpaceSettings() {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(
      "SELECT settings FROM spaces_settings WHERE space_id = ? LIMIT 1",
      [SPACE_ID]
    );
    return rows[0]?.settings || {};
  } finally {
    db.release(); // sempre libere a conexão
  }
}

export async function updateSpaceSettings(settings) {
  const db = await pool.getConnection();
  try {
    await db.query(
      "UPDATE spaces_settings SET settings = ?, updated_at = CURRENT_TIMESTAMP WHERE space_id = ?",
      [JSON.stringify(settings), SPACE_ID]
    );
    return { success: true };
  } finally {
    db.release();
  }
}

/// Course

const COURSE_ID = 4;
const USER_COURSE_ID = 3;

export async function getCourseData() {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(
      "SELECT title, subtitle, background_color_1, background_color_2, background_image_url FROM courses WHERE id = ?",
      [COURSE_ID]
    );
    return rows[0] || {};
  } finally {
    db.release();
  }
}

export async function updateCourseData(data) {
  const db = await pool.getConnection();
  try {
    // Atualiza a tabela de cursos
    if (
      data.title ||
      data.subtitle ||
      data.background_color_1 ||
      data.background_color_2 ||
      data.background_image_url
    ) {
      await db.query(
        "UPDATE courses SET title = ?, subtitle = ?, background_color_1 = ?, background_color_2 = ?, background_image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [
          data.title ?? "",
          data.subtitle ?? "",
          data.background_color_1 ?? null,
          data.background_color_2 ?? null,
          data.background_image_url ?? null,
          COURSE_ID,
        ]
      );
    }

    // Atualiza user_course_settings com selectedThemeKey
    const [existing] = await db.query(
      "SELECT config FROM user_course_settings WHERE user_course_id = ?",
      [USER_COURSE_ID]
    );

    if (existing.length === 0) {
      await db.query(
        "INSERT INTO user_course_settings (user_course_id, config, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)",
        [
          USER_COURSE_ID,
          JSON.stringify({
            selectedThemeKey: data.selectedThemeKey ?? "light",
          }),
        ]
      );
    } else {
      const currentConfig = existing[0]?.config || {};
      const newConfig = {
        ...currentConfig,
        selectedThemeKey: data.selectedThemeKey ?? "light",
      };

      await db.query(
        "UPDATE user_course_settings SET config = ?, updated_at = CURRENT_TIMESTAMP WHERE user_course_id = ?",
        [JSON.stringify(newConfig), USER_COURSE_ID]
      );
    }

    return { success: true };
  } finally {
    db.release();
  }
}

//const COURSE_ID = 4; -> Ja foi definido no inicio do arquivo

export async function getCourseUnits() {
  const db = await pool.getConnection();
  try {
    const [rows] = await db.query(
      "SELECT id, title, image_url FROM units WHERE course_id = ? ORDER BY order_index ASC",
      [COURSE_ID]
    );
    return rows;
  } finally {
    db.release();
  }
}

export async function updateCourseUnits(units) {
  const db = await pool.getConnection();
  try {
    for (const unit of units) {
      console.log("🛠️ Banco vai salvar:", {
        id: unit.id,
        title: unit.title,
        image_url: unit.image_url,
      });

      await db.query(
        "UPDATE units SET title = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND course_id = ?",
        [unit.title ?? "", unit.image_url || null, unit.id, COURSE_ID]
      );
    }

    return { success: true };
  } finally {
    db.release();
  }
}

export async function resetCourseUnits() {
  const db = await pool.getConnection();
  try {
    for (let i = 1; i <= 8; i++) {
      await db.query(
        "UPDATE units SET title = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE course_id = ? AND order_index = ?",
        [`Unidade ${i}`, `uploads/app/course/1/un_${i}/cover.png`, COURSE_ID, i]
      );
    }
    return { success: true };
  } finally {
    db.release();
  }
}
