import type { MappedLesson } from './mapLessonsWithLockState'

/**
 * Resolve a próxima lição desbloqueada a partir da lição atual, aplicando o modo de navegação.
 *
 * Regras:
 * - A lista de lições deve estar ordenada por `index` (via `mapLessonsWithLockState`)
 * - Retorna a próxima lição desbloqueada (`isLocked: false`)
 * - Se o modo for `'restricted'`, só retorna a próxima lição se for da mesma unidade
 * - Se nenhuma próxima lição atender aos critérios, retorna `null`
 *
 * Modos de navegação:
 * - 'continuous': navega para a próxima lição desbloqueada, mesmo que de outra unidade
 * - 'restricted': restringe a navegação à unidade atual
 *
 * @param lessons Lista de lições mapeadas com status e bloqueio
 * @param currentLessonId ID da lição atual
 * @param mode Modo de navegação entre lições ('continuous' ou 'restricted')
 * @returns A próxima lição válida ou `null` se não houver
 */

export function resolveNextLessonFromMapped(
  lessons: MappedLesson[],
  currentLessonId: number,
  mode: 'continuous' | 'restricted' = 'continuous',
): MappedLesson | null {
  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId)
  if (currentIndex === -1) return null

  const next = lessons[currentIndex + 1]
  if (!next || next.isLocked) return null

  if (mode === 'restricted') {
    const currentUnitId = lessons[currentIndex].unit_id
    const nextUnitId = next.unit_id
    if (currentUnitId !== nextUnitId) return null
  }

  return next
}
