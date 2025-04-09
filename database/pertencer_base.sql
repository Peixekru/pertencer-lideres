-- SELECIONA O BANCO
USE pertencer_db;

-- TABELAS

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    refresh_token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_login (login)
);

CREATE TABLE spaces (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE spaces_settings (
    id INT NOT NULL AUTO_INCREMENT,
    space_id INT NOT NULL,
    settings JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (space_id) REFERENCES spaces (id)
);

CREATE TABLE courses (
    id INT NOT NULL AUTO_INCREMENT,
    space_id INT NOT NULL,
    template_course_id INT NULL,
    title VARCHAR(256) NOT NULL,
    subtitle TEXT NOT NULL,
    is_template TINYINT(1) DEFAULT 0,
    version VARCHAR(20) DEFAULT '1.0.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (space_id) REFERENCES spaces (id),
    FOREIGN KEY (template_course_id) REFERENCES courses (id)
);

CREATE TABLE units (
    id INT NOT NULL AUTO_INCREMENT,
    course_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    progress INT NOT NULL,
    order_index INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (course_id) REFERENCES courses (id)
);

CREATE TABLE lessons (
    id INT NOT NULL AUTO_INCREMENT,
    unit_id INT NOT NULL,
    title VARCHAR(255),
    duration INT,
    image_url TEXT,
    content_url TEXT,
    rating INT,
    is_completed TINYINT(1),
    order_index INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (unit_id) REFERENCES units (id)
);

CREATE TABLE user_courses (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    course_id INT NOT NULL,
    current_version VARCHAR(20) DEFAULT '1.0.0',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (course_id) REFERENCES courses (id)
);

CREATE TABLE user_course_gallery (
    id INT NOT NULL AUTO_INCREMENT,
    user_course_id INT NOT NULL,
    thumb_url TEXT,
    image_url TEXT,
    is_public TINYINT(1),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_course_id) REFERENCES user_courses (id)
);

CREATE TABLE user_course_time_capsule (
    id INT NOT NULL AUTO_INCREMENT,
    user_course_id INT NOT NULL,
    status TINYINT(1),
    start_date TIMESTAMP,
    send_date DATE,
    email VARCHAR(255),
    style INT,
    message TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_course_id) REFERENCES user_courses (id)
);

CREATE TABLE user_course_accessibility (
    id INT NOT NULL AUTO_INCREMENT,
    user_course_id INT NOT NULL,
    settings JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_course_id) REFERENCES user_courses (id)
);

CREATE TABLE user_course_badges (
    id INT NOT NULL AUTO_INCREMENT,
    user_course_id INT NOT NULL,
    config JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_course_id) REFERENCES user_courses (id)
);

CREATE TABLE user_course_settings (
    id INT NOT NULL AUTO_INCREMENT,
    user_course_id INT NOT NULL,
    settings JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_course_id) REFERENCES user_courses (id)
);

CREATE TABLE user_course_widgets (
    id INT NOT NULL AUTO_INCREMENT,
    user_course_id INT NOT NULL,
    config JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_course_id) REFERENCES user_courses (id)
);

CREATE TABLE user_spaces (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    space_id INT NOT NULL,
    role VARCHAR(45) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (space_id) REFERENCES spaces (id)
);

CREATE TABLE space_role_course_templates (
    id INT NOT NULL AUTO_INCREMENT,
    space_id INT NOT NULL,
    role VARCHAR(45) NOT NULL,
    course_template_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (space_id) REFERENCES spaces (id),
    FOREIGN KEY (course_template_id) REFERENCES courses (id)
);

-- ÍNDICES

CREATE INDEX idx_user_id_courses ON user_courses (user_id);

CREATE INDEX idx_course_id_courses ON user_courses (course_id);

CREATE INDEX idx_course_id ON units (course_id);

CREATE INDEX idx_unit_id ON lessons (unit_id);

CREATE INDEX idx_user_course_id ON user_course_gallery (user_course_id);

CREATE INDEX idx_user_course_id_capsule ON user_course_time_capsule (user_course_id);

CREATE INDEX idx_user_course_id_accessibility ON user_course_accessibility (user_course_id);

CREATE INDEX idx_user_course_id_badges ON user_course_badges (user_course_id);

CREATE INDEX idx_user_course_id_widgets ON user_course_widgets (user_course_id);

CREATE INDEX idx_user_course_id_settings ON user_course_settings (user_course_id);

CREATE INDEX idx_space_role ON space_role_course_templates (space_id, role);