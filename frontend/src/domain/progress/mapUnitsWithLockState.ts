import { getUrl } from '@/utils/url'
import { getPlaceholder, size } from '@/utils/placeholder'

// Tipagem
type UnitProgress = {
  id: number
  title: string
  progress: number
  completed_lessons: number
  total_lessons: number
}

type UnitData = {
  id: number
  image_url: string
}

type MappedUnit = {
  id: number
  title: string
  image: string
  progress: number
  completed: number
  total: number
  isLocked: boolean
}

/**
 * Mapeia unidades com dados de progresso e calcula o estado de bloqueio (`isLocked`).
 *
 * Esta função define a lógica de desbloqueio progressivo das unidades no curso.
 * A regra é baseada no progresso do aluno nas unidades anteriores:
 *
 * - A primeira unidade (index === 0) está sempre desbloqueada.
 * - As unidades seguintes (index > 0) só são desbloqueadas se a anterior
 *   estiver totalmente concluída.
 * - A verificação compara `completed_lessons` com `total_lessons` da unidade anterior.
 *
 * O resultado é utilizado no componente `UnitCard` para controlar a
 * exibição e o acesso interativo às unidades.
 *
 * @param units - Lista de unidades com dados de progresso por aluno
 * @param getUnitById - Função para buscar dados estáticos da unidade (ex: imagem)
 * @returns Lista de unidades enriquecidas com `image`, `completed`, `total`, `progress` e `isLocked`
 */

export function mapUnitsWithLockState(
  units: UnitProgress[],
  getUnitById: (id: number) => UnitData | undefined,
): MappedUnit[] {
  return units.map((unit, index, allUnits) => {
    // Busca os dados adicionais da unidade (ex: imagem)
    const unitData = getUnitById(unit.id)
    // Seleciona a unidade anterior, se houver
    const previous = allUnits[index - 1]
    // Regras de bloqueio de unidade:
    // - A primeira unidade (index 0) está sempre desbloqueada
    // - As demais só são desbloqueadas se a anterior estiver totalmente concluída
    const isLocked = index > 0 && previous && previous.completed_lessons < previous.total_lessons
    // Retorna um objeto
    return {
      id: unit.id,
      title: unit.title,
      image: getUrl(unitData?.image_url || '', getPlaceholder(size.branding)),
      progress: unit.progress,
      completed: unit.completed_lessons,
      total: unit.total_lessons,
      isLocked,
    }
  })
}
