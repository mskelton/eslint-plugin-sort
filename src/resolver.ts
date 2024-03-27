import resolve from "isomorphic-resolve"

const resolveCache = new Map<string, boolean>()

export function isResolved(source: string) {
  // Ignore relative imports to prevent false positives where a path is
  // resolvable from the node_modules directory and elsewhere in the project.
  if (source.startsWith(".")) {
    return false
  }

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
