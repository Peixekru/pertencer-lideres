import { getSettingsByUserCourseId } from "../services/getSettingsByUserCourseIdService.js";

export const getSettingsByUserCourseIdController = async (req, res) => {
  const { userCourseId } = req.params;

  try {
    const settings = await getSettingsByUserCourseId(userCourseId);
    res.json(settings);
  } catch (error) {
    console.error("Erro ao buscar configurações:", error);
    res.status(500).json({ message: "Erro ao buscar configurações." });
  }
};
