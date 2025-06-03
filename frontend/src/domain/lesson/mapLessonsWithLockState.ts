/**
 * Mapeia uma lista de lições com informações de progresso, ordem e bloqueio.
 *
 * Regras de desbloqueio:
 * - A primeira lição está sempre desbloqueada (`isLocked: false`)
 * - A partir da segunda, a lição só será desbloqueada se a anterior estiver concluída
 *
 * Cada lição retornada inclui:
 * - `completed`: status de conclusão
 * - `isLocked`: se está acessível ou bloqueada
 * - `index`: ordem baseada em `order_index`
 * - `unit_id`: usado em lógica de navegação restrita
 *
 * @param lessons Lista de lições cruas vindas da unidade
 * @returns Lista de lições enriquecidas com estado de bloqueio e progresso
 */

export type Lesson = {
  id: number
  title: string
  order_index: number
  is_completed: boolean
  rating?: number
  unit_id?: number
}

export type MappedLesson = {
  id: number
  title: string
  index: number
  completed: boolean
  rating?: number
  isLocked: boolean
  unit_id?: number
}

export function mapLessonsWithLockState(lessons: Lesson[]): MappedLesson[] {
  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index)

  return sortedLessons.map((lesson, index, all) => {
    const previous = all[index - 1]
    const isLocked = index > 0 && !previous?.is_completed

    return {
      id: lesson.id,
      title: lesson.title,
      index: lesson.order_index,
      completed: lesson.is_completed,
      rating: lesson.rating,
      isLocked,
    }
  })
}
