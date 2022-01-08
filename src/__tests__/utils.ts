export function heredoc(str: string) {
  return str
    .split("\n")
    .slice(1, -1)
    .map((val, _, arr) => {
      const length = arr[0].length - arr[0].trimStart().length
      return val.replace(" ".repeat(length), "")
    })
    .join("\n")
}
