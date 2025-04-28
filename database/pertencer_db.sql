-- -------------------------------------------------------------
-- TablePlus 6.2.1(578)
--
-- https://tableplus.com/
--
-- Database: pertencer_db
-- Generation Time: 2025-04-21 12:24:49.1510
-- -------------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */
;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */
;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */
;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */
;

CREATE TABLE `courses` (
    `id` int NOT NULL AUTO_INCREMENT,
    `space_id` int NOT NULL,
    `template_course_id` int DEFAULT NULL,
    `in_app_tutorial` json DEFAULT NULL,
    `is_completed` tinyint(1) DEFAULT '0',
    `progress` int DEFAULT '0',
    `title` varchar(256) NOT NULL,
    `subtitle` text NOT NULL,
    `background_color_1` varchar(7) DEFAULT NULL,
    `background_color_2` varchar(7) DEFAULT NULL,
    `background_image_url` varchar(2083) DEFAULT NULL,
    `is_template` tinyint(1) DEFAULT '0',
    `version` varchar(20) DEFAULT '1.0.0',
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `space_id` (`space_id`),
    KEY `template_course_id` (`template_course_id`),
    CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`),
    CONSTRAINT `courses_ibfk_2` FOREIGN KEY (`template_course_id`) REFERENCES `courses` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `lessons` (
    `id` int NOT NULL AUTO_INCREMENT,
    `unit_id` int NOT NULL,
    `ai_review` json DEFAULT NULL,
    `active_badge` int DEFAULT NULL,
    `is_completed` tinyint(1) DEFAULT '0',
    `title` varchar(255) DEFAULT NULL,
    `duration` int DEFAULT NULL,
    `image_url` varchar(2083) DEFAULT NULL,
    `content_type` varchar(50) DEFAULT NULL,
    `content_url` text,
    `rating` int DEFAULT NULL,
    `order_index` int DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_unit_id` (`unit_id`),
    CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 41 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `space_role_course_templates` (
    `id` int NOT NULL AUTO_INCREMENT,
    `space_id` int NOT NULL,
    `role` varchar(45) NOT NULL,
    `course_template_id` int NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `course_template_id` (`course_template_id`),
    KEY `idx_space_role` (`space_id`, `role`),
    CONSTRAINT `space_role_course_templates_ibfk_1` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`),
    CONSTRAINT `space_role_course_templates_ibfk_2` FOREIGN KEY (`course_template_id`) REFERENCES `courses` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `spaces` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `spaces_settings` (
    `id` int NOT NULL AUTO_INCREMENT,
    `space_id` int NOT NULL,
    `settings` json NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `space_id` (`space_id`),
    CONSTRAINT `spaces_settings_ibfk_1` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `units` (
    `id` int NOT NULL AUTO_INCREMENT,
    `course_id` int NOT NULL,
    `ai_review` json DEFAULT NULL,
    `is_completed` tinyint(1) DEFAULT '0',
    `progress` int DEFAULT '0',
    `title` varchar(255) NOT NULL,
    `image_url` varchar(2083) DEFAULT NULL,
    `order_index` int DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_course_id` (`course_id`),
    CONSTRAINT `units_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `user_course_accessibility` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_course_id` int NOT NULL,
    `config` json DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_template` tinyint(1) DEFAULT '0',
    `template_user_course_id` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_course_id_accessibility` (`user_course_id`),
    CONSTRAINT `user_course_accessibility_ibfk_1` FOREIGN KEY (`user_course_id`) REFERENCES `user_courses` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `user_course_ai_chat` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_course_id` int NOT NULL,
    `welcome_message` text,
    `avatar_image_url` varchar(2083) DEFAULT NULL,
    `prompt_instructions` text,
    `ai_model_name` varchar(100) DEFAULT NULL,
    `is_template` tinyint(1) NOT NULL DEFAULT '0',
    `template_user_course_id` int DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_chat_user_course_id` (`user_course_id`),
    KEY `idx_chat_template_origin` (`template_user_course_id`),
    CONSTRAINT `fk_chat_template_user_course` FOREIGN KEY (`template_user_course_id`) REFERENCES `user_courses` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_chat_user_course` FOREIGN KEY (`user_course_id`) REFERENCES `user_courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `user_course_badges` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_course_id` int NOT NULL,
    `config` json DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_template` tinyint(1) DEFAULT '0',
    `template_user_course_id` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_course_id_badges` (`user_course_id`),
    CONSTRAINT `user_course_badges_ibfk_1` FOREIGN KEY (`user_course_id`) REFERENCES `user_courses` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `user_course_gallery` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_course_id` int NOT NULL,
    `thumb_url` text,
    `image_url` text,
    `is_public` tinyint(1) DEFAULT NULL,
    `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    `template_user_course_id` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_course_id` (`user_course_id`),
    CONSTRAINT `user_course_gallery_ibfk_1` FOREIGN KEY (`user_course_id`) REFERENCES `user_courses` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `user_course_settings` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_course_id` int NOT NULL,
    `config` json DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_template` tinyint(1) DEFAULT '0',
    `template_user_course_id` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_course_id_settings` (`user_course_id`),
    CONSTRAINT `user_course_settings_ibfk_1` FOREIGN KEY (`user_course_id`) REFERENCES `user_courses` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `user_course_time_capsule` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_course_id` int NOT NULL,
    `start_date` timestamp NULL DEFAULT NULL,
    `send_date` date DEFAULT NULL,
    `email_adress` varchar(255) DEFAULT NULL,
    `style` int DEFAULT NULL,
    `message` text,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_template` tinyint(1) DEFAULT '0',
    `template_user_course_id` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_course_id_capsule` (`user_course_id`),
    CONSTRAINT `user_course_time_capsule_ibfk_1` FOREIGN KEY (`user_course_id`) REFERENCES `user_courses` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `user_course_widgets` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_course_id` int NOT NULL,
    `config` json DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `is_template` tinyint(1) DEFAULT '0',
    `template_user_course_id` int DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_user_course_id_widgets` (`user_course_id`),
    KEY `fk_template_user_course` (`template_user_course_id`),
    CONSTRAINT `fk_template_user_course` FOREIGN KEY (`template_user_course_id`) REFERENCES `user_courses` (`id`),
    CONSTRAINT `user_course_widgets_ibfk_1` FOREIGN KEY (`user_course_id`) REFERENCES `user_courses` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `user_courses` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `course_id` int NOT NULL,
    `current_version` varchar(20) DEFAULT '1.0.0',
    `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `idx_user_id_courses` (`user_id`),
    KEY `idx_course_id_courses` (`course_id`),
    CONSTRAINT `user_courses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `user_courses_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `user_spaces` (
    `id` int NOT NULL AUTO_INCREMENT,
    `user_id` int NOT NULL,
    `space_id` int NOT NULL,
    `role` varchar(45) NOT NULL,
    `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `space_id` (`space_id`),
    CONSTRAINT `user_spaces_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    CONSTRAINT `user_spaces_ibfk_2` FOREIGN KEY (`space_id`) REFERENCES `spaces` (`id`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
    `id` int NOT NULL AUTO_INCREMENT,
    `login` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `refresh_token` text NOT NULL,
    `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_login` (`login`)
) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO
    `courses` (
        `id`,
        `space_id`,
        `template_course_id`,
        `in_app_tutorial`,
        `is_completed`,
        `progress`,
        `title`,
        `subtitle`,
        `background_color_1`,
        `background_color_2`,
        `background_image_url`,
        `is_template`,
        `version`,
        `created_at`,
        `updated_at`
    )
VALUES (
        1,
        1,
        NULL,
        '{\"step\": 0, \"content_url\": \"https://player.vimeo.com/video/885694978?h=5edeeed7c0&amp;badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479&autoplay=1\", \"content_type\": \"vimeo\", \"background_url\": \"uploads/app/course/1/bg.mp4\", \"background_type\": \"video\", \"avatar_lg_img_url\": \"uploads/app/course/1/avatar_lg.png\", \"avatar_sm_img_url\": \"uploads/app/course/1/avatar_sm.png\"}',
        0,
        0,
        'Onboarding do Novos Líderes',
        'Programa de integração e socialização dos novos líderes.',
        '#E4E4E4',
        '#E4E4E4',
        'uploads/app/course/1/bg.png',
        1,
        '1',
        NULL,
        NULL
    );

INSERT INTO
    `lessons` (
        `id`,
        `unit_id`,
        `ai_review`,
        `active_badge`,
        `is_completed`,
        `title`,
        `duration`,
        `image_url`,
        `content_type`,
        `content_url`,
        `rating`,
        `order_index`,
        `created_at`,
        `updated_at`
    )
VALUES (
        1,
        1,
        NULL,
        NULL,
        0,
        '01 Lesson ipsum dolor sit amet',
        1,
        'uploads/app/course/1/un_1/le_1/cover.png',
        'video',
        'uploads/app/course/1/un_1/le_1/video.mp4',
        0,
        1,
        NULL,
        NULL
    ),
    (
        2,
        1,
        NULL,
        NULL,
        0,
        '02 Lesson ipsum dolor sit amet',
        2,
        'uploads/app/course/1/un_1/le_2/cover.png',
        'vimeo',
        'https://player.vimeo.com/video/885694978?h=5edeeed7c0&amp;badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479&autoplay=1',
        0,
        2,
        NULL,
        NULL
    ),
    (
        3,
        1,
        NULL,
        NULL,
        0,
        '03 Lesson ipsum dolor sit amet',
        3,
        'uploads/app/course/1/un_1/le_3/cover.png',
        'rise',
        'uploads/app/course/1/un_1/l2_3/index.html',
        0,
        3,
        NULL,
        NULL
    ),
    (
        4,
        1,
        NULL,
        NULL,
        0,
        '04 Lesson ipsum dolor sit amet',
        4,
        'uploads/app/course/1/un_1/le_4/cover.png',
        'storyline',
        'uploads/app/course/1/un_1/le_4/index.html',
        0,
        4,
        NULL,
        NULL
    ),
    (
        5,
        1,
        '{\"ai_interact\": {\"chat_text\": \"Percebi que você ainda tem alguma dificuldade neste tema! Este conteúdo é muito importante para você conseguir lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus nibh id velit commodo, at malesuada ipsum fermentum. Cras consequat, mauris ac malesuada tincidunt, elit massa pretium est, bibendum ultricies tellus libero sit amet arcu. Por isso, preparei um plano de ação. Se dedique estudando estes materiais e veja o resultado acontecer!\", \"review_list\": [{\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"01 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"03 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"04 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"05 Lesson ipsum dolor sit amet\"}]}}',
        NULL,
        0,
        '05 Lesson ipsum dolor sit amet',
        5,
        'uploads/app/course/1/un_1/le_5/cover.png',
        'video',
        'uploads/app/course/1/un_1/le_5/video.mp4',
        0,
        5,
        NULL,
        NULL
    ),
    (
        6,
        2,
        NULL,
        NULL,
        0,
        '01 Lesson ipsum dolor sit amet',
        1,
        'uploads/app/course/1/un_2/le_1/cover.png',
        'vimeo',
        'https://player.vimeo.com/video/885694978?h=5edeeed7c0&amp;badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479&autoplay=1',
        0,
        6,
        NULL,
        NULL
    ),
    (
        7,
        2,
        NULL,
        NULL,
        0,
        '02 Lesson ipsum dolor sit amet',
        2,
        'uploads/app/course/1/un_2/le_2/cover.png',
        'rise',
        'uploads/app/course/1/un_2/le_2/index.html',
        0,
        7,
        NULL,
        NULL
    ),
    (
        8,
        2,
        NULL,
        NULL,
        0,
        '03 Lesson ipsum dolor sit amet',
        3,
        'uploads/app/course/1/un_2/le_3/cover.png',
        'storyline',
        'uploads/app/course/1/un_2/le_3/index.html',
        0,
        8,
        NULL,
        NULL
    ),
    (
        9,
        2,
        NULL,
        NULL,
        0,
        '04 Lesson ipsum dolor sit amet',
        4,
        'uploads/app/course/1/un_2/le_4/cover.png',
        'video',
        'uploads/app/course/1/un_2/le_4/video.mp4',
        0,
        9,
        NULL,
        NULL
    ),
    (
        10,
        2,
        NULL,
        1,
        0,
        '05 Lesson ipsum dolor sit amet',
        5,
        'uploads/app/course/1/un_2/le_5/cover.png',
        'vimeo',
        'https://player.vimeo.com/video/885694978?h=5edeeed7c0&amp;badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479&autoplay=1',
        0,
        10,
        NULL,
        NULL
    ),
    (
        11,
        3,
        NULL,
        NULL,
        0,
        '01 Lesson ipsum dolor sit amet',
        1,
        'uploads/app/course/1/un_3/le_1/cover.png',
        'rise',
        'uploads/app/course/1/un_3/le_1/index.html',
        0,
        11,
        NULL,
        NULL
    ),
    (
        12,
        3,
        NULL,
        NULL,
        0,
        '02 Lesson ipsum dolor sit amet',
        2,
        'uploads/app/course/1/un_3/le_2/cover.png',
        'storyline',
        'uploads/app/course/1/un_3/le_2/index.html',
        0,
        12,
        NULL,
        NULL
    ),
    (
        13,
        3,
        NULL,
        NULL,
        0,
        '03 Lesson ipsum dolor sit amet',
        3,
        'uploads/app/course/1/un_3/le_3/cover.png',
        'video',
        'uploads/app/course/1/un_3/le_3/video.mp4',
        0,
        13,
        NULL,
        NULL
    ),
    (
        14,
        3,
        NULL,
        NULL,
        0,
        '04 Lesson ipsum dolor sit amet',
        4,
        'uploads/app/course/1/un_3/le_4/cover.png',
        'vimeo',
        'https://player.vimeo.com/video/885694978?h=5edeeed7c0&amp;badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479&autoplay=1',
        0,
        14,
        NULL,
        NULL
    ),
    (
        15,
        3,
        '{\"ai_interact\": {\"chat_text\": \"Percebi que você ainda tem alguma dificuldade neste tema! Este conteúdo é muito importante para você conseguir lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus nibh id velit commodo, at malesuada ipsum fermentum. Cras consequat, mauris ac malesuada tincidunt, elit massa pretium est, bibendum ultricies tellus libero sit amet arcu. Por isso, preparei um plano de ação. Se dedique estudando estes materiais e veja o resultado acontecer!\", \"review_list\": [{\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"01 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"03 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"04 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"05 Lesson ipsum dolor sit amet\"}]}}',
        NULL,
        0,
        '05 Lesson ipsum dolor sit amet',
        5,
        'uploads/app/course/1/un_3/le_5/cover.png',
        'rise',
        'uploads/app/course/1/un_3/le_5/index.html',
        0,
        15,
        NULL,
        NULL
    ),
    (
        16,
        4,
        NULL,
        NULL,
        0,
        '01 Lesson ipsum dolor sit amet',
        1,
        'uploads/app/course/1/un_4/le_1/cover.png',
        'storyline',
        'uploads/app/course/1/un_4/le_1/index.html',
        0,
        16,
        NULL,
        NULL
    ),
    (
        17,
        4,
        NULL,
        NULL,
        0,
        '02 Lesson ipsum dolor sit amet',
        2,
        'uploads/app/course/1/un_4/le_2/cover.png',
        'video',
        'uploads/app/course/1/un_4/le_2/video.mp4',
        0,
        17,
        NULL,
        NULL
    ),
    (
        18,
        4,
        NULL,
        NULL,
        0,
        '03 Lesson ipsum dolor sit amet',
        3,
        'uploads/app/course/1/un_4/le_3/cover.png',
        'vimeo',
        'https://player.vimeo.com/video/885694978?h=5edeeed7c0&amp;badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479&autoplay=1',
        0,
        18,
        NULL,
        NULL
    ),
    (
        19,
        4,
        NULL,
        NULL,
        0,
        '04 Lesson ipsum dolor sit amet',
        4,
        'uploads/app/course/1/un_4/le_4/cover.png',
        'rise',
        'uploads/app/course/1/un_4/le_4/index.html',
        0,
        19,
        NULL,
        NULL
    ),
    (
        20,
        4,
        NULL,
        2,
        0,
        '05 Lesson ipsum dolor sit amet',
        5,
        'uploads/app/course/1/un_4/le_5/cover.png',
        'storyline',
        'uploads/app/course/1/un_4/le_5/index.html',
        0,
        20,
        NULL,
        NULL
    ),
    (
        21,
        5,
        NULL,
        NULL,
        0,
        '01 Lesson ipsum dolor sit amet',
        1,
        'uploads/app/course/1/un_5/le_1/cover.png',
        'video',
        'uploads/app/course/1/un_5/le_1/video.mp4',
        0,
        21,
        NULL,
        NULL
    ),
    (
        22,
        5,
        NULL,
        NULL,
        0,
        '02 Lesson ipsum dolor sit amet',
        2,
        'uploads/app/course/1/un_5/le_2/cover.png',
        'vimeo',
        'https://player.vimeo.com/video/885694978?h=5edeeed7c0&amp;badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479&autoplay=1',
        0,
        22,
        NULL,
        NULL
    ),
    (
        23,
        5,
        NULL,
        NULL,
        0,
        '03 Lesson ipsum dolor sit amet',
        3,
        'uploads/app/course/1/un_5/le_3/cover.png',
        'rise',
        'uploads/app/course/1/un_5/le_3/index.html',
        0,
        23,
        NULL,
        NULL
    ),
    (
        24,
        5,
        NULL,
        NULL,
        0,
        '04 Lesson ipsum dolor sit amet',
        4,
        'uploads/app/course/1/un_5/le_4/cover.png',
        'storyline',
        'uploads/app/course/1/un_5/le_4/index.html',
        0,
        24,
        NULL,
        NULL
    ),
    (
        25,
        5,
        '{\"ai_interact\": {\"chat_text\": \"Percebi que você ainda tem alguma dificuldade neste tema! Este conteúdo é muito importante para você conseguir lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus nibh id velit commodo, at malesuada ipsum fermentum. Cras consequat, mauris ac malesuada tincidunt, elit massa pretium est, bibendum ultricies tellus libero sit amet arcu. Por isso, preparei um plano de ação. Se dedique estudando estes materiais e veja o resultado acontecer!\", \"review_list\": [{\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"01 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"03 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"04 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"05 Lesson ipsum dolor sit amet\"}]}}',
        NULL,
        0,
        '05 Lesson ipsum dolor sit amet',
        5,
        'uploads/app/course/1/un_5/le_5/cover.png',
        'video',
        'uploads/app/course/1/un_5/le_5/video.mp4',
        0,
        25,
        NULL,
        NULL
    ),
    (
        26,
        6,
        NULL,
        NULL,
        0,
        '01 Lesson ipsum dolor sit amet',
        1,
        'uploads/app/course/1/un_6/le_1/cover.png',
        'vimeo',
        'https://player.vimeo.com/video/885694978?h=5edeeed7c0&amp;badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479&autoplay=1',
        0,
        26,
        NULL,
        NULL
    ),
    (
        27,
        6,
        NULL,
        NULL,
        0,
        '02 Lesson ipsum dolor sit amet',
        2,
        'uploads/app/course/1/un_6/le_2/cover.png',
        'rise',
        'uploads/app/course/1/un_6/le_2/index.html',
        0,
        27,
        NULL,
        NULL
    ),
    (
        28,
        6,
        NULL,
        NULL,
        0,
        '03 Lesson ipsum dolor sit amet',
        3,
        'uploads/app/course/1/un_6/le_3/cover.png',
        'storyline',
        'uploads/app/course/1/un_6/le_3/index.html',
        0,
        28,
        NULL,
        NULL
    ),
    (
        29,
        6,
        NULL,
        NULL,
        0,
        '04 Lesson ipsum dolor sit amet',
        4,
        'uploads/app/course/1/un_6/le_4/cover.png',
        'video',
        'uploads/app/course/1/un_6/le_4/video.mp4',
        0,
        29,
        NULL,
        NULL
    ),
    (
        30,
        6,
        NULL,
        3,
        0,
        '05 Lesson ipsum dolor sit amet',
        5,
        'uploads/app/course/1/un_6/le_5/cover.png',
        'vimeo',
        'https://player.vimeo.com/video/885694978?h=5edeeed7c0&amp;badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479&autoplay=1',
        0,
        30,
        NULL,
        NULL
    ),
    (
        31,
        7,
        NULL,
        NULL,
        0,
        '01 Lesson ipsum dolor sit amet',
        1,
        'uploads/app/course/1/un_7/le_1/cover.png',
        'rise',
        'uploads/app/course/1/un_7/le_1/index.html',
        0,
        31,
        NULL,
        NULL
    ),
    (
        32,
        7,
        NULL,
        NULL,
        0,
        '02 Lesson ipsum dolor sit amet',
        2,
        'uploads/app/course/1/un_7/le_2/cover.png',
        'storyline',
        'uploads/app/course/1/un_7/le_2/index.html',
        0,
        32,
        NULL,
        NULL
    ),
    (
        33,
        7,
        NULL,
        NULL,
        0,
        '03 Lesson ipsum dolor sit amet',
        3,
        'uploads/app/course/1/un_7/le_3/cover.png',
        'video',
        'uploads/app/course/1/un_7/le_3/video.mp4',
        0,
        33,
        NULL,
        NULL
    ),
    (
        34,
        7,
        NULL,
        NULL,
        0,
        '04 Lesson ipsum dolor sit amet',
        4,
        'uploads/app/course/1/un_7/le_4/cover.png',
        'vimeo',
        'https://player.vimeo.com/video/885694978?h=5edeeed7c0&amp;badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479&autoplay=1',
        0,
        34,
        NULL,
        NULL
    ),
    (
        35,
        7,
        '{\"ai_interact\": {\"chat_text\": \"Percebi que você ainda tem alguma dificuldade neste tema! Este conteúdo é muito importante para você conseguir lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tempus nibh id velit commodo, at malesuada ipsum fermentum. Cras consequat, mauris ac malesuada tincidunt, elit massa pretium est, bibendum ultricies tellus libero sit amet arcu. Por isso, preparei um plano de ação. Se dedique estudando estes materiais e veja o resultado acontecer!\", \"review_list\": [{\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"01 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"03 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"04 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"05 Lesson ipsum dolor sit amet\"}]}}',
        NULL,
        0,
        '05 Lesson ipsum dolor sit amet',
        5,
        'uploads/app/course/1/un_7/le_5/cover.png',
        'rise',
        'uploads/app/course/1/un_7/le_5/index.html',
        0,
        35,
        NULL,
        NULL
    ),
    (
        36,
        8,
        NULL,
        NULL,
        0,
        '01 Lesson ipsum dolor sit amet',
        1,
        'uploads/app/course/1/un_8/le_1/cover.png',
        'storyline',
        'uploads/app/course/1/un_8/le_1/index.html',
        0,
        36,
        NULL,
        NULL
    ),
    (
        37,
        8,
        NULL,
        NULL,
        0,
        '02 Lesson ipsum dolor sit amet',
        2,
        'uploads/app/course/1/un_8/le_2/cover.png',
        'video',
        'uploads/app/course/1/un_8/le_2/video.mp4',
        0,
        37,
        NULL,
        NULL
    ),
    (
        38,
        8,
        NULL,
        NULL,
        0,
        '03 Lesson ipsum dolor sit amet',
        3,
        'uploads/app/course/1/un_8/le_3/cover.png',
        'vimeo',
        'https://player.vimeo.com/video/885694978?h=5edeeed7c0&amp;badge=0&amp;autopause=0&amp;quality_selector=1&amp;player_id=0&amp;app_id=58479&autoplay=1',
        0,
        38,
        NULL,
        NULL
    ),
    (
        39,
        8,
        NULL,
        NULL,
        0,
        '04 Lesson ipsum dolor sit amet',
        4,
        'uploads/app/course/1/un_8/le_4/cover.png',
        'rize',
        'uploads/app/course/1/un_8/le_4/index.html',
        0,
        39,
        NULL,
        NULL
    ),
    (
        40,
        8,
        NULL,
        4,
        0,
        '05 Lesson ipsum dolor sit amet',
        5,
        'uploads/app/course/1/un_8/le_5/cover.png',
        'storyline',
        'uploads/app/course/1/un_8/le_5/index.html',
        0,
        40,
        NULL,
        NULL
    );

INSERT INTO
    `space_role_course_templates` (
        `id`,
        `space_id`,
        `role`,
        `course_template_id`,
        `created_at`
    )
VALUES (
        1,
        1,
        'admin',
        1,
        '2025-04-21 07:38:19'
    ),
    (
        2,
        1,
        'manager',
        1,
        '2025-04-21 07:47:41'
    ),
    (
        3,
        1,
        'suport',
        1,
        '2025-04-21 07:48:22'
    ),
    (
        4,
        1,
        'user',
        1,
        '2025-04-21 07:48:51'
    );

INSERT INTO
    `spaces` (
        `id`,
        `name`,
        `created_at`,
        `updated_at`
    )
VALUES (
        1,
        'pertencer_lideres',
        '2025-04-21 04:35:47',
        '2025-04-21 04:45:01'
    );

INSERT INTO
    `spaces_settings` (
        `id`,
        `space_id`,
        `settings`,
        `created_at`,
        `updated_at`
    )
VALUES (
        1,
        1,
        '{\"login_icon_url\": \"uploads/app/space/1/login_icon.svg\", \"login_logo_url\": \"uploads/app/space/1/login_logo.svg\", \"footer_logo_url\": \"uploads/app/space/1/footer_logo.svg\", \"login_background_color_1\": \"#E4E4E4\", \"login_background_color_2\": \"#E4E4E4\", \"login_background_image_url\": \"uploads/app/space/1/login_background_image.png\"}',
        '2025-04-21 08:13:28',
        '2025-04-21 09:02:04'
    );

INSERT INTO
    `units` (
        `id`,
        `course_id`,
        `ai_review`,
        `is_completed`,
        `progress`,
        `title`,
        `image_url`,
        `order_index`,
        `created_at`,
        `updated_at`
    )
VALUES (
        1,
        1,
        '{\"ai_interact\": {\"chat_text\": \"Analisando suas respostas, percebi que você ainda pode ter alguma oportunidade de melhoria em alguns temas.\", \"review_list\": [{\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"01 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"03 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"04 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"05 Lesson ipsum dolor sit amet\"}]}}',
        0,
        0,
        '01 Lorem ipsum dolor sit amet',
        'uploads/app/course/1/un_1/cover.png',
        1,
        NULL,
        NULL
    ),
    (
        2,
        1,
        '{\"ai_interact\": {\"chat_text\": \"Analisando suas respostas, percebi que você ainda pode ter alguma oportunidade de melhoria em alguns temas.\", \"review_list\": [{\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"01 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"03 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"04 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"05 Lesson ipsum dolor sit amet\"}]}}',
        0,
        0,
        '02 Lorem ipsum dolor sit amet',
        'uploads/app/course/1/un_2/cover.png',
        2,
        NULL,
        NULL
    ),
    (
        3,
        1,
        '{\"ai_interact\": {\"chat_text\": \"Analisando suas respostas, percebi que você ainda pode ter alguma oportunidade de melhoria em alguns temas.\", \"review_list\": [{\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"01 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"03 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"04 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"05 Lesson ipsum dolor sit amet\"}]}}',
        0,
        0,
        '03 Lorem ipsum dolor sit amet',
        'uploads/app/course/1/un_3/cover.png',
        3,
        NULL,
        NULL
    ),
    (
        4,
        1,
        '{\"ai_interact\": {\"chat_text\": \"Analisando suas respostas, percebi que você ainda pode ter alguma oportunidade de melhoria em alguns temas.\", \"review_list\": [{\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"01 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"03 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"04 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"05 Lesson ipsum dolor sit amet\"}]}}',
        0,
        0,
        '04 Lorem ipsum dolor sit amet',
        'uploads/app/course/1/un_4/cover.png',
        4,
        NULL,
        NULL
    ),
    (
        5,
        1,
        '{\"ai_interact\": {\"chat_text\": \"Analisando suas respostas, percebi que você ainda pode ter alguma oportunidade de melhoria em alguns temas.\", \"review_list\": [{\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"01 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"03 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"04 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"05 Lesson ipsum dolor sit amet\"}]}}',
        0,
        0,
        '05 Lorem ipsum dolor sit amet',
        'uploads/app/course/1/un_5/cover.png',
        5,
        NULL,
        NULL
    ),
    (
        6,
        1,
        '{\"ai_interact\": {\"chat_text\": \"Analisando suas respostas, percebi que você ainda pode ter alguma oportunidade de melhoria em alguns temas.\", \"review_list\": [{\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"01 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"03 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"04 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"05 Lesson ipsum dolor sit amet\"}]}}',
        0,
        0,
        '06 Lorem ipsum dolor sit amet',
        'uploads/app/course/1/un_6/cover.png',
        6,
        NULL,
        NULL
    ),
    (
        7,
        1,
        '{\"ai_interact\": {\"chat_text\": \"Analisando suas respostas, percebi que você ainda pode ter alguma oportunidade de melhoria em alguns temas.\", \"review_list\": [{\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"01 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"03 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"04 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"05 Lesson ipsum dolor sit amet\"}]}}',
        0,
        0,
        '07 Lorem ipsum dolor sit amet',
        'uploads/app/course/1/un_7/cover.png',
        7,
        NULL,
        NULL
    ),
    (
        8,
        1,
        '{\"ai_interact\": {\"chat_text\": \"Analisando suas respostas, percebi que você ainda pode ter alguma oportunidade de melhoria em alguns temas.\", \"review_list\": [{\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"01 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"03 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"04 Lesson ipsum dolor sit amet\"}, {\"url\": \"/user-courses/:userCourseId/courses/:courseId/lessons/:lessonId\", \"title\": \"05 Lesson ipsum dolor sit amet\"}]}}',
        0,
        0,
        '08 Lorem ipsum dolor sit amet',
        'uploads/app/course/1/un_8/cover.png',
        8,
        NULL,
        NULL
    );

INSERT INTO
    `user_course_accessibility` (
        `id`,
        `user_course_id`,
        `config`,
        `updated_at`,
        `is_template`,
        `template_user_course_id`
    )
VALUES (
        1,
        1,
        '{\"adhd\": \"0\", \"contrast\": \"0\", \"dyslexia\": \"0\", \"epilepsy\": \"0\", \"fontSize\": \"1\", \"lowVision\": \"0\", \"zoomLevel\": \"0\", \"colorTheme\": \"0\", \"lineHeight\": \"1\", \"readingFocus\": \"0\", \"readingGuide\": \"0\", \"textToSpeech\": \"0\", \"linkHighlight\": \"0\", \"animationBlock\": \"0\", \"colorBlindness\": \"0\", \"motorImpairments\": \"0\", \"cursorEnhancement\": \"0\", \"keyboardNavigation\": \"0\"}',
        NULL,
        1,
        NULL
    );

INSERT INTO
    `user_course_ai_chat` (
        `id`,
        `user_course_id`,
        `welcome_message`,
        `avatar_image_url`,
        `prompt_instructions`,
        `ai_model_name`,
        `is_template`,
        `template_user_course_id`,
        `created_at`,
        `updated_at`
    )
VALUES (
        1,
        1,
        'Olá, Fulano. Estou aqui para ajudar com dúvidas relacionadas aos temas abordados na plataforma. Lembre-se, minha especialidade é focada nesses assuntos específicos!',
        'uploads/app/course/1/ai_chat/avatar_image.svg',
        NULL,
        NULL,
        1,
        NULL,
        NULL,
        NULL
    );

INSERT INTO
    `user_course_badges` (
        `id`,
        `user_course_id`,
        `config`,
        `updated_at`,
        `is_template`,
        `template_user_course_id`
    )
VALUES (
        1,
        1,
        '{\"badge_1\": {\"is_done\": 0, \"badge_icon_1_url\": \"uploads/app/course/1/badges/badge_icon_1.svg\"}, \"badge_2\": {\"is_done\": 0, \"badge_icon_2_url\": \"uploads/app/course/1/badges/badge_icon_2.svg\"}, \"badge_3\": {\"is_done\": 0, \"badge_icon_3_url\": \"uploads/app/course/1/badges/badge_icon_3.svg\"}, \"badge_4\": {\"is_done\": 0, \"badge_icon_4_url\": \"uploads/app/course/1/badges/badge_icon_4.svg\"}}',
        NULL,
        1,
        NULL
    );

INSERT INTO
    `user_course_gallery` (
        `id`,
        `user_course_id`,
        `thumb_url`,
        `image_url`,
        `is_public`,
        `uploaded_at`,
        `template_user_course_id`
    )
VALUES (
        1,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL
    );

INSERT INTO
    `user_course_settings` (
        `id`,
        `user_course_id`,
        `config`,
        `updated_at`,
        `is_template`,
        `template_user_course_id`
    )
VALUES (
        1,
        1,
        '{\"colorThemes\": {\"dark\": {\"info\": \"#62C9CE\", \"accent\": \"#2B7080\", \"primary\": \"#5BC6E8\", \"surface\": \"#1b1b1e\", \"secondary\": \"#004F81\"}, \"light\": {\"info\": \"#62C9CE\", \"accent\": \"#2B7080\", \"primary\": \"#1B1F45\", \"surface\": \"#F4F4F4\", \"secondary\": \"#5BC6E8\"}, \"dark_mono\": {\"info\": \"#616161\", \"error\": \"#333333\", \"accent\": \"#3c3c3c\", \"primary\": \"#d1d1d1\", \"success\": \"#2f2f2f\", \"surface\": \"#212121\", \"warning\": \"#666666\", \"secondary\": \"#434343\", \"background\": \"#000000\"}, \"light_mono\": {\"info\": \"#9a9a9a\", \"error\": \"#333333\", \"accent\": \"#575757\", \"primary\": \"#2f2f2f\", \"success\": \"#2f2f2f\", \"surface\": \"#F4F4F4\", \"warning\": \"#666666\", \"secondary\": \"#a3a3a3\", \"background\": \"#bdbdbd\"}}, \"header_icons\": {\"exit_icon_url\": \"uploads/app/space/1/exit_icon.svg\", \"info_icon_url\": \"uploads/app/space/1/info_icon.svg\", \"access_icon_url\": \"uploads/app/space/1/access_icon.svg\"}, \"header_logo_url\": \"uploads/app/space/1/header_logo.svg\", \"header_image_url\": \"uploads/app/space/1/header_image.png\"}',
        NULL,
        1,
        NULL
    );

INSERT INTO
    `user_course_time_capsule` (
        `id`,
        `user_course_id`,
        `start_date`,
        `send_date`,
        `email_adress`,
        `style`,
        `message`,
        `updated_at`,
        `is_template`,
        `template_user_course_id`
    )
VALUES (
        1,
        1,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        NULL,
        1,
        NULL
    );

INSERT INTO
    `user_course_widgets` (
        `id`,
        `user_course_id`,
        `config`,
        `updated_at`,
        `is_template`,
        `template_user_course_id`
    )
VALUES (
        1,
        1,
        '{\"widget_1\": {\"title\": \"Dashboard\", \"is_enabled\": 0, \"widget_icon_1_url\": \"uploads/app/course/1/widget/widget_icon_1.svg\"}, \"widget_2\": {\"title\": \"Tira-dúvidas\", \"is_enabled\": 0, \"widget_icon_2_url\": \"uploads/app/course/1/widget/widget_icon_2.svg\"}, \"widget_3\": {\"title\": \"Compartilhe sua conquista!\", \"is_enabled\": 0, \"widget_icon_3_url\": \"uploads/app/course/1/widget/widget_icon_3.svg\"}}',
        '2025-04-21 10:23:35',
        1,
        NULL
    );

INSERT INTO
    `user_courses` (
        `id`,
        `user_id`,
        `course_id`,
        `current_version`,
        `joined_at`
    )
VALUES (
        1,
        1,
        1,
        '1',
        '2025-04-21 08:26:58'
    );

INSERT INTO
    `user_spaces` (
        `id`,
        `user_id`,
        `space_id`,
        `role`,
        `joined_at`
    )
VALUES (
        1,
        1,
        1,
        'admin',
        '2025-04-21 04:44:20'
    );

INSERT INTO
    `users` (
        `id`,
        `login`,
        `password`,
        `refresh_token`,
        `created_at`
    )
VALUES (
        1,
        'admin',
        '$2b$10$bxS4AFdUCfpYInwnh0xUZe9crfiCRodqkyOUtfXi0ZiWgPCiYavPy',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzQ1MjQyOTM3LCJleHAiOjE3NDU4NDc3Mzd9.tPixzTf7hvRUomQAGfO9Tc0vmQOgm4nJBCIjtlP-RSA',
        NULL
    );

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */
;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */
;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */
;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */
;