-- Remover colunas de progresso duplicadas (agora centralizadas em user_lesson_progress)

-- lessons
ALTER TABLE lessons DROP COLUMN is_completed;

-- units
ALTER TABLE units
  DROP COLUMN is_completed,
  DROP COLUMN progress;

-- courses
ALTER TABLE courses
  DROP COLUMN is_completed,
  DROP COLUMN progress;
