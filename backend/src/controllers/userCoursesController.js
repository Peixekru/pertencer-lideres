import { getUserCourses, getUserCourseFull } from '../services/userCoursesService.js';
import pool from '../config/database.js';

export const getUserCoursesController = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'userId é obrigatório' });
  }

  try {
    const courses = await getUserCourses(userId);
    res.status(200).json(courses);
  } catch (error) {
    console.error('Erro ao buscar cursos do usuário:', error);
    res.status(500).json({ message: 'Erro ao buscar cursos do usuário' });
  }
};

export const getUserCourseFullController = async (req, res) => {
  const { userCourseId } = req.params;

  try {
    const course = await getUserCourseFull(userCourseId);

    if (!course) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    // Busca os widgets associados
    const [widgets] = await pool.query(
      'SELECT id, config FROM user_course_widgets WHERE user_course_id = ?',
      [userCourseId]
    );

    course.widgets = widgets;

    res.status(200).json(course);
  } catch (error) {
    console.error('Erro ao buscar curso completo:', error);
    res.status(500).json({ message: 'Erro ao buscar curso completo' });
  }
};
