import { completeLesson } from "../services/completeLessonService.js";

export const completeLessonController = async (req, res) => {
  const { lessonId } = req.params;
  const { userId } = req.body;

  try {
    const result = await completeLesson(userId, lessonId);
    res.json(result);
  } catch (error) {
    console.error("Erro ao marcar lição como concluída:", error);
    res.status(500).json({ message: "Erro ao marcar lição como concluída." });
  }
};
