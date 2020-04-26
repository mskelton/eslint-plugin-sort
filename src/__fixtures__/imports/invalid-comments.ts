export const input = `
// Start comment isn't moved
import c from "c"
// b
import b from "b"
// a
import a from "a"
`

export const output = `
// Start comment isn't moved
// a
import a from "a"
// b
import b from "b"
import c from "c"
`
