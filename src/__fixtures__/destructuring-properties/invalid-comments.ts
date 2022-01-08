export const input = `
let {
  // c
  c,
  // b
  b,
  a,
  // rest
  ...rest
} = {}
`

export const output = `
let {
  a,
  // b
  b,
  // c
  c,
  // rest
  ...rest
} = {}
`
