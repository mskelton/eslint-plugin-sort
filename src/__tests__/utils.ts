export function validFixture(fixture: string) {
  const { input } = require(`../__fixtures__/${fixture}`)
  return { code: input }
}

export function invalidFixture(fixture: string, ...errors: string[]) {
  const { input, output } = require(`../__fixtures__/${fixture}`)
  return { code: input, errors, output }
}
