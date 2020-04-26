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
import c from "a.png"
import d from "b.jpg"
import h from "../b"
import i from "./b"
`
