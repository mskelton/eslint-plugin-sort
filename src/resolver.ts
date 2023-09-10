import resolve from "isomorphic-resolve"

const resolveCache = new Map<string, boolean>()

export function isResolved(source: string) {
  if (globalThis.resolver) {
    return globalThis.resolver(source)
  }

  if (resolveCache.has(source)) {
    return resolveCache.get(source)
  }

  try {
    resolve(source)
    resolveCache.set(source, true)
    return true
  } catch (e) {
    resolveCache.set(source, false)
    return false
  }
}
