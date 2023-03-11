export default function resolve(source) {
  if (!source.startsWith("dependency-")) {
    throw new Error(`Cannot resolve "${source}"`)
  }
}
