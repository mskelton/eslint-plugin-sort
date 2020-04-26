export const input = `
import c from "a.png"
import h from "../b"
import b from "dependency-c"
import d from "b.jpg"
import a from "dependency-b"
import i from "./b"
`

export const output = `
import a from "dependency-b"
import b from "dependency-c"
/* separator */import c from "a.png"
import d from "b.jpg"
/* separator */import h from "../b"
import i from "./b"
`
