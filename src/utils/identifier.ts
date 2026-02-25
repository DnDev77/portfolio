export function generateBasicId() {
  return Math.random().toString(36).slice(2, 9)
}