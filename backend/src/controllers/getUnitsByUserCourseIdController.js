import { getUnitsByUserCourseId } from "../services/getUnitsByUserCourseIdService.js";

export const getUnitsByUserCourseIdController = async (req, res) => {
  const { userCourseId } = req.params;

  try {
    const units = await getUnitsByUserCourseId(userCourseId);
    res.json(units);
  } catch (error) {
    console.error("Erro ao buscar unidades:", error);
    res.status(500).json({ message: "Erro ao buscar unidades." });
  }
};
