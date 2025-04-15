import { cloneCourse } from './helpers/cloneCourse.js';
import { cloneUnits } from './helpers/cloneUnits.js';
import { cloneUserCourse } from './helpers/cloneUserCourse.js';
import { cloneGallery } from './helpers/cloneGallery.js';
import { cloneWidgets } from './helpers/cloneWidgets.js';
import { cloneBadges } from './helpers/cloneBadges.js';
import { cloneSettings } from './helpers/cloneSettings.js';
import { cloneAccessibility } from './helpers/cloneAccessibility.js';
import { cloneTimeCapsule } from './helpers/cloneTimeCapsule.js';
import { cloneAiChat } from './helpers/cloneAIChat.js';

export const cloneCourseHierarchy = async (conn, templateCourseId, userId, spaceId) => {
  try {
    // Step 1: Clone course
    const { newCourseId, templateCourse } = await cloneCourse(conn, templateCourseId, spaceId);

    // Step 2: Clone units and lessons
    await cloneUnits(conn, templateCourseId, newCourseId);

    // Step 3: Create user course relationship
    const newUserCourseId = await cloneUserCourse(conn, userId, newCourseId, templateCourse.version);

    // Step 4: Get template user course ID (if exists)
    const [[templateUserCourse]] = await conn.query(
      'SELECT id FROM user_courses WHERE course_id = ? ORDER BY id ASC LIMIT 1',
      [templateCourseId]
    );
    const sourceTemplateUserCourseId = templateUserCourse?.id;

    // Clone additional components if template exists
    if (sourceTemplateUserCourseId) {
      await Promise.all([
        cloneGallery(conn, sourceTemplateUserCourseId, newUserCourseId),
        cloneWidgets(conn, sourceTemplateUserCourseId, newUserCourseId),
        cloneBadges(conn, sourceTemplateUserCourseId, newUserCourseId),
        cloneSettings(conn, sourceTemplateUserCourseId, newUserCourseId),
        cloneAccessibility(conn, sourceTemplateUserCourseId, newUserCourseId),
        cloneTimeCapsule(conn, sourceTemplateUserCourseId, newUserCourseId),
        cloneAiChat(conn, sourceTemplateUserCourseId, newUserCourseId)
      ]);
    }

    return newUserCourseId;
  } catch (error) {
    console.error("Erro durante a execução de cloneCourseHierarchy:", error);
    throw error;
  }
};