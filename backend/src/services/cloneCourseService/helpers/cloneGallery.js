export const cloneGallery = async (conn, sourceTemplateUserCourseId, newUserCourseId) => {
    const [galleryToClone] = await conn.query(
        `SELECT thumb_url, image_url, is_public
    FROM user_course_gallery
    WHERE user_course_id = ?`,
        [sourceTemplateUserCourseId]
    );

    for (const image of galleryToClone) {
        await conn.query(
            `INSERT INTO user_course_gallery (
        user_course_id, 
        thumb_url, 
        image_url, 
        is_public, 
        template_user_course_id, 
        uploaded_at
      ) VALUES (?, ?, ?, ?, ?, NOW())`,
            [
                newUserCourseId,
                image.thumb_url,
                image.image_url,
                image.is_public,
                sourceTemplateUserCourseId
            ]
        );
    }
};