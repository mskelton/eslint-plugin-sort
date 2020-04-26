export const input = `
import c from "a.png"

import h from "../b"
import b from "external-c"
import d from "b.jpg"

import a from "external-b"
import i from "./b"
`

export const output = `
import a from "external-b"
import b from "external-c"
import c from "a.png"
import d from "b.jpg"
import h from "../b"
import i from "./b"
`
