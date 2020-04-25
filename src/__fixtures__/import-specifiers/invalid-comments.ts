export const input = `
import {
  c,
  // b
  b,
  // a
  a
} from 'a'
`

export const output = `
import {
  // a
  a,
  // b
  b,
  c
} from 'a'
`
