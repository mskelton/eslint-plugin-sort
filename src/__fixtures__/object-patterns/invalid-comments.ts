export const input = `
let {
  // b
  b,
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
  // rest
  ...rest
} = {}
`;
