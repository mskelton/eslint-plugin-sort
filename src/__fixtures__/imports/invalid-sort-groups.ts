export const input = `
import c from "b.jpg"
import a from "external-c"
import f from "./b"
import b from "a.png"
import e from "../b"
import d from "a"
import 'side-effect'
`

export const output = `
import 'side-effect'

import a from "external-c"

import b from "a.png"
import c from "b.jpg"

import d from "a"

import e from "../b"
import f from "./b"
`
