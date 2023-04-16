# Import Sorting (sort/imports)

🔧 The `--fix` option on the command line can automatically fix the problems
reported by this rule.

Sorts imports alphabetically and case insensitive in ascending order.

## Rule Details

Example of **incorrect** code for this rule:

```javascript
import c from "c"
import b from "b"
import a from "a"
```

Example of **correct** code for this rule:

```javascript
import a from "a"
import b from "b"
import c from "c"
```

## Options

This rule has an options object with the following defaults.

```json
{
  "sort/imports": [
    "error",
    {
      "groups": [],
      "separator": "",
      "typeOrder": "keep",
      "caseSensitive": false,
      "natural": true
    }
  ]
}
```

### Groups

By default, this rule will perform basic alphanumeric sorting but you can
greatly customize your import sorting with sort groups.This allows you to
separate common groups of imports to make it easier to scan your imports at a
glance.

There are three built-in sort groups you can use:

1. `side-effect`
   - Imports without any imported variables (e.g. `import 'index.css'`).
1. `dependency`
   - Imports which do not throw an error when calling `require.resolve`.
   - Useful for differentiating between path aliases (e.g. `components/Hello`)
     and dependencies (e.g. `react`)
1. `other`
   - Catch all sort group for any imports which did not match other sort groups.

You can also define custom regex sort groups if the built-in sort groups aren't
enough. The following configuration shows an example of using the built-in sort
groups as well as a custom regex sort group.

```json
{
  "sort/imports": [
    "warn",
    {
      "groups": [
        { "type": "side-effect", "order": 1 },
        { "regex": "\\.(png|jpg|svg)$", "order": 4 },
        { "type": "dependency", "order": 2 },
        { "type": "other", "order": 3 }
      ]
    }
  ]
}
```

This configuration would result in the following output.

```javascript
import "index.css"
import React from "react"
import { createStore } from "redux"
import c from "c"
import a from "../a"
import b from "./b"
import image1 from "my-library/static/image.svg"
import image2 from "static/image.jpg"
import image3 from "static/image.png"
```

#### Group Order

It's important to understand the difference between the order of the sort groups
in the `groups` array, and the `order` property of each sort group. When sorting
imports, this plugin will find the first sort group which the import would apply
to and then assign it an order using the `order` property. This allows you to
define a hierarchy of sort groups in descending specificity (e.g. side effect
then regex) while still having full control over the order of the sort groups in
the resulting code.

For example, the `other` sort group will match any import and thus should always
be last in the list of sort groups. However, if you want to sort static asset
imports (e.g. `.png` or `.jpg`) after the `other` sort group, you can use the
`order` property to give the static assets a higher order than the `other` sort
group.

The configuration example above shows how this works where the static asset
imports are the second sort group even though they have the highest order and
are thus the last sort group in the resulting code.

### Separator

You can customize the separator between sort groups using the `separator`
option. By default, there is no separator but you can specify one or more
newlines between sort groups.

```json
{
  "sort/imports": [
    "warn",
    {
      "groups": [
        { "type": "side-effect", "order": 1 },
        { "regex": "\\.(png|jpg|svg)$", "order": 4 },
        { "type": "dependency", "order": 2 },
        { "type": "other", "order": 3 }
      ],
      "separator": "\n"
    }
  ]
}
```

This configuration would result in the following output.

```javascript
import "index.css"

import React from "react"
import { createStore } from "redux"
import c from "c"

import a from "../a"
import b from "./b"

import image1 from "my-library/static/image.svg"
import image2 from "static/image.jpg"
import image3 from "static/image.png"
```

Note that the separator only applies if you have defined sort groups.
Additionally, extra newlines between imports in the _same sort group_ will be
removed.

### `typeOrder`

When using `import type` in TypeScript files, type imports and regular imports
may be two separate import statements. By default, the order of these statements
is preserved, but you can customize this behavior.

Examples of **incorrect** code with `"typeOrder": "first"`:

```typescript
import { foo } from "a"
import type { Foo } from "a"
```

Examples of **correct** code with `"typeOrder": "first"`:

```typescript
import type { Foo } from "a"
import { foo } from "a"
```

Examples of **incorrect** code with `"typeOrder": "last"`:

```typescript
import type { Foo } from "a"
import { foo } from "a"
```

Examples of **correct** code with `"typeOrder": "last"`:

```typescript
import { foo } from "a"
import type { Foo } from "a"
```

_Note: This option only applies after other sorting logic. So if you separate
all type imports into their own section using the `"type"` sort group, this
option will not have any impact._

### `caseSensitive`

If `true`, enforce imports to be in case-sensitive order.

### `natural`

If `true`, enforce imports to be in natural order. Natural order compares
strings containing combination of letters and numbers in the way a human being
would sort. For example, `a-10` would come after `a-3` when using natural
ordering.

## When Not To Use It

This rule is a formatting preference and not following it won't negatively
affect the quality of your code. If alphabetizing imports isn't a part of your
coding standards, then you can leave this rule off.
