export function validFixture(fixture: string, options: unknown = []) {
  const { input } = require(`../__fixtures__/${fixture}`)
  return { code: input, options }
}

export function invalidFixture(
  fixture: string,
  errors: string[],
  options: unknown = []
) {
  const { input, output } = require(`../__fixtures__/${fixture}`)
  return { code: input, errors, output, options }
}
