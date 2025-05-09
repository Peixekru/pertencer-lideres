import { getLessonsByUnitId } from "../services/getLessonsByUnitIdService.js";

export const getLessonsByUnitIdController = async (req, res) => {
  const { unitId } = req.params;

  try {
    const lessons = await getLessonsByUnitId(unitId);
    res.json(lessons);
  } catch (error) {
    console.error("Erro ao buscar lições:", error);
    res.status(500).json({ message: "Erro ao buscar lições." });
  }
};
