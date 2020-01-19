![pxi teaser][teaser]

`pxi-args` is a command-line arguments parser for [`pxi`][pxi] (pixie), the small, fast, and magical command-line data processor.

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
$ npm i --save pxi-args
```

## Work in Progress

This project is work in progress.
Use it at your own risk!

## `pxi-args`

`pxi-args` is the command-line argument parser used by [`pxi`][pxi].

### Defining Command-Line Arguments

The following definitions of `answerCmd` are identical:

```js
const answerCmd = {key: 'answer', args: ['--answer', '-a'], types: ['number'], only: [42]}
const answerCmd = number('answer', ['--answer', '-a'], {only: [42]})

const questionCmd = string('question', ['--question'])
```

You may either describe command-line arguments using a plain object
or a type function like `number` or `string` from the functional DSL.

The definition of `answerCmd` reads as follows:

> `answerCmd` is a command-line argument that is read to the `answer` key
> and is set using either `--answer` or `-a`.
> It must be followed by exactly one number that can only be `42`.

The object syntax takes `key`, `args`, and `types` as keys,
while the type function syntax takes `key` and `args` as the first two arguments
and sets `types` depending on the type function.
Additional fields are passed as additional keys in the object syntax
or in an object as the third parameter in the type function syntax.

#### Fields

The following command-line argument fields are available:

| Field   | Value                                                        | Default | Description                                                                                                                                    |
|---------|--------------------------------------------------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `key`   | string                                                       | `null`  | The command-line argument's value is assigned to a key of this name.                                                                           |
| `args`  | array of strings                                             | `[]`    | A list of options that may be used to set the command-line option.                                                                             |
| `desc`  | string                                                       | `''`    | Description of the command-line argument for use in the usage text.                                                                            |
| `only`  | array of values                                              | `null`  | The command-line argument's value can only be one of the values in this list. If `only` is `null`, the value may be set freely.                |
| `opts`  | [command-line option](#defining-command-line-options) object | `null`  | This field is only used if the command-line argument is a command (if `types` is `null`).                                                      |
| `types` | `['number']`                                                 |         | This command-line argument takes exactly one number.                                                                                           |
| `types` | `['string']`                                                 |         | This command-line argument takes exactly one string.                                                                                           |
| `types` | `['bool']`                                                   |         | This command-line argument takes exactly one boolean, `true` or `false`.                                                                       |
| `types` | `['number','string']`                                        |         | This command-line argument takes exactly two values, a number and a string.                                                                    |
| `types` | `[]`                                                         |         | This command-line argument takes no value. It is a flag that is `true` if used and `false` if not used.                                        |
| `types` | `null`                                                       |         | This command-line argument is a command. It may have its own list of arguments (see `opts`) and is terminated by either `--` or a line ending. |

#### Functional DSL

The following type functions are available to generate command-line arguments:

| Function                          | Description                                                |
|-----------------------------------|------------------------------------------------------------|
| `array(types)(key, args, fields)` | Assigns `types`, `key`, and `args` to `fields`.            |
| `bool(key, args, fields)`         | Assigns `types: ['bool']`, `key` and `args` to `fields`.   |
| `command(key, args, fields)`      | Assigns `types: null`, `key` and `args` to `fields`.       |
| `flag(key, args, fields)`         | Assigns `types: []`, `key` and `args` to `fields`.         |
| `number(key, args, fields)`       | Assigns `types: ['number']`, `key` and `args` to `fields`. |
| `string(key, args, fields)`       | Assigns `types: ['string']`, `key` and `args` to `fields`. |

### Defining Command-Line Options

Command-line options are very similar to command-line arguments.
In fact, most [command-line parsers](#defining-command-line-parsers) use the `option` function
to generate them based on command-line arguments.

The following definitions of `answerOpt` are identical:

```js
const answerOpt = {
  errs: [],
  args: {
    '--answer': {arg: 'answer', types: ['number'], only: [42]},
    '-a':       {arg: 'answer', types: ['number'], only: [42]}
  }
}
const answerOpt = option(answerCmd)
```

You may either describe command-line options using a plain object
or the `option` function that takes a [command-line argument](#defining-command-line-arguments).

Several Command-line options may be combined:

```js
const questionOpt = option(questionCmd)

const combinedOpt = combine(questionOpt, answerOpt)
const combinedOpt = {
  errs: [],
  args: {
    '--question': {arg: 'question', types: ['string']            },
    '--answer':   {arg: 'answer',   types: ['number'], only: [42]},
    '-a':         {arg: 'answer',   types: ['number'], only: [42]}
  }
}
```

The `combinedOpt` includes `questionOpt` as well as `answerOpt`.
If either one has errors, they are gathered in the `errs` array.
Setting errors explicitly does not make much sense.
However, `option` uses `errs` if e.g. a command-line argument does not set an `arg` or empty `args`.

### Defining Command-Line Parsers

Command-line parsers combine command-line options with parser plugins
to process the command-line string given to a command-line program.
The following parser uses `combinedOpts`:

```js
const deepThought = opts => parser(
  splitShortOptions,
  parseArgs(opts),
  mergeArgs()
)(opts)

const parse = deepThought(combinedOpt)

const result = parse(sliceArgv({argv: process.argv}))
```

The `deepThought` parser lets you parse command line input of the following kind:

```bash
$ node index.js --question "What is the answer to everything?" -a 42
```

Which would be equivalent to the following:

```js
const result = {
  errs: [],
  argv: {
    "_": [],
    "question": "What is the answer to the Ultimate Question of Life, the Universe, and Everything?",
    "answer": 42
  }
}
```

#### Parser Plugins

The following parser plugins are available:

| Plugin                            | Description                                                                                                     |
|-----------------------------------|-----------------------------------------------------------------------------------------------------------------|
| `sliceArgv({errs, argv})`         | Removes the first two elements from a process.argv array, as they are meta data.                                |
| `splitShortOptions({errs, argv})` | Splits argument groups of shape `-vs` to `-v -s`. Only works if the arguments are preceded by a single dash.    |
| `parseArgs({args})({errs, argv})` | Groups arguments together with their values, types, and options if an argument is a command.                    |
| `mergeArgs(parser)({errs, argv})` | Casts values to their types, validates values, and outputs the parsing result in a hierarchical JSON structure. |

Note that not every combination of plugins produces a valid parser.

## Reporting Issues

Please report issues [in the tracker][issues]!

## Contributing

We are open to, and grateful for, any contributions made by the community.
By contributing to pixie, you agree to abide by the [code of conduct][code].
Please read the [contributing guide][contribute].

## License

`pxi-args` is [MIT licensed][license].

[actions]: https://github.com/Yord/pxi-args/actions
[code]: https://github.com/Yord/pxi-args/blob/master/CODE_OF_CONDUCT.md
[contribute]: https://github.com/Yord/pxi-args/blob/master/CONTRIBUTING.md
[issues]: https://github.com/Yord/pxi-args/issues
[license]: https://github.com/Yord/pxi-args/blob/master/LICENSE
[node]: https://nodejs.org/
[npm-install]: https://docs.npmjs.com/downloading-and-installing-packages-globally
[npm-package]: https://www.npmjs.com/package/pxi-args
[pxi]: https://github.com/Yord/pxi
[shield-license]: https://img.shields.io/npm/l/pxi-args?color=yellow&labelColor=313A42
[shield-node]: https://img.shields.io/node/v/pxi-args?color=red&labelColor=313A42
[shield-npm]: https://img.shields.io/npm/v/pxi-args.svg?color=orange&labelColor=313A42
[shield-prs]: https://img.shields.io/badge/PRs-welcome-green.svg?labelColor=313A42
[shield-unit-tests-linux]: https://github.com/Yord/pxi-args/workflows/linux/badge.svg?branch=master
[shield-unit-tests-macos]: https://github.com/Yord/pxi-args/workflows/macos/badge.svg?branch=master
[shield-unit-tests-windows]: https://github.com/Yord/pxi-args/workflows/windows/badge.svg?branch=master
[teaser]: https://github.com/Yord/pxi/blob/master/teaser.gif?raw=true