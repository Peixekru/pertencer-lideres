import { getCourseByUserCourseId } from "../services/getCourseByUserCourseIdService.js";

export const getCourseByUserCourseIdController = async (req, res) => {
  const { userCourseId } = req.params;

  try {
    const course = await getCourseByUserCourseId(userCourseId);
    if (!course) {
      return res.status(404).json({ message: "Curso não encontrado." });
    }
    res.json(course);
  } catch (error) {
    console.error("Erro ao buscar curso:", error);
    res.status(500).json({ message: "Erro ao buscar curso." });
  }
};
