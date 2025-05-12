const PLACEHOLDER = 'https://placehold.co'

export const size = {
  favicon: '32x32',
  login: '300x80',
  icon: '100x100',
  footer: '250x80',
  branding: '300x120',
  Headers: '200x50',
}

export function getPlaceholder(size = '100x100', text = 'oops!') {
  return `${PLACEHOLDER}/${size}?text=${text}`
}
