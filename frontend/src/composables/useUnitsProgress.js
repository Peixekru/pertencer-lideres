import { getPlaceholder, size } from '@/utils/placeholder'
const API_BASE = import.meta.env.VITE_API_URL.replace('/api', '')

export function useUnitsProgress(units = [], lessonsByUnit = {}) {
  return units.map((unit, index) => {
    const unitLessons = lessonsByUnit[unit.id] || []
    const total = unitLessons.length
    const completed = unitLessons.filter((l) => l.is_completed).length

    const progress = total > 0 ? Math.round((completed / total) * 100) : 0
    const status = index === 0 || units[index - 1]?.is_completed ? 1 : 0

    const hasValidImage =
      unit.image_url && !unit.image_url.includes('undefined') && !unit.image_url.includes('null')
    const image = hasValidImage ? `${API_BASE}/${unit.image_url}` : getPlaceholder(size.icon)

    return {
      ...unit,
      image,
      total,
      progress,
      status,
    }
  })
}
