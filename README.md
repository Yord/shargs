🦈 shargs (**sh**ell **args**) is a highly customizable command-line arguments parser and usage documentation generator.

[![node version][shield-node]][node]
[![npm version][shield-npm]][npm-package]
[![license][shield-license]][license]
[![PRs Welcome][shield-prs]][contribute]
[![linux unit tests status][shield-unit-tests-linux]][actions]
[![macos unit tests status][shield-unit-tests-macos]][actions]
[![windows unit tests status][shield-unit-tests-windows]][actions]

## Installation

```bash
$ npm install --save shargs
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
  opts: [restrictToOnly, cast],
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
Try changing `optsList` to `optsDefs` later to see what that entails:

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

And since our program reads:
If `args` contains a `help` field, the `help` text is printed...

</details>

<details>
<summary>
The following text is printed:

<p>

```bash
deepThought [-q|--question] [-a|--answer] [-h|--help]                           
                                                                                
-q, --question      A question. [string]                                        
-a, --answer        The (default) answer. [number]                              
-h, --help          Print this help message and exit. [flag]                    
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything.
```

</p>
</summary>

If `help` would not have been `true`, the answer would have been printed.

</details>

Shargs is less a command-line parser than a library to conveniently build command-line parsers.

## 🦈 Shargs

Other command-line parsers are often black boxes that offer very limited control over parsing.
Shargs is a very different beast:
It turns command-line arguments parsing inside out and gives you fine-grained control over parser stages and usage docs.

### Shargs' Philosophy

Shargs' philosophy is to **give the user as much control over parsing as possible**.
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

<table>
<tr>
<th>Type&nbsp;Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="array">
<td><code><a href="#array">array</a>(types)(key, args, fields)</code></td>
<td>An array of known length. The types parameter holds the types for each individual entry.</td>
</tr>
<tr name="bool">
<td><code><a href="#bool">bool</a>(key, args, fields)</code></td>
<td>An explicitly defined boolean value. May be <code>true</code> or <code>false</code>.</td>
</tr>
<tr name="command">
<td><code><a href="#command">command</a>(key, args, fields)</code></td>
<td>An array of unknown length. If <code>fields</code> contains an <code>opts</code> field, it turns into a command.</td>
</tr>
<tr name="flag">
<td><code><a href="#flag">flag</a>(key, args, fields)</code></td>
<td>A type describing a self-sufficient command-line option. Like e.g. <code>--help</code>.</td>
</tr>
<tr name="number">
<td><code><a href="#number">number</a>(key, args, fields)</code></td>
<td>An option that takes exactly one value that is meant to represent a number.</td>
</tr>
<tr name="string">
<td><code><a href="#string">string</a>(key, args, fields)</code></td>
<td>An option that takes exactly one string.</td>
</tr>
</table>

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

<table>
<tr>
<th>Field</th>
<th>Value&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="key">
<td><code><a href="#key">key</a></code>*</td>
<td>string</td>
<td><code>key</code> is the name of the variable the parser uses to store the command-line option's value. It should be a unique identifier or otherwise risks to be overridden by other command-line options. A key must not be named <code>_</code>, as it is a reserved field for collecting unmatched <code>argv</code>.</td>
</tr>
<tr name="args">
<td><code><a href="#args">args</a></code>*</td>
<td>array of strings</td>
<td><code>args</code> is an array of strings that may be used to define a command-line option. E.g. <code>['--help', '-h']</code> could be used for a help <a href="#flag"><code>flag</code></a> or <code>['-f', '--file']</code> could be used in a <a href="#string"><code>string</code></a> option that parses a file path.</td>
</tr>
<tr name="types">
<td><code><a href="#types">types</a></code>*</td>
<td>array of type strings or `null`</td>
<td><code>types</code> is an array of strings that represents the command-line option's type. <code>null</code> describes a <a href="#command"><code>command</code></a>, <code>[]</code> describes a <a href="#flag"><code>flag</code></a>, arrays with one element either describe a <a href="#number"><code>number</code></a> (<code>['number']</code>), a <a href="#string"><code>string</code></a> (<code>['string']</code>), or a <a href="#bool"><code>bool</code></a> (<code>['bool']</code>), and arrays with more than one element describe an <a href="#array"><code>array</code></a> of known size (e.g. <code>['string','number','bool']</code> is an array of size 3).</td>
</tr>
<tr name="contradicts">
<td><code><a href="#contradicts">contradicts</a></code></td>
<td>array of keys</td>
<td><code>contradicts</code> is used by the <a href="#contradictOpts"><code>contradictOpts</code></a> stage to specify an array of command-line options identified by their <a href="#key"><code>key</code></a> that are incompatible with this command-line option.</td>
</tr>
<tr name="defaultValues">
<td><code><a href="#defaultValues">defaultValues</a></code></td>
<td>array of values</td>
<td><code>defaultValues</code> is used by the <a href="#toArgs"><code>toArgs</code></a> parser stage to set default values for command-line options without supplied command-line arguments. For non-<a href="#command"><code>command</code></a> options, it takes an array of values, <code>command</code> options may take any value.</td>
</tr>
<tr name="desc">
<td><code><a href="#desc">desc</a></code></td>
<td>string</td>
<td><code>desc</code> is the user-facing description of a command-line option that is used by the automatic usage documentation generation.</td>
</tr>
<tr name="implies">
<td><code><a href="#implies">implies</a></code></td>
<td>array of keys</td>
<td><code>implies</code> is used by the <a href="#implyOpts"><code>implyOpts</code></a> stage to specify an array of command-line options identified by their <a href="#key"><code>key</code></a> that must have <a href="#values"><code>values</code></a>, if this command-line option has <code>values</code>.</td>
</tr>
<tr name="only">
<td><code><a href="#only">only</a></code></td>
<td>array of values</td>
<td><code>only</code> is used by the <a href="#restrictToOnly"><code>restrictToOnly</code></a> parser stage to validate user input. It takes a non-empty array of values.</td>
</tr>
<tr name="opts">
<td><code><a href="#opts">opts</a></code></td>
<td>array of command-line options</td>
<td><code>opts</code> can be set if the command-line option is a <a href="#command"><code>command</code></a> (if <a href="#types"><code>types</code></a> is <code>null</code>) to describe the command's options. It uses the same syntax as regular command-line options.</td>
</tr>
<tr name="required">
<td><code><a href="#required">required</a></code></td>
<td>boolean</td>
<td><code>required</code> is used by the <a href="#requireOptions"><code>requireOptions</code></a> parser stage to control if an option is set. If a required option is not set, <a href="#requireOptions"><code>requireOptions</code></a> records an error.</td>
</tr>
<tr name="reverse">
<td><code><a href="#reverse">reverse</a></code></td>
<td>boolean</td>
<td><code>reverse</code> is used by the <a href="#reverseBools"><code>reverseBools</code></a> and <a href="#reverseFlags"><code>reverseFlags</code></a> parser stages and indicates, if a <a href="#bool"><code>bool</code></a> or <a href="#flag"><code>flag</code></a> should be treated as its reverse.</td>
</tr>
<tr name="rules">
<td><code><a href="#rules">rules</a></code></td>
<td>predicate</td>
<td><code>rules</code> is a predicate applied by <a href="#verifyRules"><code>verifyRules</code></a> to check if parsed <code>opts</code> are correct.</td>
</tr>
<tr name="values">
<td><code><a href="#values">values</a></code></td>
<td>array with value(s)</td>
<td><code>values</code> is used by the <a href="#toOpts"><code>toOpts</code></a> parser stage to store command-line arguments. This field should not be set by the user. If you need to set default values, use the <a href="#defaultValues"><code>defaultValues</code></a> field, instead.</td>
</tr>
</table>

A command-line option may be decorated with one or many of the following decorators, which change its values:

<table>
<tr>
<th>Decorator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="complement">
<td><code><a href="#complement">complement</a>(prefix)(opt)</code></td>
<td>
Transforms a <a href="#bool"><code>bool</code></a> or <a href="#flag"><code>flag</code></a> option into a complementary option prefixed with a given string (e.g. <code>--no-</code>). The complementary option has the same key as the original option, but reverts the value. Using <code>complement</code> assumes, either the <code>reverseBools</code> or <code>reverseFlags</code>, or both parser stages are used in the parser.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const fun = bool('fun', ['-f', '--fun'], {defaultValues: ['false']})
const notFun = complement('--not-')(fun)
```

Is the same as:

```js
const fun = bool('fun', ['-f', '--fun'], {defaultValues: ['false']})
const notFun = bool('fun', ['--not-f', '--not-fun'], {reverse: true})
```

</details>
</td>
</tr>
</table>

### Command-Line Parsers

Shargs lets you define command-line parsers with the `parser` function:

```js
const stages = {
  argv: [splitShortOptions],
  opts: [restrictToOnly, cast],
  args: [clearRest]
}

const checks = {
  argv: [],
  opts: [demandACommand],
  args: []
}

const parsers = {}

const deepThought = parser(stages, {checks, parsers})
```

`parser` takes a `stages` object with up to five keys.
Each key is the name of a shargs parsing stage:

1.  [`argv`](#argv-checks) functions modify arrays of command-line arguments.
2.  [`toOpts`](#toOpts-stage) transforms `argv` arrays into the command-line options DSL.
3.  [`opts`](#opts-checks) functions modify command-line options.
4.  [`toArgs`](#toArgs-stage) transforms `opts` into an object holding the parsed arguments.
5.  [`args`](#args-checks) functions modify arguments objects.

As a second parameter, it takes an object with two possible keys:
A `checks` key with `argv`, `opts`, and `args` arrays, and a `parsers` key.
Checks are parser stages that record errors if rules are violated.
`parsers` allows you to specify a different parser for each command.
See the [Command-specific Parsers](#command-specific-parsers) section to learn more.

`parser` applies the stages in the given order.
For each stage, the checks are applied first, followed by the other stages.

#### `argv` Checks

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="verifyArgv">
<td><code><a href="#verifyArgv">verifyArgv</a>(rules)({errs, argv})</code></td>
<td>
Checks, whether the <code>argv</code> adher to a given <code>rules</code> predicate. Records an error if the predicate returns false.
<details>
<summary>
Read on...
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
</table>

#### `argv` Stages

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="splitShortOptions">
<td><code><a href="#splitShortOptions">splitShortOptions</a>({errs, argv})</code></td>
<td>
Splits argument groups of shape <code>-vs</code> to <code>-v -s</code>. Only works if argument groups are preceded by a single dash.
<details>
<summary>
Read on...
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
</table>

#### `opts` Checks

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="contradictOpts">
<td><code><a href="#contradictOpts">contradictOpts</a>({errs, opts})</code></td>
<td>
Checks if no option in <code>opts</code> has <a href="#values"><code>values</code></a> if this option has <code>values</code>.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const opts = [
  number('age', ['-a'], {
    contradicts: ['birthday'],
    defaultValues: [27]
  }),
  string('birthday', ['-b'], {
    contradicts: ['age'],
    defaultValues: ['27.7.1927']
  })
]

contradictOpts({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'Contradiction detected',
      msg:  'Some given keys contradict each other.',
      info: {...}
    },
    {
      code: 'Contradiction detected',
      msg:  'Some given keys contradict each other.',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr name="demandACommand">
<td><code><a href="#demandACommand">demandACommand</a>({errs, opts})</code></td>
<td>
Checks if <code>opts</code> includes at least one command and records an exception if no command is found.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const opts = [
  string('title', ['--title'], {values: ["Hitchhiker Guide"]}),
  numberBool('numBool', ['-n', '--nb'], {values: ['23', 'true']}),
  number('answer', ['-a', '--answer'], {values: ['42']}),
  bool('verbose', ['--verbose'], {values: ['false']}),
  flag('version', ['--version'], {values: [1]})
]

demandACommand({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'Command required',
      msg:  'No command found. Please use at least one command!',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr name="implyOpts">
<td><code><a href="#implyOpts">implyOpts</a>({errs, opts})</code></td>
<td>
Checks if all options in <code>opts</code> also have <a href="#values"><code>values</code></a>, if this option has <code>values</code>.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const opts = [
  number('age', ['-a'], {
    implies: ['birthday'],
    defaultValues: [27]
  }),
  string('birthday', ['-b'], {implies: ['age']})
]

implyOpts({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'Implication violated',
      msg:  'Some given keys that imply each other...',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr name="requireOptions">
<td><code><a href="#requireOptions">requireOptions</a>({errs, opts})</code></td>
<td>
Controls, if options marked with <a href="#required"><code>{required: true}</code></a> have valid <a href="#values"><code>values</code></a>.
If a required option is not present, an error message is recorded.
<details>
<summary>
Read on...
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
      msg:  'A required option has not been provided.',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr name="verifyOpts">
<td><code><a href="#verifyOpts">verifyOpts</a>(rules)({errs, opts})</code></td>
<td>
Checks, whether the <code>opts</code> adher to a given <code>rules</code> predicate.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const implies = (p, q) => !p || q

const rules = opts => implies(
  opts.some(_ => _.key === 'firstName' && _.values),
  opts.some(_ => _.key === 'lastName' && _.values)
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
<tr name="verifyRules">
<td><code><a href="#verifyRules">verifyRules</a>({errs, opts})</code></td>
<td>
Checks, whether the <a href="#rules"><code>rules</code></a> field holds for an option in relation to all options.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const rules = firstName => opts => (
  firstName.values[0] === 'Logan' ||
  opts.some(_ => _.key === 'lastName' && _.values)
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
      msg:  "An option's rules returned false...",
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr name="verifyValuesArity">
<td><code><a href="#verifyValuesArity">verifyValuesArity</a>({errs, opts})</code></td>
<td>
Checks, whether the <a href="#values"><code>values</code></a> of an option fits its <a href="#types"><code>types</code></a>.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const opts = [
  string('name', ['--name'], {values: ['Charles', 'Francis']})
]

verifyValuesArity({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'Invalid arity',
      msg:  "An option's types arity does not match...",
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
</table>

#### `opts` Stages

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="arrayOnRepeat">
<td><code><a href="#arrayOnRepeat">arrayOnRepeat</a>({errs, opts})</code></td>
<td>
<code>arrayOnRepeat</code> changes how repeated calls of command-line arguments are handled by the parser.
Instead of only keeping only the first argument, repeated arguments are assembled in an array.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const obj = {
  opts: [
    {key: 'age', types: ['string'], values: ['42']},
    {key: 'age', types: ['number'], values: [42]}
  ]
}

arrayOnRepeat(obj)
```

Result:

```js
{
  opts: [
    {key: 'age', types: ['string', 'number'], values: ['42', 42]}
  ]
}
```

</details>
</td>
</tr>
<tr name="bestGuessOpts">
<td><code><a href="#bestGuessOpts">bestGuessOpts</a>({errs, opts})</code></td>
<td>
Tries its best to interpret unparsed strings as additional parameters (e.g. <code>{values: ['--foo']}</code> as a flag).
Supports only <a href="#string"><code>string</code></a> and <a href="#flag"><code>flag</code></a> and requires options to follow a pattern:
A single minus and a single character for short options or exactly two minusses with any more characters for long options.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const opts = [
  string('age', ['--age'], {values: ['unknown']}),
  {values: ['--angry']},
  {values: ['--name']},
  {values: ['Logan']},
  {values: ['foo']}
]

bestGuessOpts({opts})
```

Result:

```js
{
  opts: [
    string('age', ['--age'], {values: ['unknown']}),
    flag('angry', [], {values: [1]}),
    string('name', [], {values: ['Logan']}),
    {values: ['foo']}
  ]
}
```

</details>
</td>
</tr>
<tr name="cast">
<td><code><a href="#cast">cast</a>({errs, opts})</code></td>
<td>
Casts all <a href="#values"><code>values</code></a> according to the options' types.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const opts = [
  string('title', ['--title'], {values: ["Hitchhiker Guide"]}),
  numberBool('numBool', ['--nb'], {values: ['23', 'true']}),
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
    string('title', ['--title'], {values: ["Hitchhiker Guide"]}),
    numberBool('numBool', ['--nb'], {values: [23, true]}),
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
<tr name="restrictToOnly">
<td><code><a href="#restrictToOnly">restrictToOnly</a>({errs, opts})</code></td>
<td>
Records an error if the <a href="#values"><code>values</code></a> are not contained in the <a href="#only"><code>only</code></a> list.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const opts = [
  number('answer', ['--answer'], {only: [42], values: [23]})
]

restrictToOnly({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'Value restriction violated',
      msg:  'A value lies outside the allowed values...',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr name="reverseBools">
<td><code><a href="#reverseBools">reverseBools</a>({errs, opts})</code></td>
<td>
Reverses the value of all <a href="#bool"><code>bool</code></a> options annotated with <a href="#reverse"><code>{reverse: true}</code></a>.
Works on string (e.g. <code>['false']</code>) and boolean (e.g. <code>[false]</code>) values.
<details>
<summary>
Read on...
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
<tr name="reverseFlags">
<td><code><a href="#reverseFlags">reverseFlags</a>({errs, opts})</code></td>
<td>
Reverses the value of all <a href="#flag"><code>flag</code></a> options annotated with <a href="#reverse"><code>{reverse: true}</code></a>.
This may be useful if the presence of a flag should imply <code>false</code>.
<details>
<summary>
Read on...
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
<tr name="suggestOptions">
<td><code><a href="#suggestOptions">suggestOptions</a>({errs, opts})</code></td>
<td>
Even if an <code>argv</code> is misspelled (e.g. <code>--aeg</code> instead of <code>--age</code>),
shargs still keeps it as an unknown option (e.g. <code>{values: ['--aeg']}</code>).
The <code>suggestOptions</code> stage collects all unknown options and suggests similar args defined in <code>opts</code>.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const opts = [
  number('age', ['-a', '--age']),
  {values: ['--aeg']}
]

suggestOptions({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'Did you mean',
      msg:  'An unknown command-line argument...',
      info: {
        argv: '--aeg',
        options: [
          [],
          [],
          [{'--age': number('age', ['-a', '--age'])}],
          [{'-a': number('age', ['-a', '--age'])}]
        ]
      }
    }
  ]
}
```

The <code>options</code> array looks a little bit strange, so an explanation is in order.
The array's index is the cost necessary to transform the unknown option in the arguments, represented as keys.
Because of this, you can conveniently work with the results, e.g.:

```js
'Did you mean: ' + (
  options
  .slice(0, 4)
  .reduce((a, b) => a.concat(b))
  .flatMap(Object.keys)
  .join(', ')
)
```

Results in:

```bash
'--age, -a'
```

</details>
</td>
</tr>
</table>

#### `args` Checks

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="failRest">
<td><code><a href="#failRest">failRest</a>({errs, args})</code></td>
<td>
Records an error for each argument in a rest field. E.g. <code>{_: ['foo']}</code> would add an error for <code>foo</code>.
<details>
<summary>
Read on...
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
      msg:  'An unexpected argument was used...',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr name="verifyArgs">
<td><code><a href="#verifyArgs">verifyArgs</a>(rules)({errs, args})</code></td>
<td>
Checks, whether the <code>args</code> adher to a given <code>rules</code> predicate.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const rules = args => (
  typeof args.firstName !== 'undefined' &&
  typeof args.lastName  !== 'undefined'
)

const args = {
  firstName: 'Logan'
}

verifyArgs(rules)({args})
```

Result:

```js
{
  errs: [
    {
      code: 'False args rules',
      msg:  'Your args rules returned false...',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
</table>

#### `args` Stages

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="bestGuessArgs">
<td><code><a href="#bestGuessArgs">bestGuessArgs</a>({errs, args})</code></td>
<td>
Tries its best to interpret strings in the <code>_</code> key as additional parameters.
Supports only <a href="#string"><code>string</code></a> and <a href="#flag"><code>flag</code></a> and requires options to follow a pattern:
A single minus and a single character for short options or exactly two minusses with any more characters for long options.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const obj = {
  args: {
    _: ['--name', 'Logan', 'foo', '-v'],
    foo: 42,
    command: {
      _: ['bar', '-h', '--age', 'unknown', '-h']
    }
  }
}

bestGuessArgs(obj)
```

Result:

```js
{
  args: {
    _: ['foo'],
    name: 'Logan',
    v: {type: 'flag', count: 1},
    foo: 42,
    command: {
      _: ['bar'],
      h: {type: 'flag', count: 2},
      age: 'unknown'
    }
  }
}
```

</details>
</td>
</tr>
<tr name="clearRest">
<td><code><a href="#clearRest">clearRest</a>({errs, args})</code></td>
<td>
Removes all entries from each <code>_</code> key.
<details>
<summary>
Read on...
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
<tr name="flagsAsBools">
<td><code><a href="#flagsAsBools">flagsAsBools</a>({errs, args})</code></td>
<td>
Transforms all count-based <a href="#flag"><code>flag</code></a> options into booleans, that are <code>true</code> if the count is greater than <code>0</code>.
<details>
<summary>
Read on...
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
<tr name="flagsAsNumbers">
<td><code><a href="#flagsAsNumbers">flagsAsNumbers</a>({errs, args})</code></td>
<td>
Transforms all count-based <a href="#flag"><code>flag</code></a> options into numbers, that correspond to the count.
<details>
<summary>
Read on...
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
<tr name="mergeArgs">
<td><code><a href="#mergeArgs">mergeArgs</a>(merge)({errs, args})</code></td>
<td>
Recursively merges args objects of commands into their partent args objects.
Results into a flat object, where no key is an object.
Other <code>merge</code> functions can be given to the function.
<details>
<summary>
Read on...
</summary>

<br />

Example:

```js
const args = {
  _: ['--help'],
  version: {type: 'flag', count: 2},
  name: 'Logan',
  command: {
    _: ['-v'],
    version: {type: 'flag', count: 1},
    name: 'Charles',
    help: true
  },
  verbose: true
}

const mergeLeft = (outer, inner) => ({...inner, ...outer})

mergeArgs(mergeLeft)({args})
```

Result:

```js
{
  args: {
    _: ['--help', '-v'],
    version: {type: 'flag', count: 2},
    name: 'Logan',
    help: true,
    verbose: true
  }
}
```

</details>
</td>
</tr>
<tr name="transformArgs">
<td><code><a href="#transformArgs">transformArgs</a>(fs)({errs, args})</code></td>
<td>
Transforms an args object into a new args object by applying functions <code>fs</code> based on the value type.
All fields of an object are updated independently and previous updates in the same run do not influence later updates.
<details>
<summary>
Read on...
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
  array:     ({key, val, errs, args}) => ({errs, args}),
  boolean:   ({key, val, errs, args}) => ({errs, args}),
  flag:      ({key, val, errs, args}) => ({errs, args}),
  function:  ({key, val, errs, args}) => ({errs, args}),
  null:      ({key, val, errs, args}) => ({errs, args}),
  number:    ({key, val, errs, args}) => ({errs, args}),
  otherwise: ({key, val, errs, args}) => ({errs, args}),
  object:    ({key, val, errs, args}) => ({errs, args}),
  string:    ({key, val, errs, args}) => ({errs, args}),
  undefined: ({key, val, errs, args}) => ({errs, args})
}
```

</details>
</td>
</tr>
</table>

#### `toOpts` Stage

The `toOpts` stage consists only of the <code><a href="#toOpts-stage">toOpts</a>(opts)({errs, argv})</code> function.
It transforms `argv` arrays into the command-line options DSL
by matching the `argv` array with the `args` and `types` defined by the options.
The order of the command-line options is important here, since `toOpts` works from left to right.

While transforming, `toOpts` encounters the following cases:

1.  **A string matches no `args` value:**\
    In this case, `toOpts` returns an unmatched value (e.g. `{values: 'foo'}` if `foo` is the string).
2.  **A string matches an `args` value of exactly one option:**\
    Here, `toOpts` checks the [`types`](#types) arity and reads a matching number of `argv`.
    If too few `argv` are available, it returns an unmatched value.
    If enough `argv` are available, it returns the matching option together with a [`values`](#values) field holding the `argv`.
3.  **A string matches an `args` value in several options:**\
    If this happens, `toOpts` proceeds as in case 2 for each option, with one addition:
    It checks if all options have the same arity as the first option.
    All options with the same arities return the matching option with a [`values`](#values) field.
    For all other options, an error is recorded.

The `toOpts` key of the `stages` field of [`parser`](#command-line-parsers) lets users override the described behavior with their own functions.
Actually doing this is not recommended, as it may break defined parser checks and stages.

#### `toArgs` Stage

Similar to `toOpts`, the `toArgs` stage is just one function: <code><a href="#toArgs-stage">toArgs</a>(parsers)({errs, opts})</code>.
It transforms `opts` arrays into an object holding the parsed arguments
by applying three different stages in order:

1.  **Convert Non-commands:**\
    It converts all options that are not commands, resulting in an object of key-values-pairs.
    The keys and values are taken from the option fields of the same name: [`key`](#key) and [`values`](#values).
    If an option does not have a `values` field, it is not considered, here.
    All unmatched values (e.g. `{values: '--help'}`) are collected in the rest key `_` (e.g. `{_: ['--help']}`).
2.  **Convert Commands:**\
    Next, it converts all [`command`](#command) options.
    In the following, we refer to the parser of this `toArgs` stage as the *parent parser*
    and the command's parser as the *child parser*.

    At this point, the commands' [`values`](#values) fields still holds `argv` arrays
    that need to be processed at least by `toOpts` first, before `toArgs` can handle it.
    Thus, `toArgs` recursively calls a child parser for each command to get `args` objects.

    The `args` objects may have non-empty rest keys (e.g. `{_: ['--help']}`).
    These unmatched arguments may have mistakenly assigned to the child command,
    although they actually belong to the parent.
    Therefore, non-empty rest keys are additionally parsed with the parent parser.
    
    The results of the child parsers and the results of the parent parser run are combined into a shared `args` object.
3.  **Set Default Values:**\
    Up to this point, only options with [`values`](#values) were processed.
    However, options without `values` fields may have [`defaultValues`](#defaultValues).
    This stage sets `values` to those `defaultValues`.

The resulting `args` objects of the three stages are then merged together.

The `toArgs` key of the `stages` field of [`parser`](#command-line-parsers) lets users override the described behavior with their own functions.
Actually doing this is not recommended, as it may break defined parser checks and stages.

#### Command-specific Parsers

Shargs' [`parser`](#command-line-parsers) function may use the `parsers` object
to define a different parser for each [`command`](#command) option.
If `parsers` contains a key that matches a `command`'s key, the value is used as a parser for that command.

If a `command` does not have its own parser, it uses the default parser defined at the `_` field.
The `_` field can be overridden by the user to define a custom default parser.
If left unchanged, it defaults to the parent parser.

#### Custom Checks and Stages

Shargs makes writing and using custom checks and stages very simple.
The only thing you have to do is following the correct function signatures for your check or stage.
In fact, checks and stages of the same kind have the same signatures.
The following code snippets showcase very simple examples with the correct signatures.

Regardless whether you implement a check or a stage, the most important thing to remember is:
Always pass on errors!

Custom `argv` stage example:

```js
function splitShortOptions ({errs = [], argv = []} = {}) {
  const argv2 = argv.flatMap(arg =>
    arg.length > 2 && arg[0] === '-' && arg[1] !== '-'
      ? arg.slice(1).split('').map(c => '-' + c)
      : arg
  )

  return {errs, argv: argv2}
}
```

Custom `opts` stage example:

```js
function demandACommand ({errs = [], opts = []} = {}) {
  const errs2 = []

  const aCommand = opts.some(
    ({types, values}) => types === null && typeof values !== 'undefined'
  )

  if (!aCommand) {
    errs2.push(commandRequired({options: opts}))
  }

  return {errs: errs.concat(errs2), opts}
}
```

Custom `args` stage example:

```js
function flagsAsBools ({errs = [], args = {}} = {}) {
  const fs = {
    flag: ({key, val, errs, args}) => ({
      errs,
      args: {...args, [key]: val.count > 0}
    })
  }

  const {errs: errs2, args: args2} = transformArgs(fs)({args})

  return {errs: errs.concat(errs2), args: args2}
}
```

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
<tr name="br">
<td><code name="brFrom"><a href="#br">br</a>(style)</code><br /><code><a href="#brFrom">brFrom</a>(id)(style)</code></td>
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
<tr name="brs">
<td><code name="brsFrom"><a href="#brs">brs</a>(length)(style)</code><br /><code><a href="#brsFrom">brsFrom</a>(id)(length)(style)</code></td>
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
<tr name="cols">
<td><code name="colsFrom"><a href="#cols">cols</a>(columns)(style)</code><br /><code><a href="#colsFrom">colsFrom</a>(id)(columns)(style)</code></td>
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
<tr name="defs">
<td><code name="defsFrom"><a href="#defs">defs</a>(rowsList)(style)</code><br /><code><a href="#defsFrom">defsFrom</a>(id1, id2)(rowsList)(style)</code></td>
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
<tr name="line">
<td><code name="lineFrom"><a href="#line">line</a>(string)(style)</code><br /><code><a href="#lineFrom">lineFrom</a>(id)(string)(style)</code></td>
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
<tr name="lines">
<td><code name="linesFrom"><a href="#lines">lines</a>(strings)(style)</code><br /><code><a href="#linesFrom">linesFrom</a>(id)(strings)(style)</code></td>
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
<tr name="table">
<td><code name="tableFrom"><a href="#table">table</a>(rowsList)(style)</code><br /><code><a href="#tableFrom">tableFrom</a>(id)(rowsList)(style)</code></td>
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
<tr name="text">
<td><code name="textFrom"><a href="#text">text</a>(string)(style)</code><br /><code><a href="#textFrom">textFrom</a>(id)(string)(style)</code></td>
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
<tr name="texts">
<td><code name="textsFrom"><a href="#texts">texts</a>(strings)(style)</code><br /><code><a href="#textsFrom">textsFrom</a>(id)(strings)(style)</code></td>
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
<tr name="layout">
<td><code><a href="#layout">layout</a>(functions)(style)</code></td>
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
<tr name="layoutMap">
<td><code><a href="#layoutMap">layoutMap</a>(f)(itemsList)(style)</code></td>
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
These two ids are the default used by the layout functions to define, how lines and columns should be printed.
However, any valid key may be used as an id, if it is passed as a string to the `id` parameter of any `*From` function.
A style object may have the following parameters:

<table>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr name="padEnd">
<td><code><a href="#padEnd">padEnd</a></code></td>
<td>number</td>
<td>Defines a padding to the right of a line.</td>
</tr>
<tr name="padStart">
<td><code><a href="#padStart">padStart</a></code></td>
<td>number</td>
<td>Defines a padding to the left of a line.</td>
</tr>
<tr name="width">
<td><code><a href="#width">width</a></code></td>
<td>number</td>
<td>Defines the length of a line before a line break is introduced.</td>
</tr>
</table>

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
<tr name="note">
<td><code name="noteFrom"><a href="#note">note</a>(string)(opts)(style)</code><br /><code><a href="#noteFrom">noteFrom</a>(id)(string)(opts)(style)</code></td>
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
<tr name="notes">
<td><code name="notesFrom"><a href="#notes">notes</a>(strings)(opts)(style)</code><br /><code><a href="#notesFrom">notesFrom</a>(id)(strings)(opts)(style)</code></td>
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
<tr name="optsDefs">
<td><code name="optsDefsFrom"><a href="#optsDefs">optsDefs</a>(opts)(style)</code><br /><code><a href="#optsDefsFrom">optsDefsFrom</a>(id1, id2)(opts)(style)</code></td>
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
<tr name="optsList">
<td><code name="optsListFrom"><a href="#optsList">optsList</a>(opts)(style)</code><br /><code><a href="#optsListFrom">optsListFrom</a>(id)(opts)(style)</code></td>
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
<tr name="space">
<td><code name="spaceFrom"><a href="#space">space</a>(opts)(style)</code><br /><code><a href="#spaceFrom">spaceFrom</a>(id)(opts)(style)</code></td>
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
<tr name="spaces">
<td><code name="spacesFrom"><a href="#spaces">spaces</a>(length)(opts)(style)</code><br /><code><a href="#spacesFrom">spacesFrom</a>(id)(length)(opts)(style)</code></td>
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
<tr name="synopsis">
<td><code name="synopsisFrom"><a href="#synopsis">synopsis</a>(start, end)(opts)(style)</code><br /><code><a href="#synopsisFrom">synopsisFrom</a>(id)(start, end)(opts)(style)</code></td>
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
<tr name="usage">
<td><code><a href="#usage">usage</a>(functions)(opts)(style)</code></td>
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
<tr name="usageMap">
<td><code><a href="#usageMap">usageMap</a>(f)(opts)(style)</code></td>
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
<tr name="justArgs">
<td><code><a href="#justArgs">justArgs</a>(array)(usageFunction)(opts)</code></td>
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
<tr name="noCommands">
<td><code><a href="#noCommands">noCommands</a>(usageFunction)(opts)</code></td>
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
<tr name="onlyCommands">
<td><code><a href="#onlyCommands">onlyCommands</a>(usageFunction)(opts)</code></td>
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
<tr name="onlyFirstArg">
<td><code><a href="#onlyFirstArg">onlyFirstArg</a>(usageFunction)(opts)</code></td>
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
<tr name="optsFilter">
<td><code><a href="#optsFilter">optsFilter</a>(p)(usageFunction)(opts)</code></td>
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
<tr name="optsMap">
<td><code><a href="#optsMap">optsMap</a>(f)(usageFunction)(opts)</code></td>
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

<table>
<tr>
<th>Usage&nbsp;Decorator&nbsp;Combinator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="decorate">
<td><code><a href="#decorate">decorate</a>(decorators)(usageFunction)(opts)</code></td>
<td>Combines several usage decorators to one decorator.</td>
</tr>
</table>

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

## Comparison to Related Libraries

<table>
<tr>
<th>&nbsp;</th>
<th><code><a href="https://www.npmjs.com/package/shargs">shargs</a></code></th>
<th><code><a href="https://www.npmjs.com/package/yargs">yargs</a></code></th>
<th><code><a href="https://www.npmjs.com/package/commander">commander.js</a></code></th>
<th><code><a href="https://www.npmjs.com/package/minimist">minimist</a></code></th>
</tr>
<tr>
<td><b>Self-description</b></td>
<td>Shargs turns command-line arguments parsing inside out and gives you fine-grained control over parser stages and usage docs.</td>
<td>Yargs helps you build interactive command line tools, by parsing arguments and generating an elegant user interface.</td>
<td>The complete solution for node.js command-line interfaces, inspired by Ruby's commander.</td>
<td>Minimist is the guts of optimist's argument parser without all the fanciful decoration.</td>
</tr>
<tr>
<td><b>Focus</b></td>
<td>A command-line parser toolkit with a focus on enabling developers to easily and quickly build their own parsers of just the right size.</td>
<td>A large parser with lots of features with a focus on providing a developer with all the options out of the box.</td>
<td>A medium parser with a strong focus on a textual DSL that makes it easy to define options.</td>
<td>A tiny parser, mostly without an options schema, with a strong focus on optimistic parsing.</td>
</tr>
<td><b>License</b></td>
<td><a href="https://github.com/Yord/shargs/blob/master/LICENSE">MIT</a></td>
<td><a href="https://github.com/yargs/yargs/blob/master/LICENSE">MIT</a></td>
<td><a href="https://github.com/tj/commander.js/blob/master/LICENSE">MIT</a></td>
<td><a href="https://github.com/substack/minimist/blob/master/LICENSE">MIT</a></td>
</tr>
<tr>
<td><b>First Commit</b></td>
<td>14. Jan 2020</td>
<td>10. Sep 2010</td>
<td>14. Aug 2011</td>
<td>25. Jun 2013</td>
</tr>
<tr>
<td><b>Customize Parsing</b></td>
<td>Pick and choose your <a href="#command-line-parsers">parser checks and stages</a>, write and use <a href="#custom-checks-and-stages">custom checks and stages</a>, and optionally define <a href="#command-specific-parsers">command-specific parsers</a>.</td>
<td>You can <a href="https://github.com/yargs/yargs/blob/master/docs/advanced.md#customizing-yargs-parser">turn on and off</a> some of yargs' parsing features, and use a kind of <a href="https://github.com/yargs/yargs/blob/master/docs/advanced.md#middleware">middleware</a> similar to shargs' <code>args</code> stages.</td>
<td>You may specify a function to do <a href="https://github.com/tj/commander.js#custom-option-processing">custom processing of option values</a>.</td>
<td>None that I am aware of.</td>
</tr>
<tr>
<td><b>Customize Usage Docs</b></td>
<td>Use a DSL with many options to build <a href="#usage-documentation">custom usage documentation layouts</a> with fine-grained control over <a href="#style-dsl">styles</a>.</td>
<td>Allows specifying the <a href="https://github.com/yargs/yargs/blob/master/docs/api.md#scriptname0">scriptName</a>, a <a href="https://github.com/yargs/yargs/blob/master/docs/api.md#usagemessagecommand-desc-builder-handler">usage</a> string, an <a href="https://github.com/yargs/yargs/blob/master/docs/api.md#epiloguestr">epilogue</a>, <a href="https://github.com/yargs/yargs/blob/master/docs/api.md#examplecmd-desc">examples</a> as strings, and the number of columns after which to <a href="https://github.com/yargs/yargs/blob/master/docs/api.md#wrapcolumns">wrap</a>.</td>
<td>Display extra information by <a href="https://github.com/tj/commander.js#custom-help">listening to the <code>--help</code> event</a>, customize <a href="https://github.com/tj/commander.js#usage-and-name">program name and usage description</a>, and <a href="https://github.com/tj/commander.js#addhelpcommand">add custom description text</a>.</td>
<td>None that I am aware of.</td>
</tr>
</table>

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
[npm-package]: https://www.npmjs.com/package/shargs
[pxi]: https://github.com/Yord/pxi
[shield-license]: https://img.shields.io/npm/l/shargs?color=yellow&labelColor=313A42
[shield-node]: https://img.shields.io/node/v/shargs?color=red&labelColor=313A42
[shield-npm]: https://img.shields.io/npm/v/shargs.svg?color=orange&labelColor=313A42
[shield-prs]: https://img.shields.io/badge/PRs-welcome-green.svg?labelColor=313A42
[shield-unit-tests-linux]: https://github.com/Yord/shargs/workflows/linux/badge.svg?branch=master
[shield-unit-tests-macos]: https://github.com/Yord/shargs/workflows/macos/badge.svg?branch=master
[shield-unit-tests-windows]: https://github.com/Yord/shargs/workflows/windows/badge.svg?branch=master