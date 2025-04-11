import { getUserCoursesFromDB } from '../services/getUserCoursesService.js';

export const getUserCourses = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'userId é obrigatório' });
  }

  try {
    const courses = await getUserCoursesFromDB(userId);
    res.status(200).json(courses);
  } catch (error) {
    console.error('Erro ao buscar cursos do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar cursos do usuário' });
  }
};