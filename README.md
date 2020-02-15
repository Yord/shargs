![shargs teaser][teaser]

🦈 `shargs` (**sh**ell **args**) is a highly customizable and extensible command-line arguments parser.

[![node version][shield-node]][node]
[![npm version][shield-npm]][npm-package]
[![license][shield-license]][license]
[![PRs Welcome][shield-prs]][contribute]
[![linux unit tests status][shield-unit-tests-linux]][actions]
[![macos unit tests status][shield-unit-tests-macos]][actions]
[![windows unit tests status][shield-unit-tests-windows]][actions]

## Installation

Installation is done using [`npm`][npm-install].

```bash
$ npm i --save shargs
```

## Work in Progress

This project is work in progress.
Use it at your own risk!

## Features

+   **Declarative:** Describe command-line arguments using a declarative DSL and derive parsers and usage from that.
+   **Modular Parsers:** Compose your own parsers choosing from an abundance of parser functions.
+   **Predefined Parsers:** Instead of building your own, choose between many predefined parsers.
+   **Modular Usage Texts:** Build your own usage documentation by composing command-line arguments with text blocks.
+   **Predefined Usage Texts:** Instead of building your own, choose between many predefined parsers.

## Getting Started

<details>
<summary>
Describe command-line arguments:

<p>

```js
const opts = [
  string('question', ['-q', '--question'], {desc: 'A question.'}),
  number('answer', ['-a', '--answer'], {desc: 'The (default) answer.', only: [42]}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
]
```

</p>
</summary>

Shargs provides a DSL for declaring command-line arguments.
This simple example uses three different shargs type constructors:
`string`, `number`, and `flag`. All type constructors take the same arguments:

1.  *(required)* An object key used to store the parsed values.
2.  *(required)* An array of command-line arguments that users may use to define the value.
3.  *(optional)* An object holding optional keys like `desc` and `only`.

Type constructors are only syntactic sugar.
In fact, `opts` could also be written as:

```js
const opts = [
  {key: 'question', types: ['string'], args: ['-q', '--question'], desc: 'A question.'},
  {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The (default) answer.', only: [42]},
  {key: 'help', types: [], args: ['-h', '--help'], desc: 'Print this help message and exit.'}
]
```

</details>

<details>
<summary>
Declare a parser:

<p>

```js
const deepThought = parser({
  argv: [splitShortOptions],
  opts: [cast, restrictToOnly],
  args: [emptyRest]
})
```

</p>
</summary>

The parser consists of six parser functions are applied in the following order:

1.  `splitShortOptions`
2.  `toOpts` (implicit)
3.  `cast`
4.  `restrictToOnly`
5.  `toArgs` (implicit)
6.  `removeRest`

</details>

<details>
<summary>
Apply the parser:

<p>

```js
// node index.js --unknown -ha 42
const argv = ['--unknown', '-ha', '42']

const {errs, args} = deepThought(opts)({argv})
```

</p>
</summary>

To demonstrate intermediate parsing results, logging was added to `deepThought`:

```js
const log = text => obj => {
  const {argv, opts, args} = obj
  console.log(text, argv || opts || args)
  return obj
}

const deepThought = parser({
  argv: [log('A'), splitShortOptions, log('B')],
  opts: [log('C'), cast, restrictToOnly, log('D')],
  args: [log('E'), emptyRest, log('F')]
})

// node index.js --unknown -ha 42
const argv = ['--unknown', '-ha', '42']

const {errs, args} = deepThought(opts)({argv})
```

The logging output reads:

```bash
A ['--unknown', '-ha', '42']
B ['--unknown', '-h', '-a', '42']
C [
  {values: ['--unknown']},
  {key: 'help', types: [], ... values: []},
  {key: 'answer', types: ['number'], ... values: ['42']}
]
D [
  {values: ['--unknown']},
  {key: 'help', types: [], ... values: []},
  {key: 'answer', types: ['number'], ... values: [42]}
]
E {help: true, answer: 42, _: ['--unknown']}
F {help: true, answer: 42, _: []}
```

Shargs parses command-line argument values in five stages:

1.  The first stage applies functions that transform `argv` arrays into other `argv` arrays.<br />
    E.g. `splitShortOptions` transforms `A` into `B` by splitting `-ha` into `-h` and `-a`.
2.  The second stage transforms `argv` arrays into `opts` objects.<br />
    E.g. see the difference between `B` and `C`.
3.  The third stage applies functions that transform `opts` objects into other `opts` objects.<br />
    E.g. `cast` transforms `C` into `D` by casting `'42'` to the number `42`.
4.  The fourth stage transforms `opts` objects into `args` objects.<br />
    E.g. see the difference between `D` and `E`.
5.  The fifth stage applies functions that transform `args` objects into other `args` objects.<br />
    E.g. `emptyRest` transforms `E` into `F` by emptying the `'_'` key.

</details>

<details>
<summary>
Declare a usage documentation:

<p>

```js
const docs = usage([
  synopsis('deepThought'),
  space(),
  optsList(),
  space(),
  note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

</p>
</summary>

Every command-line tools benefits from a well-formatted usage documentation.
Shargs brings its own DSL for defining one that can easily be extended with user functions.
The DSL is declarative, which means it describes the desired structure without concerning itself with the details.
Try changing `optsList` to `optsDefs` later to experience of what this means:

```js
const docs = usage([
  synopsis('deepThought'),
  space(),
  optsDefs(),
  space(),
  note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

</details>

<details>
<summary>
Build the usage documentation:

<p>

```js
const style = {
  line: {width: 80},
  cols: [{width: 20}, {width: 60}]
}

const help = docs(opts)(style)
```

</p>
</summary>

Supplying `opts` and a `style` to `docs` renders a help text.
The style defines how the help is layouted.
With the current style, the following is rendered:

```bash
deepThought [-q|--question] [-a|--answer] [-h|--help]                           
                                                                                
-q, --question      A question. [string]                                        
-a, --answer        The (default) answer. [number]                              
-h, --help          Print this help message and exit. [flag]                    
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything.
```

You may experiment with `style` to get the result you like.
E.g. you may want to change the style to the following:

```js
const style = {
  line: {width: 40},
  cols: [{width: 10, padEnd: 2}, {width: 28}]
}

const help = docs(opts)(style)
```

`help` now reads:

```bash
deepThought [-q|--question]
            [-a|--answer] [-h|--help]

-q,         A question. [string]
--question
-a,         The (default) answer.
--answer    [number]
-h, --help  Print this help message and
            exit. [flag]

Deep Thought was created to come up with
the Answer to The Ultimate Question of
Life, the Universe, and Everything.
```

Note, how shargs automatically takes care of line breaks and other formatting for you.

</details>

<details>
<summary>
Use the parsed values in your program:

<p>

```js
if (args.help) {
  console.log(help)
} else {
  console.log('The answer is: ' + args.answer)
}
```

</p>
</summary>

Other command-line argument parsers handle displaying usage documentation for you.
Shargs makes the deliberate decision to leave that to the user,
thus giving him more control.

If `args` contains a `help` field, the `help` text is printed:

```bash
deepThought [-q|--question] [-a|--answer] [-h|--help]                           
                                                                                
-q, --question      A question. [string]                                        
-a, --answer        The (default) answer. [number]                              
-h, --help          Print this help message and exit. [flag]                    
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything.
```

Otherwise, the answer is printed.

</details>

## 🦈 `shargs`

Shargs is the command-line argument parser used by [`pxi`][pxi].

### Command-Line Options DSL

The most important concept in shargs is that of command-line options.
They are the basis for parsers as well as for usage documentation.
Command-line options in their plain form are expressed in shargs as follows: 

```js
const askOpts = [
  {key: 'question', types: ['string'], args: ['-q', '--question'], desc: 'A question.'},
  {key: 'help', types: [], args: ['-h', '--help'], desc: 'Print this help message and exit.'}
]
```

A command-line option is described by an object having a subset of the following fields:

| Field     | Value                                                                                  | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|-----------|----------------------------------------------------------------------------------------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `key`\*   | string                                                                                 |         | The command-line option's value is assigned to a key of this name.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `args`\*  | array of strings                                                                       |         | A list of options that may be used to set the command-line option.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `types`\* | `['string']`, `['number']`, `['bool']`, `[]`, `null`, `['string','number','bool',...]` |         | <ul><li>`['string']` takes exactly one string.</li><li>`['number']` takes exactly one number.</li><li>`['bool']` takes exactly one boolean, `true` or `false`.</li><li>`[]` takes no value. It is a flag that is `true` if used and `false` if not used.</li><li>`null` is a command. It may have its own list of arguments (see `opts`) and is terminated by either `--` or a line ending.</li><li>`['number','string','bool',...]` takes an array of any types of arbitrary length. The values are expected to be in the specified order and of the specified type.</li></ul> |
| `desc`    | string                                                                                 | `''`    | Description of the command-line option for use in the usage text.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `only`    | array of values                                                                        | `null`  | The command-line option's value can only be one of the values in this list. If `only` is `null`, the value may be set freely.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `opts`    | command-line options array                                                             | `null`  | This field is used if the command-line option is a command (if `types` is `null`) to describe the command's options.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

\* these fields are required, all others are optional

#### Functional Options DSL

Since writing out objects may get tedious, shargs offers a DSL for creating plain command-line option descriptions:

```js
const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The (default) answer.', only: [42]}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'}),
  command('ask', ['ask'], {opts: askOpts})
]
```

Each supported type has its own function, that takes `key` and `args` as arguments
as well as an object holding any optional field.
If an optional field is left out, the DSL takes care of setting a sensible default for it.

| Function                          | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `array(types)(key, args, fields)` | Assigns `types`, `key`, and `args` to `fields`.            |
| `bool(key, args, fields)`         | Assigns `types: ['bool']`, `key` and `args` to `fields`.   |
| `command(key, args, fields)`      | Assigns `types: null`, `key` and `args` to `fields`.       |
| `flag(key, args, fields)`         | Assigns `types: []`, `key` and `args` to `fields`.         |
| `number(key, args, fields)`       | Assigns `types: ['number']`, `key` and `args` to `fields`. |
| `string(key, args, fields)`       | Assigns `types: ['string']`, `key` and `args` to `fields`. |

The `array` function describes arrays with a known length and known types,
while the `command` function describes variable-length arrays.
The `opts` field is used to determine a `command`'s types.

### Command-Line Parsers DSL

A shargs command-line parser is a composition of parser functions:

```js
function deepThought (opts) {
  return pipe(
    splitShortOptions,
    toOpts(combine(...opts.map(option)).args),
    cast,
    restrictToOnly,
    toArgs(deepThought),
    emptyRest
  )
}
```

There are five stages of parser functions:

1.  `argv` functions modify arrays of command-line arguments.
2.  `toOpts` transforms `argv` arrays into the command-line option DSL and adds a `values` field.
3.  `opts` functions modify command-line options.
4.  `toArgs` transforms `opts` into an object of `key` / `values` pairs.
5.  `args` functions modify `args` objects.

Functions from different stages must be applied in the given order,
while functions from the same stage may be supplied in any order that makes sense.
The following parser functions are available:

| Stage    | Plugin                            | Description                                                                                                     |
|----------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `argv`   | `splitShortOptions({errs, argv})` | Splits argument groups of shape `-vs` to `-v -s`. Only works if the arguments are preceded by a single dash.    |
| `toOpts` | `toOpts(args)({errs, argv})`      | Transforms `argv` arrays into the command-line option DSL and adds a `values` field.                            |
| `opts`   | `cast(opts)`                      | Casts all `values` according to the options' types.                                                             |
| `opts`   | `restrictToOnly(opts)`            | Records an error if the `values` are not contained in the `only` list.                                          |
| `toArgs` | `toArgs(parser)({errs, argv})`    | Transforms `opts` into an object of `key` / `values` pairs.                                                     |
| `args`   | `emptyRest(args)`                 | Removes all entries from the `_` key.                                                                           |

#### Functional Parsers DSL

The functional parser DSL takes care of applying parser stages in the correct order under the hood.
It also passes on errors for you:

```js
const deepThought = parser({
  argv: [splitShortOptions],
  opts: [cast, restrictToOnly],
  args: [emptyRest]
})
```

When using `parser`, the only thing you have to take care of
is supplying parser functions in the desired order per stage.

### Usage Documentation

Based on the command-line options defined above, the `deepThought` tool should have the following usage documentation:

```bash
deepThought ask [-q|--question] [-h|--help]                                     
                                                                                
-q, --question      A question. [string]                                        
-h, --help          Print this help message and exit. [flag]                    
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything. 
```

Since command-line options may change, writing the documentation manually is not a good idea,
because it would mean updating changed options in two different places.
This is why shargs provides DSLs for writing usage documentation.

#### Layout Documentation DSL

The layout DSL functions are a markup language for writing text to the console.
The `deepThought` documentation could be written as follows in layout syntax:

```js
const askDocs = layout([
  text('deepThought ask [-q|--question] [-h|--help]'),
  br(),
  table([
    ['-q, --question', 'A question. [string]'],
    ['-h, --help', 'Print this help message and exit. [flag]']
  ]),
  br(),
  text(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

The layout DSL includes the following functions:

| Function                       | Description                                                                     |
|--------------------------------|---------------------------------------------------------------------------------|
| `layout(toStrings)(style)`     | Foo                                                                             |
| `br(id)(style)`                | Introduces a single blank line.                                                 |
| `brs(length, id)(style)`       | Introduces several blank lines with the number defined by the length parameter. |
| `cols(columns, id)(style)`     | Foo                                                                             |
| `defs(definitions, id)(style)` | Foo                                                                             |
| `line(string, id)(style)`      | Foo                                                                             |
| `lines(strings, id)(style)`    | Foo                                                                             |
| `table(itemsList, id)(style)`  | Foo                                                                             |
| `text(string, id)(style)`      | Foo                                                                             |
| `texts(strings, id)(style)`    | Foo                                                                             |

#### Style DSL

Note how all DSL functions take a style argument as last parameter.
The following is a minimum definition of `style` for `deepThought`:

```js
const style = {
  line: {width: 80},
  cols: [{width: 20}, {width: 60}]
}
```

It defines style objects for two ids: `line` and `cols`.
These two ids are used internally by the layout functions to decide, how lines and columns should be printed.
A style object may have the following parameters:

| Parameter  | Type   | Description                                                     |
|------------|--------|-----------------------------------------------------------------|
| `padEnd`   | number | Defines a padding to the right of a line.                       |
| `padStart` | number | Defines a padding to the left of a line.                        |
| `width`    | number | Defines the length of a line before a line break is introduced. |

While `line` and `cols` are the default ids, any valid key may be used as an id.
In order to connect leyout functions to a different id than the default, pass it as a string to the `id` parameter.

#### Usage Documentation DSL

The usage DSL extends the layout DSL by providing functions that incorporate command-line options.
Using this DSL makes defining usage documentation for command-line options very simple:

```js
const docs = usage([
  synopsis('deepThought'),
  space(),
  optsList(),
  space(),
  note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

`docs` prints exactly the same documentation text, but is declarative,
in that it defines what should be displayed, but leaves the details to how it is defined for later.
The usage DSL includes the following functions:

| Function                                            | Description |
|-----------------------------------------------------|-------------|
| `usage(toStrings)(opts)(style)`                     | Foo         |
| `note(string, id)(opts)(style)`                     | Foo         |
| `notes(strings, id)(opts)(style)`                   | Foo         |
| `optsDefs(filter, id)(opts)(style)`                 | Foo         |
| `optsList(filter, id)(opts)(style)`                 | Foo         |
| `space(id)(opts)(style)`                            | Foo         |
| `spaces(id)(opts)(style)`                           | Foo         |
| `synopsis(string, string, filter, id)(opts)(style)` | Foo         |

### Combining Options, Parser, and Usage Documentation

Foo

```js
// node index.js ask -q 'What is the answer to everything?'
const argv = ['ask', '-q', 'What is the answer to everything?']

const {errs, args} = deepThought(opts)({argv})

const help = docs(opts)(style)
const askHelp = askDocs(style)

if (args.help) {
  console.log(help)
} else if (args.ask.help) {
  console.log(askHelp)
} else {
  console.log('The answer is: ' + args.answer)
}
```

Foo

## Reporting Issues

Please report issues [in the tracker][issues]!

## Contributing

We are open to, and grateful for, any contributions made by the community.
By contributing to pixie, you agree to abide by the [code of conduct][code].
Please read the [contributing guide][contribute].

## License

`shargs` is [MIT licensed][license].

[actions]: https://github.com/Yord/shargs/actions
[code]: https://github.com/Yord/shargs/blob/master/CODE_OF_CONDUCT.md
[contribute]: https://github.com/Yord/shargs/blob/master/CONTRIBUTING.md
[issues]: https://github.com/Yord/shargs/issues
[license]: https://github.com/Yord/shargs/blob/master/LICENSE
[node]: https://nodejs.org/
[npm-install]: https://docs.npmjs.com/downloading-and-installing-packages-globally
[npm-package]: https://www.npmjs.com/package/shargs
[pxi]: https://github.com/Yord/pxi
[shield-license]: https://img.shields.io/npm/l/shargs?color=yellow&labelColor=313A42
[shield-node]: https://img.shields.io/node/v/shargs?color=red&labelColor=313A42
[shield-npm]: https://img.shields.io/npm/v/shargs.svg?color=orange&labelColor=313A42
[shield-prs]: https://img.shields.io/badge/PRs-welcome-green.svg?labelColor=313A42
[shield-unit-tests-linux]: https://github.com/Yord/shargs/workflows/linux/badge.svg?branch=master
[shield-unit-tests-macos]: https://github.com/Yord/shargs/workflows/macos/badge.svg?branch=master
[shield-unit-tests-windows]: https://github.com/Yord/shargs/workflows/windows/badge.svg?branch=master
[teaser]: https://github.com/Yord/pxi/blob/master/teaser.gif?raw=true