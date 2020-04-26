export const input = `
var a = {
  // d
  d: 2,
  // c
  c: 1,
  ...spread1,
  e: 3,
  // spread 2
  ...spread2,
  b: 5,
  a: 4
}
`

export const output = `
var a = {
  // c
  c: 1,
  // d
  d: 2,
  ...spread1,
  e: 3,
  // spread 2
  ...spread2,
  a: 4,
  b: 5
}
`
