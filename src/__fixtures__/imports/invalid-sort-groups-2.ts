export const input = `
import b from "external-c"
import h from "../b"
import g from "c"

import i from "./b"
import f from "b"
import c from "a.png"
import 'side-effect'
import 'index.css'

import d from "b.jpg"

import a from "external-b"
import e from "a"
`

export const output = `
import a from "external-b"
import b from "external-c"

import h from "../b"
import i from "./b"
import e from "a"
import f from "b"
import g from "c"

import c from "a.png"
import d from "b.jpg"

import 'index.css'
import 'side-effect'
`
