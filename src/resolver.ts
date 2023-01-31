import resolve from "isomorphic-resolve"

export function isResolved(source: string) {
  try {
    resolve(source)
    return true
  } catch (e) {
    return false
  }
}
