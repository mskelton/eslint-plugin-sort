export const input = `
let {
  // b
  b,
  c,
  // a
  a,
  // rest
  ...rest
} = {}
`;

export const output = `
let {
  // a
  a,
  // b
  b,
  c,
  // rest
  ...rest
} = {}
`;
