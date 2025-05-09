-- Refatoração: Remoção da tabela user_course_badge e ajuste na tabela lessons

-- 1. Remover tabela antiga
DROP TABLE IF EXISTS user_course_badges;

-- 2. Alterar coluna active_badge para badge e mudar tipo para JSON
ALTER TABLE lessons
CHANGE active_badge badge VARCHAR(2083);
