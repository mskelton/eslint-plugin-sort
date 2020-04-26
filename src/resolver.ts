export function isResolved(source: string) {
  try {
    require.resolve(source)
    return true
  } catch (e) {
    return false
  }
}
