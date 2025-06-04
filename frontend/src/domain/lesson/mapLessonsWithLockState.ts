import { useLessonStore } from '@/store/lesson'

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
  image_url?: string
  duration?: string
}

export function mapLessonsWithLockState(lessons: Lesson[]): MappedLesson[] {
  const sortedLessons = [...lessons].sort((a, b) => a.order_index - b.order_index)
  const lessonStore = useLessonStore()

  return sortedLessons.map((lesson, index, all) => {
    const previous = all[index - 1]
    const isLocked = index > 0 && !previous?.is_completed

    // Enriquecimento com dados completos da lição (ex: imagem e duração).
    // Se a lição não estiver carregada na store, usamos um objeto vazio para evitar erro de acesso em campos opcionais.
    const raw = lessonStore.getLessonById(lesson.id)
    const fullLesson: Partial<Lesson> & { image_url?: string; duration?: string } = raw || {}

    return {
      id: lesson.id,
      title: lesson.title,
      index: fullLesson?.order_index ?? lesson.order_index, // garante consistência
      completed: lesson.is_completed,
      rating: fullLesson?.rating ?? lesson.rating, // se tiver rating mais atualizado
      isLocked,
      unit_id: lesson.unit_id ?? fullLesson?.unit_id,
      image_url: fullLesson?.image_url,
      duration: fullLesson?.duration,
    }
  })
}
