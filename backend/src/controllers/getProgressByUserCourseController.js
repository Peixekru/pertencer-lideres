import { getProgressByUserCourse } from "../services/getProgressByUserCourseService.js";

export const getProgressByUserCourseController = async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const progress = await getProgressByUserCourse(userId, courseId);
    res.json(progress);
  } catch (error) {
    console.error("Erro ao buscar progresso:", error);
    res.status(500).json({ message: "Erro ao buscar progresso." });
  }
};
