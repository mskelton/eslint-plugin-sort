import { RuleTester } from "eslint";
import rule from "../rules/sort-object-patterns";
import { invalidFixture, validFixture } from "./utils";

const messages = rule.meta!.messages! as Record<
  "unsorted" | "unsortedPattern",
  string
>;

const valid = (input: string) => ({ code: `let ${input} = {}` });

const invalid = (
  input: string,
  output: string,
  ...errors: string[]
): RuleTester.InvalidTestCase => ({
  code: `let ${input} = {}`,
  errors,
  output: `let ${output} = {}`,
});

const error = (a: string, b: string) =>
  messages.unsorted.replace("{{a}}", a).replace("{{b}}", b);

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2018,
  },
});

ruleTester.run("sort/destructured-properties", rule, {
  valid: [
    // Basic
    valid("{}"),
    valid("{a}"),
    valid("{a, b, c}"),
    valid("{_, a, b}"),
    valid("{p,q,r,s,t,u,v,w,x,y,z}"),

    // Case insensitive
    valid("{a, B, c, D}"),
    valid("{_, A, b}"),

    // Rest element
    valid("{a, b, ...c}"),
    valid("{...rest}"),

    // Comments
    validFixture("object-patterns/valid-comments"),
  ],
  invalid: [
    // Basic
    invalid(
      "{c, a, b}",
      "{a, b, c}",
      messages.unsortedPattern,
      error("a", "c")
    ),
    invalid(
      "{b, a, _}",
      "{_, a, b}",
      messages.unsortedPattern,
      error("a", "b"),
      error("_", "a")
    ),

    // Case insensitive
    invalid(
      "{b, A, _}",
      "{_, A, b}",
      messages.unsortedPattern,
      error("A", "b"),
      error("_", "A")
    ),
    invalid(
      "{D, a, c, B}",
      "{a, B, c, D}",
      messages.unsortedPattern,
      error("a", "D"),
      error("B", "c")
    ),

    // Rest element
    invalid(
      "{c, a, b, ...rest}",
      "{a, b, c, ...rest}",
      messages.unsortedPattern,
      error("a", "c")
    ),

    // All properties are sorted with a single sort
    invalid(
      "{z,y,x,w,v,u,t,s,r,q,p}",
      "{p,q,r,s,t,u,v,w,x,y,z}",
      messages.unsortedPattern,
      error("y", "z"),
      error("x", "y"),
      error("w", "x"),
      error("v", "w"),
      error("u", "v"),
      error("t", "u"),
      error("s", "t"),
      error("r", "s"),
      error("q", "r"),
      error("p", "q")
    ),

    // Comments
    invalidFixture(
      "object-patterns/invalid-comments",
      messages.unsortedPattern,
      error("a", "c")
    ),
  ],
});
