import { getUserCourseFromDB } from '../services/getUserCourseService.js';

export const getUserCourse = async (req, res) => {
  const { userCourseId } = req.params;

  try {
    // Chama o serviço getUserCourseFromDB
    const course = await getUserCourseFromDB(userCourseId);

    if (!course) {
      return res.status(404).json({ message: 'Curso não encontrado' });
    }

    //console.log('Curso completo retornado pelo controller:', course);
    res.status(200).json(course); // Retorna o JSON completo

  } catch (error) {
    console.error('Erro ao buscar curso completo:', error);
    res.status(500).json({ message: 'Erro ao buscar curso completo' });
  }
};