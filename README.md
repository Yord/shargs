![shargs teaser][teaser]

🦈 shargs (**sh**ell **args**) is a highly customizable command-line arguments parser and usage documentation generator.

[![node version][shield-node]][node]
[![npm version][shield-npm]][npm-package]
[![license][shield-license]][license]
[![PRs Welcome][shield-prs]][contribute]
[![linux unit tests status][shield-unit-tests-linux]][actions]
[![macos unit tests status][shield-unit-tests-macos]][actions]
[![windows unit tests status][shield-unit-tests-windows]][actions]

## Installation

Installation with [`npm`][npm-install]:

```bash
$ npm i --save shargs
```

## Features

+   **Declarative:** Describe command-line options using a declarative DSL and derive parsers and usage from that.
+   **Predefined Parsers:** Choose between many predefined parsers.
+   **Modular Parsers:** Compose your own parsers by combining predefined parser functions with your own functions.
+   **Predefined Usage Texts:** Choose between many predefined usage documentation templates.
+   **Modular Usage Texts:** Build your own usage documentation template using a high-level DSL.

## Getting Started

<details>
<summary>
Describe command-line options:

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

Shargs provides a DSL for declaring command-line options.
This example uses three different shargs type constructors:
`string`, `number`, and `flag`.

Type constructors are only syntactic sugar.
In fact, `opts` could have also been written as:

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
  args: [clearRest]
})
```

</p>
</summary>

Parsers have three different stages:
`argv`, `opts`, and `args`.
Each stage takes several parser functions that are used to transform input in the order they are defined.
Two special stages transform data between the three stages:
`toOpts` and `toArgs`.
These two stages take exactly one parser function that comes predefined, but can also be passed by the user.

The `deepThought` parser consists of six parser functions that are applied in the following order:

1.  `splitShortOptions`
2.  `toOpts` (is called after `argv` and before `opts`)
3.  `cast`
4.  `restrictToOnly`
5.  `toArgs` (is called after `opts` and before `args`)
6.  `removeRest`

</details>

<details>
<summary>
Layout a usage documentation:

<p>

```js
const docs = usage([
  synopsis('deepThought'),
  space,
  optsList,
  space,
  note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

</p>
</summary>

Every command-line tool benefits from a well-formatted usage documentation.
Shargs brings its own DSL for defining one that can easily be extended with user functions.
The DSL is declarative, which means it describes the desired structure without concerning itself with the details.
Try changing `optsList` to `optsDefs` later to experience of what this means:

```js
const docs = usage([
  synopsis('deepThought'),
  space,
  optsDefs,
  space,
  note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

</details>

<details>
<summary>
Style the usage documentation:

<p>

```js
const style = {
  line: {width: 80},
  cols: [{width: 20}, {width: 60}]
}
```

</p>
</summary>

Supplying `opts` and a `style` to `docs` renders a help text.

```js
const help = docs(opts)(style)
```

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
Use the parser and the usage documentation in your program:

<p>

```js
// node index.js --unknown -ha 42
const argv = ['--unknown', '-ha', '42']

const {errs, args} = deepThought(opts)(argv)

const help = docs(opts)(style)

if (args.help) {
  console.log(help)
} else {
  console.log('The answer is: ' + args.answer)
}
```

</p>
</summary>

Parsing `argv` returned the following `args`:

```json
{"help": true, "answer": 42, "_": []}
```

Note, that `help` is `true`.
Other command-line argument parsers would now display usage documentation for you.
Shargs leaves that to the user, giving him more control.

Our program reads:
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

## 🦈 Shargs

Other command-line parsers are often black boxes that offer very limited control over parsing.
Shargs is a very different beast:
It turns command-line arguments parsing inside out and gives you fine-grained control over parser functions and usage docs.

### Shargs' Philosophy

Shargs' philosophy is to give the user as much control over parsing as possible.
The advantages of this approach are:

+   You get exactly the parser you need, without unnecessary features.
+   You are able to mix in your own problem-specific parser functions.
+   There is no magic going on in the background, everything is explicit.

With the same philosophy, shargs offers automatic usage documentation generation.
The advantages for the user are:

+   You get exactly the usage documentation you need, no unnecessary extras.
+   You have fine-grained control over the documentation layout if you need that.
+   You can write your own layout functions and combine them with existing ones.

Its extensibility and inversion of control is what sets shargs apart from other command-line parsers.

### Command-Line Options

The most important concept in a command-line parser are command-line options.
They form the basis for parsers as well as for generating usage documentation.
Shargs gives you a simple DSL for defining command-line options:

```js
const opts = [
  command('ask', ['ask'], {desc: 'Just ask.', opts: askOpts}),
  number('answer', ['-a', '--answer'], {desc: 'The (default) answer.', only: [42]}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
]
```

The DSL lets you define options based on their types.
The following type functions are available:

| Type&nbsp;Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
|-----------------------------------|--------------------------------------------------------------------------------------------|
| `array(types)(key, args, fields)` | An array of known length. The types parameter holds the types for each individual entry.   |
| `bool(key, args, fields)`         | An explicitly defined boolean value. May be `true` or `false`.                             |
| `command(key, args, fields)`      | An array of unknown length. If `fields` contains an `opts` field, it turns into a command. |
| `flag(key, args, fields)`         | A type describing a self-sufficient command-line option. Like e.g. `--help`.               |
| `number(key, args, fields)`       | An option that takes exactly one value that is meant to represent a number.                |
| `string(key, args, fields)`       | An option that takes exactly one string.                                                   |

Type functions do two things:
They combine all their arguments in an object, and they set sensibe defaults for missing `fields`.

If you want to write options by hand or write your own DSL, feel free.
Options use the following syntax:

```js
const askOpts = [
  {key: 'question', types: ['string'], args: ['-q', '--question'], desc: 'A question.'},
  {key: 'help', types: [], args: ['-h', '--help'], desc: 'Print this help message and exit.'}
]
```

Each command-line option may contain a subset of the fields described below.
Fields with a \* are required and have their own parameters in the type functions.
All fields without a \* are set in the type functions' `fields` parameter.
The following fields are available:

| Field      | Value&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Default | Description |
|------------|---------------------------------|---------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `key`\*    | string                          |         | `key` is the name of the variable the parser uses to store the command-line option's value. It should be a unique identifier or otherwise risks to be overridden by other command-line options.                                                                                                                                                                                         |
| `args`\*   | array of strings                |         | `args` is an array of strings that may be used to define a command-line option. E.g. `['--help', '-h']` could be used for a help `flag` or `['-f', '--file']` could be used in a `string` option that parses a file path.                                                                                                                                                               |
| `types`\*  | array of type strings or `null` |         | `types` is an array of strings that represents the command-line option's type. `null` describes a command, `[]` describes a flag, arrays with one element either describe a number (`['number']`), a string (`['string']`), or a boolean (`['bool']`), and arrays with more than one element describe an array of known size (e.g. `['string','number','bool']` is an array of size 3). |
| `desc`     | string                          | `''`    | `desc` is the user-facing description of a command-line option that is used by the automatic usage documentation generation.                                                                                                                                                                                                                                                            |
| `only`     | array of values                 | `null`  | `only` is used by the `restrictToOnly` parser stage to validate user input. It takes a non-empty array of values. If `only` is set to `null`, the `restrictToOnly` parser stage skips validation.                                                                                                                                                                                       |
| `opts`     | array of command-line options   | `null`  | `opts` can be set if the command-line option is a command (if `types` is `null`) to describe the command's options. It uses the same syntax as regular command-line options.                                                                                                                                                                                                            |
| `required` | boolean                         | `false` | `required` is used by the `requireOption` parser stage to control if an option is set. If a required option is not set, `requireOption` records an error.                                                                                                                                                                                                                               |
| `reverse`  | boolean                         | `false` | `reverse` is used by the `reverseBools` and `reverseFlags` parser stages and indicates, if a boolean or flag should be treated as its reverse.                                                                                                                                                                                                                                          |
| `rules`    | predicate                       | `null`  | `rules` is a predicate applied by `verifyRules` to check if parsed `opts` are correct.                                                                                                                                                                                                                                                                                                  |
| `values`   | array of default values         | `null`  | `values` is used by the `toOpts` parser stage to set default values for command-line options, that are not explicitly given. It takes an array of values that should have the same types as defined by the `types` field. The user is responsible for ensuring the correct types are used.                                                                                              |

### Command-Line Parsers

Shargs lets you define command-line parsers with the `parser` function:

```js
const deepThought = parser({
  argv: [splitShortOptions],
  opts: [cast, restrictToOnly],
  args: [clearRest]
})
```

`parser` takes an object with three keys: `argv`, `opts`, and `args`.
Each key is the name of a shargs parsing stage.

Shargs has five stages:

1.  `argv` functions modify arrays of command-line arguments.
2.  `toOpts` transforms `argv` arrays into the command-line options DSL.
3.  `opts` functions modify command-line options.
4.  `toArgs` transforms `opts` into an object holding the parsed arguments.
5.  `args` functions modify `args` objects.

`parser` applies the stages in the given order.
Each stage takes an array of parser functions, that are applied from left to right.

The following parser functions are available:

<table>
<tr>
<th>Stage</th>
<th>Parser&nbsp;Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr>
<td><code>argv</code></td>
<td><code>splitShortOptions({errs, argv})</code></td>
<td>
<details>
<summary>
Splits argument groups of shape <code>-vs</code> to <code>-v -s</code>. Only works if argument groups are preceded by a single dash.
</summary>

<br />

Example:

```js
const argv = ['-ab']

splitShortOptions({argv})
```

Result:

```js
{
  argv: ['-a', '-b']
}
```

</details>
</td>
</tr>
<tr>
<td><code>argv</code></td>
<td><code>verifyArgv(rules)({errs, opts})</code></td>
<td>
<details>
<summary>
Checks, whether the <code>argv</code> adher to a given <code>rules</code> predicate.
</summary>

<br />

Example:

```js
const rules = argv => (
  argv.some(_ => _ === '-f') &&
  argv.some(_ => _ === '-l')
)

const argv = ['-f', 'Logan']

verifyArgv(rules)({argv})
```

Result:

```js
{
  errs: [
    {
      code: 'False argv rules',
      msg:  'Your argv rules returned false...',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr>
<td><code>opts</code></td>
<td><code>cast({errs, opts})</code></td>
<td>
<details>
<summary>
Casts all <code>values</code> according to the options' types.
</summary>

<br />

Example:

```js
const opts = [
  string('title', ['--title'], {values: ["The Hitchhiker's Guide to the Galaxy"]}),
  numberBool('numBool', ['-n', '--nb'], {values: ['23', 'true']}),
  number('answer', ['-a', '--answer'], {values: ['42']}),
  command('help', ['-h', '--help'], {values: ['foo --bar']}),
  bool('verbose', ['--verbose'], {values: ['false']}),
  flag('version', ['--version'], {values: []})
]

cast({opts})
```

Result:

```js
{
  opts: [
    string('title', ['--title'], {values: ["The Hitchhiker's Guide to the Galaxy"]}),
    numberBool('numBool', ['-n', '--nb'], {values: [23, true]}),
    number('answer', ['-a', '--answer'], {values: [42]}),
    command('help', ['-h', '--help'], {values: ['foo --bar']}),
    bool('verbose', ['--verbose'], {values: [false]}),
    flag('version', ['--version'], {values: [true]})
  ]
}
```

</details>
</td>
</tr>
<tr>
<td><code>opts</code></td>
<td><code>requireOptions({errs, opts})</code></td>
<td>
<details>
<summary>
Controls, if options marked with <code>{required: true}</code> have valid <code>values</code>.
If a required option is not present, an error message is recorded.
</summary>

<br />

Example:

```js

const opts = [
  number('answer', ['-a', '--answer'], {required: true})
]

requireOptions({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'Required option is missing',
      msg:  'An option that is marked as required has not been provided.',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr>
<td><code>opts</code></td>
<td><code>restrictToOnly({errs, opts})</code></td>
<td>
<details>
<summary>
Records an error if the <code>values</code> are not contained in the <code>only</code> list.
</summary>

<br />

Example:

```js
const opts = [
  number('answer', ['-a', '--answer'], {only: [42], values: [42]})
]

restrictToOnly({opts})
```

Result:

```js
{
  opts: [
    number('answer', ['-a', '--answer'], {only: [42], values: [42]})
  ]
}
```

</details>
</td>
</tr>
<tr>
<td><code>opts</code></td>
<td><code>reverseBools({errs, opts})</code></td>
<td>
<details>
<summary>
Reverses the value of a <code>bool</code>. Works on string (e.g. <code>['false']</code>) and boolean (e.g. <code>[false]</code>) values.
</summary>

<br />

Example:

```js
const opts = [
  bool('bool', ['-b'], {reverse: true, values: [true]}),
  bool('bool', ['-b'], {reverse: true, values: ['true']})
]

reverseBools({opts})
```

Result:

```js
{
  opts: [
    bool('bool', ['-b'], {reverse: true, values: [false]}),
    bool('bool', ['-b'], {reverse: true, values: ['false']})
  ]
}
```

</details>
</td>
</tr>
<tr>
<td><code>opts</code></td>
<td><code>reverseFlags({errs, opts})</code></td>
<td>
<details>
<summary>
Reverses the value of a flag. This may be useful if the presence of a flag should imply <code>false</code>.
</summary>

<br />

Example:

```js
const opts = [
  flag('flag', ['-f'], {reverse: true, values: [1]})
]

reverseFlags({opts})
```

Result:

```js
{
  opts: [
    flag('flag', ['-f'], {reverse: true, values: [-1]})
  ]
}
```

</details>
</td>
</tr>
<tr>
<td><code>opts</code></td>
<td><code>verifyOpts(rules)({errs, opts})</code></td>
<td>
<details>
<summary>
Checks, whether the <code>opts</code> adher to a given <code>rules</code> predicate.
</summary>

<br />

Example:

```js
const implies = (p, q) => !p || q

const rules = opts => implies(
  opts.some(_ => _.key === 'firstName' && _.values !== null),
  opts.some(_ => _.key === 'lastName' && _.values !== null)
)

const opts = [
  string('firstName', ['-f'], {values: ['Charles']}),
  string('lastName', ['-l'])
]

verifyOpts(rules)({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'False opts rules',
      msg:  'Your opts rules returned false...',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr>
<td><code>opts</code></td>
<td><code>verifyRules({errs, opts})</code></td>
<td>
<details>
<summary>
Checks, whether the <code>rules</code> predicate holds for an option in relation to all options.
</summary>

<br />

Example:

```js
const rules = firstName => opts => (
  firstName.values[0] === 'Logan' ||
  opts.some(
    ({key, values}) => key === 'lastName' && values !== null
  )
)

const opts = [
  string('firstName', ['-f'], {rules, values: ['Charles']}),
  string('lastName', ['-l'])
]

verifyRules(obj)
```

Result:

```js
{
  errs: [
    {
      code: 'False rules',
      msg:  "An option's rules returned false. Please check your arguments.",
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr>
<td><code>args</code></td>
<td><code>clearRest({errs, args})</code></td>
<td>
<details>
<summary>
Removes all entries from each <code>_</code> key.
</summary>

<br />

Example:

```js
const args = {_: ['foo']}

clearRest({args})
```

Result:

```js
{
  args: {_: []}
}
```

</details>
</td>
</tr>
<tr>
<td><code>args</code></td>
<td><code>failRest({errs, args})</code></td>
<td>
<details>
<summary>
Records an error for each argument in a rest field. E.g. <code>{_: ['foo']}</code> would add an error for <code>foo</code>.
</summary>

<br />

Example:

```js
const args = {
  _: ['foo'],
  command: {
    _: ['bar'],
    foo: [42, 'foo']
  }
}

failRest({args})
```

Result:

```js
{
  errs: [
    {
      code: 'Unexpected argument',
      msg:  'An unexpected argument was used that has no option defined.',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr>
<td><code>args</code></td>
<td><code>flagsAsBools({errs, args})</code></td>
<td>
<details>
<summary>
Transforms all count-based <code>flag</code> options into booleans, that are <code>true</code> if the count is greater than <code>0</code>.
</summary>

<br />

Example:

```js
const args = {
  version: {type: 'flag', count: 1}
}

flagsAsBools({args})
```

Result:

```js
{
  args: {
    version: true
  }
}
```

</details>
</td>
</tr>
<tr>
<td><code>args</code></td>
<td><code>flagsAsNumbers({errs, args})</code></td>
<td>
<details>
<summary>
Transforms all count-based <code>flag</code> options into numbers, that correspond to the count.
</summary>

<br />

Example:

```js
const args = {
  version: {type: 'flag', count: 2}
}

flagsAsNumbers({args})
```

Result:

```js
{
  args: {
    version: 2
  }
}
```

</details>
</td>
</tr>
<tr>
<td><code>args</code></td>
<td><code>transformArgs(fs)({errs, args})</code></td>
<td>
<details>
<summary>
Transforms an args object into a new args object by applying functions <code>fs</code> based on the value type.
All fields of an object are updated independently and previous updates in the same run do not influence later updates.
</summary>

<br />

Example:

```js
const args = {
  version: {type: 'flag', count: 2},
  answer: 23
}

const fs = {
  flag:   ({key, val, errs, args}) => ({
    errs,
    args: {...args, [key]: val.count}
  }),
  number: ({key, val, errs, args}) => ({
    errs,
    args: {...args, [key]: val + 19}
  })
}

transformArgs(fs)({args})
```

Result:

```js
{
  args: {
    version: 2,
    answer: 42
  }
}
```

Allowed <code>fs</code> Fields:

```js
const fs = {
  undefined: ({key, val, errs, args}) => ({errs, args}),
  null:      ({key, val, errs, args}) => ({errs, args}),
  boolean:   ({key, val, errs, args}) => ({errs, args}),
  number:    ({key, val, errs, args}) => ({errs, args}),
  string:    ({key, val, errs, args}) => ({errs, args}),
  array:     ({key, val, errs, args}) => ({errs, args}),
  flag:      ({key, val, errs, args}) => ({errs, args}),
  function:  ({key, val, errs, args}) => ({errs, args}),
  otherwise: ({key, val, errs, args}) => ({errs, args})
}
```

</details>
</td>
</tr>
</table>

### Usage Documentation

Every decent command-line tools has a usage documentation.
The `deepThought` tool is no exception and should e.g. show the following text if the `--help` flag is present:

```bash
deepThought ask [-q|--question] [-h|--help]                                     
                                                                                
-q, --question      A question. [string]                                        
-h, --help          Print this help message and exit. [flag]                    
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything. 
```

Writing the usage documentation yourself is not a good idea,
because you would have to update it every time a command-line option is added or changed.
This is why shargs takes care for generating usage documentation for you.

#### Layout Documentation DSL

Shargs uses its own markup language for formatting text in the terminal called layout functions DSL.
The `deepThought ask` documentation could be written as follows in layout syntax:

```js
const askDocs = layout([
  text('deepThought ask [-q|--question] [-h|--help]'),
  br,
  table([
    ['-q, --question', 'A question. [string]'],
    ['-h, --help', 'Print this help message and exit. [flag]']
  ]),
  br,
  text(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

Shargs includes the following layout functions:

<table>
<tr>
<th>Layout&nbsp;Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description (and Example)</th>
</tr>
<tr>
<td><code>br(style)</code><br /><code>brFrom(id)(style)</code></td>
<td>
<details>
<summary>
Introduces a single blank line.
</summary>

<br />

```js
const br = brFrom('line')
```

Example:

```js
const style = {
  line: {width: 40}
}

layout([
  line('First line'),
  br,
  line('Last line')
])(style)
```

Result:

```bash
First line                              
                                        
Last line                               
```

</details>
</td>
</tr>
<tr>
<td><code>brs(length)(style)</code><br /><code>brsFrom(id)(length)(style)</code></td>
<td>
<details>
<summary>
Introduces several blank lines with the number defined by the length parameter.
</summary>

<br />

```js
const brs = brsFrom('line')
```

Example:

```js
const style = {
  line: {width: 40}
}

layout([
  line('First line'),
  brs(2),
  line('Last line')
])(style)
```

Result:

```bash
First line                              
                                        
                                        
Last line                               
```

</details>
</td>
</tr>
<tr>
<td><code>cols(columns)(style)</code><br /><code>colsFrom(id)(columns)(style)</code></td>
<td>
<details>
<summary>
Takes a list of columns with each column consisting of several strings.
Prints the first column at the left and the last column at the right.
The style parameter must have a <code>cols</code> id with a number of style objects equal to the number of columns.
If a column string is longer than a column's width, it is cut off.
</summary>

<br />

```js
const cols = colsFrom('cols')
```

Example:

```js
const style = {
  cols: [
    {width: 15},
    {width: 25}
  ]
}

cols([
  [
    '-h, --help',
    '-v, --version'
  ],
  [
    'Prints the help.',
    'Prints the version.'
  ]
])(style)
```

Result:

```bash
-h, --help     Prints the help.         
-v, --version  Prints the version.      
```

</details>
</td>
</tr>
<tr>
<td><code>defs(rowsList)(style)</code><br /><code>defsFrom(id1, id2)(rowsList)(style)</code></td>
<td>
<details>
<summary>
Takes a list of title/desc row pairs.
Prints the title as a <code>text</code> before printing the desc as a <code>text</code>.
Title and text may be assigned different style ids.
</summary>

<br />

```js
const defs = defsFrom('line', 'desc')
```

Example:

```js
const style = {
  line: {width: 40},
  desc: {padStart: 4, width: 36}
}

defs([
  [
    '-h, --help',
    'Prints the help.'
  ],
  [
    '-v, --version',
    'Prints the version.'
  ]
])(line)
```

Result:

```bash
-h, --help                              
    Prints the help.                    

-v, --version                           
    Prints the version.                 
```

</details>
</td>
</tr>
<tr>
<td><code>line(string)(style)</code><br /><code>lineFrom(id)(string)(style)</code></td>
<td>
<details>
<summary>
Prints the string with a linebreak at the end.
Takes the line width from style and pads with spaces at the end.
If the string is too long to fit the line's width, it is cut off.
</summary>

<br />

```js
const line = lineFrom('line')
```

Example:

```js
const style = {
  line: {width: 40}
}

line('A line')(style)
```

Result:

```bash
A line                              
```

</details>
</td>
</tr>
<tr>
<td><code>lines(strings)(style)</code><br /><code>linesFrom(id)(strings)(style)</code></td>
<td>
<details>
<summary>
Prints several strings using the <code>line</code> function for each.
</summary>

<br />

```js
const lines = linesFrom('line')
```

Example:

```js
const style = {
  line: {width: 40}
}

lines([
  'First line',
  'Last line'
])(style)
```

Result:

```bash
First line                              
Last line                               
```

</details>
</td>
</tr>
<tr>
<td><code>table(rowsList)(style)</code><br /><code>tableFrom(id)(rowsList)(style)</code></td>
<td>
<details>
<summary>
Takes a rows list with each row holding a number of strings equal to the number of columns.
The style parameter must have a <code>cols</code> key with a number of style objects equal to the number of columns.
The strings in each row are formatted according to the defined columns.
If a string surpasses the width of a column, its remaining words are printed in the following rows.
</summary>

<br />

```js
const table = tableFrom('cols')
```

Example:

```js
const style = {
  cols: [
    {width: 10, padEnd: 2},
    {width: 28}
  ]
}

table([
  [
    '-v, --version',
    'Prints the version.'
  ],
  [
    '-h, --help',
    'Prints the help.'
  ]
])(style)
```

Result:

```bash
-v,         Prints the version.         
--version                                    
-h, --help  Prints the help.            
```

</details>
</td>
</tr>
<tr>
<td><code>text(string)(style)</code><br /><code>textFrom(id)(string)(style)</code></td>
<td>
<details>
<summary>
Text acts much like <code>line</code>, but does not cut off strings that surpass a line's width.
Instead, it splits the string by words and adds new lines with the remaining words.
</summary>

<br />

```js
const text = textFrom('line')
```

Example:

```js
const style = {
  line: {width: 40}
}

text(
  'Deep Thought was created to come up with the Answer.'
)(style)
```

Result:

```bash
Deep Thought was created to come up with
the Answer.                             
```

</details>
</td>
</tr>
<tr>
<td><code>texts(strings)(style)</code><br /><code>textsFrom(id)(strings)(style)</code></td>
<td>
<details>
<summary>
Takes several strings and applies the <code>text</code> function to each.
</summary>

<br />

```js
const texts = textsFrom('line')
```

Example:

```js
const style = {
  line: {width: 40}
}

texts([
  'Deep Thought was created to come up with the Answer.',
  'To The Ultimate Question.'
])(style)
```

Result:

```bash
Deep Thought was created to come up with
the Answer.                             
To The Ultimate Question.
```

</details>
</td>
</tr>
</table>

Layout functions can be combined with the following layout combinators:

<table>
<tr>
<th>Layout&nbsp;Combinator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description (and Example)</th>
</tr>
<tr>
<td><code>layout(functions)(style)</code></td>
<td>
<details>
<summary>
Groups several layout DSL functions together.
</summary>

<br />

Example:

```js
const style = {
  line: {width: 40}
}

layout([
  line('First line'),
  line('Last line')
])(style)
```

Result:

```bash
First line                              
Last line                               
```

</details>
</td>
</tr>
<tr>
<td><code>layoutMap(f)(itemsList)(style)</code></td>
<td>
<details>
<summary>
Takes a list of strings and a function <code>f</code>,
which is applied to each string and is expected to return a layout function.
The strings are then formatted according to f.
</summary>

<br />

Style:

```js
const style = {
  line: {width: 40},
  desc: {padStart: 4, width: 36}
}
```

Example 1:

```js
const itemsList = [
  ['-h, --help', 'Prints the help.'],
  ['-v, --version', 'Prints the version.']
]

const f = ([title, desc]) => layout([
  text(title),
  textFrom('desc')(desc)
])

layoutMap(f)(itemsList)(style)
```

Result 1:

```bash
-h, --help                              
    Prints the help.                    
-v, --version                           
    Prints the version.                 
```

Example 2:

```js
const lines = layoutMap(line)

lines([
  '-h, --help',
  'Prints the help.'
])(style)
```

Result 2:

```bash
-h, --help                              
Prints the help.                        
```

</details>
</td>
</tr>
</table>

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
In order to connect layout functions to a different id than the default,
pass it as a string to the `id` parameter of any `*From` function.

#### Usage Documentation DSL

The usage DSL extends the layout DSL by providing functions that have access to command-line options.
Using this DSL makes defining usage documentation for command-line options very declarative:

```js
const docs = usage([
  synopsis('deepThought'),
  space,
  optsList,
  space,
  note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

Note how the usage DSL needs notably less code than the layout DSL,
since its functions have access to the command-line options.
Shargs includes the following usage functions:

<table>
<tr>
<th>Usage&nbsp;Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description (and Example)</th>
</tr>
<tr>
<td><code>note(string)(opts)(style)</code><br /><code>noteFrom(id)(string)(opts)(style)</code></td>
<td>
<details>
<summary>
Prints the string with a line break at the end. Takes the line width from style and pads with spaces at the end. If the string is too long to fit the line's width, it is broken up into words, and all remaining words are put into the following line.
</summary>

<br />

```js
const note = noteFrom('line')
```

Example:

```js
const opts = []

const style = {
  line: {width: 40}
}

note(
  'Deep Thought was created to come up with the Answer.'
)(opts)(style)
```

Result:

```bash
Deep Thought was created to come up with
the Answer.                             
```

</details>
</td>
</tr>
<tr>
<td><code>notes(strings)(opts)(style)</code><br /><code>notesFrom(id)(strings)(opts)(style)</code></td>
<td>
<details>
<summary>
Prints several strings using the <code>note</code> function for each.
</summary>

<br />

```js
const notes = notesFrom('line')
```

Example:

```js
const opts = []

const style = {
  line: {width: 40}
}

notes([
  'Deep Thought answered',
  'The Ultimate Question.'
])(opts)(style)
```

Result:

```bash
Deep Thought answered                   
The Ultimate Question.                  
```

</details>
</td>
</tr>
<tr>
<td><code>optsDefs(opts)(style)</code><br /><code>optsDefsFrom(id1, id2)(opts)(style)</code></td>
<td>
<details>
<summary>
Prints a definition list, with the command-line option <code>args</code> as title
and the <code>desc</code> key as text.
</summary>

<br />

```js
const optsDefs = optsDefsFrom('line', 'desc')
```

Example:

```js
const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'Prints version.'})
]

const style = {
  line: {width: 40},
  desc: {padStart: 4, width: 36}
}

optsDefs(opts)(style)
```

Result:

```bash
-a, --answer [number]                   
    The answer.                         

-h, --help [flag]                       
    Prints help.                        

--version [flag]                        
    Prints version.                     
```

</details>
</td>
</tr>
<tr>
<td><code>optsList(opts)(style)</code><br /><code>optsListFrom(id)(opts)(style)</code></td>
<td>
<details>
<summary>
Prints a table with two columns:
The command-line option's <code>args</code> in the left,
and the <code>desc</code> key in the right column.
</summary>

<br />

```js
const optsList = optsListFrom('cols')
```

Example:

```js
const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'Prints version.'})
]

const style = {
  cols: [
    {width: 10, padEnd: 2},
    {width: 28}
  ]
}

optsList(opts)(style)
```

Result:

```bash
-a,         The answer. [number]        
--answer                                
-h, --help  Prints help. [flag]         
--version   Prints version. [flag]      
```

</details>
</td>
</tr>
<tr>
<td><code>space(opts)(style)</code><br /><code>spaceFrom(id)(opts)(style)</code></td>
<td>
<details>
<summary>
Introduces a single blank line.
</summary>

<br />

```js
const space = spaceFrom('line')
```

Example:

```js
const opts = []

const style = {
  line: {width: 40}
}

usage([
  note('Deep Thought answered'),
  space,
  note('The Ultimate Question.')
])(opts)(style)
```

Result:

```bash
Deep Thought answered                   
                                        
The Ultimate Question.                  
```

</details>
</td>
</tr>
<tr>
<td><code>spaces(length)(opts)(style)</code><br /><code>spacesFrom(id)(length)(opts)(style)</code></td>
<td>
<details>
<summary>
Introduces several blank lines with the number defined by the length parameter.
</summary>

<br />

```js
const spaces = spacesFrom('line')
```

Example:

```js
const opts = []

const style = {
  line: {width: 40}
}

usage([
  note('Deep Thought answered'),
  spaces(2),
  note('The Ultimate Question.')
])(opts)(style)
```

Result:

```bash
Deep Thought answered                   
                                        
                                        
The Ultimate Question.                  
```

</details>
</td>
</tr>
<tr>
<td><code>synopsis(start, end)(opts)(style)</code><br /><code>synopsisFrom(id)(start, end)(opts)(style)</code></td>
<td>
<details>
<summary>
Prints a command's synopsis:
The <code>start</code> string is printed first, the command-line option's <code>args</code> next,
followed by the <code>end</code> string.
</summary>

<br />

```js
const synopsis = synopsisFrom('cols')
```

Example:

```js
const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'Prints version.'})
]

const style = {
  line: {width: 40}
}

synopsis('deepThought')(opts)(style)
```

Result:

```bash
deepThought [-a|--answer] [-h|--help]   
            [--version]                 
```

</details>
</td>
</tr>
</table>

Usage functions can be combined with the following usage combinators:

<table>
<tr>
<th>Usage&nbsp;Combinator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description (and Example)</th>
</tr>
<tr>
<td><code>usage(functions)(opts)(style)</code></td>
<td>
<details>
<summary>
Groups several usage DSL functions together.
</summary>

<br />

Example:

```js
const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'Prints version.'})
]

const style = {
  line: {width: 40},
  cols: [
    {width: 10, padEnd: 2},
    {width: 28}
  ]
}

usage([
  synopsis('deepThought'),
  space,
  optsList,
  space,
  note('Deep Thought was created to come up with the Answer.')
])(opts)(style)
```

Result:

```bash
deepThought [-a|--answer] [-h|--help]   
            [--version]                 
                                        
-a,         The answer. [number]        
--answer                                
-h, --help  Prints help. [flag]         
--version   Prints version. [flag]      
                                        
Deep Thought was created to come up with
the Answer.                             
```

</details>
</td>
</tr>
<tr>
<td><code>usageMap(f)(opts)(style)</code></td>
<td>
<details>
<summary>
Takes an options list and a function <code>f</code>,
which is applied to each option and is expected to return a layout function.
</summary>

<br />

Example:

```js
const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'Prints version.'})
]

const style = {
  line: {width: 40},
  desc: {padStart: 3, width: 37}
}

usageMap(({args, desc}) => layout([
  text(args.join(', ')),
  textFrom('desc')(desc)
]))(opts)(style)
```

Result:

```bash
-a, --answer                            
   The answer.                          
-h, --help                              
   Prints help.                         
--version                               
   Prints version.                      
```

</details>
</td>
</tr>
</table>

#### Usage Decorators DSL

Sometimes you want to pass only a portion of the command-line options to a usage function.
Shargs has usage decorators for that:

```js
const decoratedDocs = usage([
  decorate(noCommands, onlyFirstArg)(synopsis('deepThought')),
  space,
  onlyCommands(optsDefs),
  space,
  noCommands(optsList),
  space,
  note(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

`decoratedDocs` displays commands and other command-line options in separate text blocks
by using the `onlyCommands` and `noCommands` decorators to filter relevant options.
Shargs includes the following usage decorators:

<table>
<tr>
<th>Usage&nbsp;Decorator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr>
<tr>
<td><code>justArgs(array)(usageFunction)(opts)</code></td>
<td>
<details>
<summary>
Takes an array of args and keeps only those <code>opts</code> that have an arg in the args <code>array</code>.
</summary>

<br />

Example:

```js
const style = {
  cols: [{width: 10, padEnd: 2}, {width: 28}]
}

const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer'}),
  command('help', ['-h', '--help'], {desc: 'Prints help'}),
  flag('version', ['--version'], {desc: 'Prints version'})
]

justArgs(['-a', '-h'])(optsList)(opts)(style)
```

Result:

```bash
-a,         The answer [number]         
--answer                                
-h, --help  Prints help                 
```

</details>
</td>
</tr>
<tr>
<td><code>noCommands(usageFunction)(opts)</code></td>
<td>
<details>
<summary>
Filters out all commands from <code>opts</code>.
</summary>

<br />

Example:

```js
const style = {
  cols: [{width: 10, padEnd: 2}, {width: 28}]
}

const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer'}),
  command('help', ['-h', '--help'], {desc: 'Prints help'}),
  flag('version', ['--version'], {desc: 'Prints version'})
]

noCommands(optsList)(opts)(style)
```

Result:

```bash
-a,         The answer [number]         
--answer                                
--version   Prints version [flag]       
```

</details>
</td>
</tr>
<tr>
<td><code>onlyCommands(usageFunction)(opts)</code></td>
<td>
<details>
<summary>
Keeps only commands in <code>opts</code>.
</summary>

<br />

Example:

```js
const style = {
  cols: [{width: 10, padEnd: 2}, {width: 28}]
}

const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer'}),
  command('help', ['-h', '--help'], {desc: 'Prints help'}),
  flag('version', ['--version'], {desc: 'Prints version'})
]

onlyCommands(optsList)(opts)(style)
```

Result:

```bash
-h, --help  Prints help                 
```

</details>
</td>
</tr>
<tr>
<td><code>onlyFirstArg(usageFunction)(opts)</code></td>
<td>
<details>
<summary>
Keeps only the first arg from each opt.
</summary>

<br />

Example:

```js
const style = {
  cols: [{width: 10, padEnd: 2}, {width: 28}]
}

const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer'}),
  command('help', ['-h', '--help'], {desc: 'Prints help'}),
  flag('version', ['--version'], {desc: 'Prints version'})
]

onlyFirstArg(optsList)(opts)(style)
```

Result:

```bash
-a          The answer [number]         
-h          Prints help                 
--version   Prints version [flag]       
```

</details>
</td>
</tr>
<tr>
<td><code>optsFilter(p)(usageFunction)(opts)</code></td>
<td>
<details>
<summary>
Applies <code>filter</code> to the <code>opts</code> array using a predicate <code>p</code>.
</summary>

<br />

Example:

```js
const style = {
  cols: [{width: 10, padEnd: 2}, {width: 28}]
}

const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer'}),
  command('help', ['-h', '--help'], {desc: 'Prints help'}),
  flag('version', ['--version'], {desc: 'Prints version'})
]

optsFilter(
  ({types}) => types !== null
)(optsList)(opts)(style)
```

Result:

```bash
-a,         The answer [number]         
--answer                                
--version   Prints version [flag]       
```

</details>
</td>
</tr>
<tr>
<td><code>optsMap(f)(usageFunction)(opts)</code></td>
<td>
<details>
<summary>
Applies <code>map</code> to the <code>opts</code> array using a function <code>f</code>.
</summary>

<br />

Example:

```js
const style = {
  cols: [{width: 10, padEnd: 2}, {width: 28}]
}

const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer'}),
  command('help', ['-h', '--help'], {desc: 'Prints help'}),
  flag('version', ['--version'], {desc: 'Prints version'})
]

optsMap(
  opt => ({...opt, args: opt.args.slice(0, 1)})
)(optsList)(opts)(style)
```

Result:

```bash
-a          The answer [number]         
-h          Prints help                 
--version   Prints version [flag]       
```

</details>
</td>
</tr>
</table>

Usage decorator functions can be combined with the following usage decorator combinators:

| Usage&nbsp;Decorator&nbsp;Combinator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; | Description |
|---------------------------------------------|-----------------------------------------------------|
| `decorate(decorators)(usageFunction)(opts)` | Combines several usage decorators to one decorator. |

### Combining Options, Parser, and Usage Documentation

The command-line options, the parser, and the usage documentation are combined to a program:

```js
// ./deepThought -a 42 ask -q 'What is the answer to everything?'
const argv = ['-a', '42', 'ask', '-q', 'What is the answer to everything?']

const {errs, args} = deepThought(opts)(argv)

const help = docs(opts)(style)
const askHelp = askDocs(style)

if (args.help) {
  console.log(help)
} else if (args.ask && args.ask.help) {
  console.log(askHelp)
} else {
  console.log('The answer is: ' + args.answer)
}
```

Shargs lets you define the three parts individually.
This gives you a lot of flexibility:
E.g. It lets you mix in custom parser and usage functions.

## Reporting Issues

Please report issues [in the tracker][issues]!

## Contributing

We are open to, and grateful for, any contributions made by the community.
By contributing to shargs, you agree to abide by the [code of conduct][code].
Please read the [contributing guide][contribute].

## License

Shargs is [MIT licensed][license].

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