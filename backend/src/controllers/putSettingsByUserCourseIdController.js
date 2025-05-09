import { updateSettingsByUserCourseId } from "../services/putSettingsByUserCourseIdService.js";

export const updateSettingsByUserCourseIdController = async (req, res) => {
  const { userCourseId } = req.params;
  const newConfig = req.body;

  try {
    const updated = await updateSettingsByUserCourseId(userCourseId, newConfig);
    res.json(updated);
  } catch (error) {
    console.error("Erro ao atualizar configurações:", error);
    res.status(500).json({ message: "Erro ao atualizar configurações." });
  }
};
