// Importa os helpers de clonagem a partir do barrel (index.js)
import {
  cloneCourse,
  cloneUnits,
  cloneLessons,
  cloneUserCourse,
  cloneGallery,
  cloneWidgets,
  cloneBadges,
  cloneSettings,
  cloneAccessibility,
  cloneTimeCapsule,
  cloneAiChat
} from './index.js';

// Função principal que orquestra todo o processo de clonagem de um curso
export const cloneCourseHierarchy = async (conn, templateCourseId, userId, spaceId) => {
  try {
    // PASSO 1: Clona os dados básicos do curso (título, subtítulo, versão)
    const { newCourseId, templateCourse } = await cloneCourse(conn, templateCourseId, spaceId);

    // PASSO 2: Clona as unidades
    const unitIdMap = await cloneUnits(conn, templateCourseId, newCourseId);

    // PASSO 2: Clona as lições
    await cloneLessons(conn, unitIdMap);

    // PASSO 3: Cria o vínculo entre usuário e curso clonado
    const newUserCourseId = await cloneUserCourse(conn, userId, newCourseId, templateCourse.version);

    // PASSO 4: Verifica se existe um curso template para clonar componentes adicionais
    const [[templateUserCourse]] = await conn.query(
      'SELECT id FROM user_courses WHERE course_id = ? ORDER BY id ASC LIMIT 1',
      [templateCourseId]
    );
    const sourceTemplateUserCourseId = templateUserCourse?.id;

    // Se existir um template, clona todos os componentes extras em paralelo
    if (sourceTemplateUserCourseId) {
      await Promise.all([
        cloneGallery(conn, sourceTemplateUserCourseId, newUserCourseId),        // Galeria de imagens
        cloneWidgets(conn, sourceTemplateUserCourseId, newUserCourseId),        // Widgets
        cloneBadges(conn, sourceTemplateUserCourseId, newUserCourseId),         // Badges
        cloneSettings(conn, sourceTemplateUserCourseId, newUserCourseId),       // Configurações
        cloneAccessibility(conn, sourceTemplateUserCourseId, newUserCourseId),  // Acessibilidade
        cloneTimeCapsule(conn, sourceTemplateUserCourseId, newUserCourseId),    // Cápsula do tempo
        cloneAiChat(conn, sourceTemplateUserCourseId, newUserCourseId)          // Chat com IA
      ]);
    }

    // Retorna o ID do novo curso do usuário
    return newUserCourseId;
  } catch (error) {
    // Tratamento de erros - loga e propaga o erro
    console.error("Erro durante a execução de cloneCourseHierarchy:", error);
    throw error;
  }
};