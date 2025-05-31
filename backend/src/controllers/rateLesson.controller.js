import pool from "../config/database.js";

export const rateLessonController = async (req, res) => {
  const { lessonId } = req.params;
  const { rating } = req.body;

  // Validação da nota
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating deve ser entre 1 e 5." });
  }

  try {
    const [result] = await pool.execute(
      `UPDATE lessons SET rating = ? WHERE id = ?`,
      [rating, lessonId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Lição não encontrada." });
    }

    res.json({ message: "Avaliação registrada com sucesso." });
  } catch (error) {
    console.error("Erro ao avaliar lição:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};
