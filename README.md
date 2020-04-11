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
$ npm install --save shargs-opts   # opt-in to the type functions DSL
$ npm install --save shargs-parser # opt-in to a big collection of parser functions
$ npm install --save shargs-usage  # opt-in to a big collection of usage functions
```

## Features

Shargs **gives developers as much control over <a href="#command-line-parsers">command-line parsing</a> as possible**.
The advantages are:

+   You get exactly the parser you need, without unnecessary features.
+   You are able to mix in your own problem-specific parser functions.
+   There is no magic going on in the background, everything is explicit.

Following the same approach, shargs offers <a href="#automatic-usage-documentation-generation">automatic usage documentation generation</a>.
The advantages are:

+   You get exactly the usage documentation you need, no unnecessary extras.
+   You have fine-grained control over the documentation layout if you need that.
+   You can write your own layout functions and combine them with existing ones.

Shargs' extensibility and release of control to the developer sets it apart from <a href="#comparison-to-related-libraries">other command-line parsers</a>.

## Getting Started

<details>
<summary>
Describe command-line options:

<p>

```js
const {flag, number, string} = require('shargs-opts')

const opts = [
  string('question', ['-q', '--question'], {desc: 'A question.', required: true}),
  number('answer', ['-a', '--answer'], {desc: 'The answer.', defaultValues: [42]}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
]
```

</p>
</summary>

Shargs provides a DSL for declaring command-line options.
This example uses three different shargs type constructors:
[`string`](#string), [`number`](#number), and [`flag`](#flag).

Type constructors are only syntactic sugar.
In fact, `opts` could have also been written as:

```js
const opts = [
  {key: 'question', types: ['string'], args: ['-q', '--question'], desc: 'A question.', required: true},
  {key: 'answer', types: ['number'], args: ['-a', '--answer'], desc: 'The answer.', defaultValues: [42]},
  {key: 'help', types: [], args: ['-h', '--help'], desc: 'Print this help message and exit.'}
]
```

</details>

<details>
<summary>
Declare a parser:

<p>

```js
const {parser} = require('shargs')
const {cast, flagsAsBools, requireOptions, splitShortOptions} = require('shargs-parser')

const deepThought = parser({
  argv: [splitShortOptions],
  opts: [requireOptions, cast],
  args: [flagsAsBools]
})
```

</p>
</summary>

Parsers have three different stages:
[`argv`](#argv-checks), [`opts`](#opts-checks), and [`args`](#args-checks).
Each stage takes several parser functions that are used to transform input in the order they are defined.
Two special stages transform data between the three stages:
[`toOpts`](#toOpts) and [`toArgs`](#toArgs).
These two stages take exactly one parser function that comes predefined, but can also be passed by the user.

The `deepThought` parser consists of six parser functions that are applied in the following order:

1.  [`splitShortOptions`](#splitShortOptions)
2.  [`toOpts`](#toOpts) (is called after `argv` and before `opts`)
3.  [`requireOptions`](#requireOptions)
4.  [`cast`](#cast)
5.  [`toArgs`](#toArgs) (is called after `opts` and before `args`)
6.  [`flagsAsBools`](#flagsAsBools)

</details>

<details>
<summary>
Layout a usage documentation:

<p>

```js
const {note, optsList, space, synopsis, usage} = require('shargs-usage')

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
Try changing [`optsList`](#optsList) to [`optsDefs`](#optsDefs) later to see what that entails:

```js
const {note, optsDefs, space, synopsis, usage} = require('shargs-usage')

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
  cols: [{width: 25}, {width: 55}]
}
```

</p>
</summary>

Supplying `opts` and a [`style`](#style) to `docs` renders a help text.

```js
const help = docs(opts)(style)
```

The style defines how the help is layouted.
With the current style, the following is rendered:

```bash
deepThought (-q|--question) [-a|--answer] [-h|--help]                           
                                                                                
-q, --question=<string>  A question. [required]                                 
-a, --answer=<number>    The answer. [default: 42]                              
-h, --help               Print this help message and exit.                      
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything.
```

You may experiment with `style` to get the result you like.
E.g. you may want to change the style to the following:

```js
const style = {
  line: {width: 40},
  cols: [{width: 20}, {width: 20}]
}

const help = docs(opts)(style)
```

`help` now reads:

```bash
deepThought (-q|--question)             
            [-a|--answer] [-h|--help]   
                                        
-q,                 A question.         
--question=<string> [required]          
-a,                 The answer.         
--answer=<number>   [default: 42]       
-h, --help          Print this help     
                    message and exit.   
                                        
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
const argv = process.argv.slice(2)

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
{"_": [], "help": true, "question": "What is the answer?", "answer": 5}
```

Note, that `help` is `true`.
Other command-line argument parsers would now display usage documentation for you.
Shargs leaves that to the user, giving him more control.

And since our program reads:
If `args` contains a `help` field, the `help` text is printed...

</details>

<details>
<summary>
Run the <a href="https://github.com/Yord/shargs/blob/master/examples/deepThought.js">program</a> with <code>node deepThought -hq "What is the answer?" -a 5</code> and the following text is printed:

<p>

```bash
deepThought (-q|--question) [-a|--answer] [-h|--help]                           
                                                                                
-q, --question=<string>  A question. [required]                                 
-a, --answer=<number>    The answer. [default: 42]                              
-h, --help               Print this help message and exit.                      
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything.                                             
```

</p>
</summary>

If `help` would not have been `true`, the answer would have been printed.

</details>

If you want to run this example, clone it from the [shargs-example-deepthought][shargs-example-deepthought] repository.

### More Examples

The following repositories contain more examples:

+   [shargs-example-async][shargs-example-async]
+   [shargs-example-deepthought][shargs-example-deepthought]

## 🦈 Shargs

Other command-line parsers are often black boxes that offer very limited control over parsing.
Shargs is a very different beast:
It turns command-line arguments parsing inside out and gives you fine-grained control over parser stages and usage docs.

### Command-Line Options

The most important concept in a command-line parser are command-line options.
They form the basis for [command-line parsers](#command-line-parsers) as well as for [automatically generating usage documentation](#automatic-usage-documentation-generation).
Shargs gives you a simple DSL for defining command-line options:

```js
const {command, flag, number} = require('shargs-opts')

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
<td>An array of unknown length. If <code>fields</code> contains an <a href="#opts"><code>opts</code></a> field, it turns into a command.</td>
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

If you want to write options by hand or write your own type functions, feel free.
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
<td><code>args</code> is an array of strings that may be used to define a command-line option. E.g. <code>['--help', '-h']</code> could be used for a help <code><a href="#flag">flag</a></code> or <code>['-f', '--file']</code> could be used in a <code><a href="#string">string</a></code> option that parses a file path.</td>
</tr>
<tr name="types">
<td><code><a href="#types">types</a></code>*</td>
<td>array of type strings or <code>null</code></td>
<td><code>types</code> is an array of strings that represents the command-line option's type. <code>null</code> describes a <code><a href="#command">command</a></code>, <code>[]</code> describes a <code><a href="#flag">flag</a></code>, arrays with one element either describe a <code><a href="#number">number</a></code> (<code>['number']</code>), a <code><a href="#string">string</a></code> (<code>['string']</code>), or a <code><a href="#bool">bool</a></code> (<code>['bool']</code>), and arrays with more than one element describe an <code><a href="#array">array</a></code> of known size (e.g. <code>['string','number','bool']</code> is an array of size 3).</td>
</tr>
<tr name="contradicts">
<td><code><a href="#contradicts">contradicts</a></code></td>
<td>array of keys</td>
<td><code>contradicts</code> is used by the <code><a href="#contradictOpts">contradictOpts</a></code> stage to specify an array of command-line options identified by their <code><a href="#key">key</a></code> that are incompatible with this command-line option.</td>
</tr>
<tr name="defaultValues">
<td><code><a href="#defaultValues">defaultValues</a></code></td>
<td>array of values</td>
<td><code>defaultValues</code> is used by the <code><a href="#toArgs">toArgs</a></code> parser stage to set default values for command-line options without supplied command-line arguments. For non-<code><a href="#command">command</a></code> options, it takes an array of values, <code>command</code> options may take any value.</td>
</tr>
<tr name="desc">
<td><code><a href="#desc">desc</a></code></td>
<td>string</td>
<td><code>desc</code> is the user-facing description of a command-line option that is used by the <a href="#automatic-usage-documentation-generation">automatic usage documentation generation</a>.</td>
</tr>
<tr name="descArg">
<td><code><a href="#descArg">descArg</a></code></td>
<td>string</td>
<td><code>descArg</code> is the user-facing description of an argument value that is used by the <a href="#automatic-usage-documentation-generation">automatic usage documentation generation</a>.</td>
</tr>
<tr name="implies">
<td><code><a href="#implies">implies</a></code></td>
<td>array of keys</td>
<td><code>implies</code> is used by the <code><a href="#implyOpts">implyOpts</a></code> stage to specify an array of command-line options identified by their <code><a href="#key">key</a></code> that must have <code><a href="#values">values</a></code> or <code><a href="#defaultValues">defaultValues</a></code>, if this command-line option has <code>values</code> or <code><a href="#defaultValues">defaultValues</a></code>.</td>
</tr>
<tr name="only">
<td><code><a href="#only">only</a></code></td>
<td>array of values</td>
<td><code>only</code> is used by the <code><a href="#restrictToOnly">restrictToOnly</a></code> parser stage to validate user input. It takes a non-empty array of values.</td>
</tr>
<tr name="opts">
<td><code><a href="#opts">opts</a></code></td>
<td>array of command-line options</td>
<td><code>opts</code> can be set if the command-line option is a <code><a href="#command">command</a></code> (if <code><a href="#types">types</a></code> is <code>null</code>) to describe the command's options. It uses the same syntax as regular command-line options.</td>
</tr>
<tr name="posArgs">
<td><code><a href="#posArgs">posArgs</a></code></td>
<td>array of positional arguments</td>
<td><code>posArgs</code> is used by the <code><a href="#toArgs">toArgs</a></code> parser stage. It is only interpreted if the command-line option is a <code><a href="#command">command</a></code> (if <code><a href="#types">types</a></code> is <code>null</code>) to describe the command's positional arguments. A positional argument is a special kind of option with the <code><a href="#key">key</a></code> and <code><a href="#types">types</a></code> (both must be given), <code><a href="#required">required</a></code>, and <code><a href="#variadic">variadic</a></code> fields (e.g. <code>{key: 'file', types: ['number'], required: true, variadic: false}</code>). Only the last positional argument may be <code>variadic: true</code> and if an argument is <code>required: true</code>, all prior arguments must be <code>required: true</code> as well.</td>
</tr>
<tr name="required">
<td><code><a href="#required">required</a></code></td>
<td>boolean</td>
<td><code>required</code> is used by <code><a href="#posArgs">posArgs</a></code> and by the <code><a href="#requireOptions">requireOptions</a></code> parser stage to demand an option is set. In case of <code><a href="#requireOptions">requireOptions</a></code>, if a required option has no <code><a href="#values">values</a></code> or <code><a href="#defaultValues">defaultValues</a></code> an error is reported. In case of <code><a href="#posArgs">posArgs</a></code>, if a required positional argument is not found, an error is reported.</td>
</tr>
<tr name="reverse">
<td><code><a href="#reverse">reverse</a></code></td>
<td>boolean</td>
<td><code>reverse</code> is used by the <code><a href="#reverseBools">reverseBools</a></code> and <code><a href="#reverseFlags">reverseFlags</a></code> parser stages and indicates, if a <code><a href="#bool">bool</a></code> or <code><a href="#flag">flag</a></code> should be treated as its reverse.</td>
</tr>
<tr name="rules">
<td><code><a href="#rules">rules</a></code></td>
<td>predicate</td>
<td><code>rules</code> is a predicate applied by <code><a href="#verifyRules">verifyRules</a></code> to check if parsed <code>opts</code> are correct.</td>
</tr>
<tr name="values">
<td><code><a href="#values">values</a></code></td>
<td>array with value(s)</td>
<td><code>values</code> is used by the <code><a href="#toOpts">toOpts</a></code> parser stage to store command-line arguments. This field should not be set by the user. If you need to set default values, use the <code><a href="#defaultValues">defaultValues</a></code> field, instead.</td>
</tr>
<tr name="variadic">
<td><code><a href="#variadic">variadic</a></code></td>
<td>boolean</td>
<td><code>variadic</code> is used in positional arguments (see <code><a href="#posArgs">posArgs</a></code>) to define, whether an argument takes any number of values. If <code>variadic</code> is <code>true</code>, the positional argument's <code><a href="#types">types</a></code> must be <code>null</code>.</td>
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
<details>
<summary>
Transforms a <code><a href="#bool">bool</a></code> or <code><a href="#flag">flag</a></code> option into a complementary option prefixed with a given string (e.g. <code>--no-</code>). The complementary option has the same key as the original option, but reverts the value. Using <code>complement</code> assumes, either the <code><a href="#reverseBools">reverseBools</a></code> or <code><a href="#reverseFlags">reverseFlags</a></code>, or both parser stages are used in the parser.
</summary>

<br />

Example:

```js
const {bool, complement} = require('shargs-opts')

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

Shargs **gives developers as much control over command-line parsing as possible**,
by turning the inner workings of a command-line parser to the outside.
This means:

+   You may build a small parser or a large parser, your choice.
+   You are able to pick and choose the capabilities of your parser.
+   You may implement and add your own [custom checks and stages](#custom-checks-and-stages).
+   You may define [custom parsers](#command-specific-parsers) for each <code>[command](#command)</code>.

Shargs lets you define command-line parsers with the `parser` function:

```js
const {parser} = require('shargs')
const {cast, clearRest, demandACommand, restrictToOnly, splitShortOptions} = require('shargs-parser')

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
const async = false

const deepThought = parser(stages, {checks, parsers, async})
```

`parser` takes a `stages` object with up to five keys.
Stages are functions that change the parser tree and report errors.
Each key is the name of a shargs parsing stage:

1.  [`argv`](#argv-checks) stages modify arrays of command-line arguments.
2.  [`toOpts`](#toOpts-stage) transforms `argv` arrays into the command-line options DSL.
3.  [`opts`](#opts-checks) stages modify command-line options.
4.  [`toArgs`](#toArgs-stage) transforms `opts` into an object holding the parsed arguments.
5.  [`args`](#args-checks) stages modify arguments objects.

As a second parameter, it takes an object with three possible keys:
A `checks` key with `argv`, `opts`, and `args` arrays, a `parsers` key, and an `async` key.
Checks are parser stages that report errors if rules are violated, but do never change the parser tree.
`parsers` allows you to specify a different parser for each command.
See the [Command-specific Parsers](#command-specific-parsers) section to learn more.
If `async` is `true`, `parser` returns a `Promise` and its checks and stages may return `Promises`.

`parser` applies the stages in the given order.
For each stage, the checks are applied first, followed by the stages.

#### `argv` Checks

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="verifyArgv">
<td><code><a href="#verifyArgv">verifyArgv</a>(rules)({errs, argv})</code></td>
<td>
<details>
<summary>
Checks, whether the <code>argv</code> adher to a given <code>rules</code> predicate. Reports an error if the predicate returns false.
</summary>

<br />

Example:

```js
const {verifyArgv} = require('shargs-parser')

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
<tr name="equalsSignAsSpace">
<td><code><a href="#equalsSignAsSpace">equalsSignAsSpace</a>({errs, argv})</code></td>
<td>
<details>
<summary>
<code>equalsSignAsSpace</code> treats arguments of the form <code>--name=Logan</code> as if they were <code>--name Logan</code>.
It only removes the first equals sign in the argument, so <code>--name=Logan=Wolverine</code> becomes <code>--name Logan=Wolverine</code>.
</summary>

<br />

Example:

```js
const {equalsSignAsSpace} = require('shargs-parser')

const argv = ['--name=Logan']

equalsSignAsSpace({argv})
```

Result:

```js
{
  argv: ['--name', 'Logan']
}
```

</details>
</td>
</tr>
<tr name="shortOptsNoSpace">
<td><code><a href="#shortOptsNoSpace">shortOptsNoSpace</a>({errs, argv})</code></td>
<td>
<details>
<summary>
<code>shortOptsNoSpace</code> allows arguments like <code>-nLogan</code> to be interpreted as <code>-n Logan</code>.
You may either use <code>shortOptsNoSpace</code>, or <code><a href="#splitShortOptions">splitShortOptions</a></code>, but not both at the same time.
</summary>

<br />

Example:

```js
const {shortOptsNoSpace} = require('shargs-parser')

const argv = ['-nLogan']

shortOptsNoSpace({argv})
```

Result:

```js
{
  argv: ['-n', 'Logan']
}
```

</details>
</td>
</tr>
<tr name="splitShortOptions">
<td><code><a href="#splitShortOptions">splitShortOptions</a>({errs, argv})</code></td>
<td>
<details>
<summary>
Splits argument groups of shape <code>-vs</code> to <code>-v -s</code>. Only works if argument groups are preceded by a single dash.
You may either use <code>splitShortOptions</code>, or <code><a href="#shortOptsNoSpace">shortOptsNoSpace</a></code>, but not both at the same time.
</summary>

<br />

Example:

```js
const {splitShortOptions} = require('shargs-parser')

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
<tr name="traverseArgv">
<td><code><a href="#traverseArgv">traverseArgv</a>(p)(f)({errs,opts})</code></td>
<td>
<details>
<summary>
<code>traverseArgv</code> applies a function <code>f</code> to each arg that satisfies a predicate <code>p</code>.
It does not change the order of <code>argv</code> in the process.
<code>p</code> takes an arg string and returns a boolean.
<code>f</code> takes three arguments, an arg string, the index of the arg, and the argv array,
and returns an <code>{errs = [], argv = []}</code> object.
Most of the other <code>argv</code> checks and stages are defined in terms of <code>traverseArgv</code>.
</summary>

<br />

Example:

```js
const {traverseArgv} = require('shargs-parser')

const argv = [
  '--age=42',
  '--help'
]

const hasEqualsSign = arg => arg.indexOf('=') > -1

const replaceFirstEqualsSign = arg => ({
  argv: [
    arg.slice(0, arg.indexOf('=')),
    arg.slice(arg.indexOf('=') + 1)
  ]
})

traverseArgv(hasEqualsSign)(replaceFirstEqualsSign)({argv})
```

Result:

```js
{
  argv: [
    '--age', '42',
    '--help'
  ]
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
<details>
<summary>
Verifies that no option in the <code><a href="#contradicts">contradicts</a></code> field of an option has <code><a href="#values">values</a></code> if the option has <code>values</code>.
</summary>

<br />

Example:

```js
const {contradictOpts} = require('shargs-parser')
const {number, string} = require('shargs-opts')

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
<details>
<summary>
Checks if <code>opts</code> includes at least one <code><a href="#command">command</a></code> and reports an exception if no command is found.
</summary>

<br />

Example:

```js
const {demandACommand} = require('shargs-parser')
const {array, bool, flag, number, string} = require('shargs-opts')
const numberBool = array(['number', 'bool'])

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
<details>
<summary>
Checks if all options in the <code><a href="#implies">implies</a></code> of an option also have <code><a href="#values">values</a></code>, if the option has <code>values</code>.
</summary>

<br />

Example:

```js
const {implyOpts} = require('shargs-parser')
const {number, string} = require('shargs-opts')

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
<details>
<summary>
Controls, if options marked with <code><a href="#required">{required: true}</a></code> have valid <code><a href="#values">values</a></code> or <code><a href="#defaultValues">defaultValues</a></code>.
If a required option is not present, an error message is reported.
</summary>

<br />

Example:

```js
const {requireOptions} = require('shargs-parser')
const {number} = require('shargs-opts')

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
<details>
<summary>
Checks, whether the <code>opts</code> adher to a given <code>rules</code> predicate.
</summary>

<br />

Example:

```js
const {verifyOpts} = require('shargs-parser')
const {string} = require('shargs-opts')

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
<details>
<summary>
Checks, whether the <code><a href="#rules">rules</a></code> field of an option holds in relation to all options.
</summary>

<br />

Example:

```js
const {verifyRules} = require('shargs-parser')
const {string} = require('shargs-opts')

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
<details>
<summary>
Checks, whether the <code><a href="#values">values</a></code> and <code><a href="#defaultValues">defaultValues</a></code> of an option fits its <code><a href="#types">types</a></code>.
</summary>

<br />

Example:

```js
const {verifyValuesArity} = require('shargs-parser')
const {string} = require('shargs-opts')

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
<details>
<summary>
<code>arrayOnRepeat</code> changes how repeated calls of command-line arguments are handled by the parser.
Instead of keeping only the first argument, repeated arguments are collected in an array.
</summary>

<br />

Example:

```js
const {arrayOnRepeat} = require('shargs-parser')

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
<details>
<summary>
Tries its best to interpret unparsed strings as additional parameters (e.g. <code>{values: ['--foo']}</code> as a flag).
Supports only <code><a href="#string">string</a></code> and <code><a href="#flag">flag</a></code> and requires options to follow a pattern:
A single minus and a single character for short options or exactly two minusses with any more characters for long options.
</summary>

<br />

Example:

```js
const {bestGuessOpts} = require('shargs-parser')

const opts = [
  {key: 'age', types: ['string'], args: ['--age'], values: ['unknown']},
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
    {key: 'age', types: ['string'], args: ['--age'], values: ['unknown']},
    {key: 'angry', types: [], args: [], values: [1]},
    {key: 'name', types: ['string'], args: [], values: ['Logan']},
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
<details>
<summary>
Casts all <code><a href="#values">values</a></code> according to the options' types.
</summary>

<br />

Example:

```js
const {cast} = require('shargs-parser')
const {array, bool, command, flag, number, string} = require('shargs-opts')
const numberBool = array(['number', 'bool'])

const opts = [
  string('title', ['--title'], {values: ["Hitchhiker Guide"]}),
  numberBool('numBool', ['--nb'], {values: ['23', 'true']}),
  number('answer', ['-a', '--answer'], {values: ['42']}),
  command('help', ['-h', '--help'], {values: ['--foo', 'bar']}),
  bool('verbose', ['--verbose'], {values: ['false']}),
  flag('version', ['--version'], {values: {type: 'flag', count: 1}})
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
    command('help', ['-h', '--help'], {values: ['--foo', 'bar']}),
    bool('verbose', ['--verbose'], {values: [false]}),
    flag('version', ['--version'], {values: {type: 'flag', count: 1}})
  ]
}
```

</details>
</td>
</tr>
<tr name="restrictToOnly">
<td><code><a href="#restrictToOnly">restrictToOnly</a>({errs, opts})</code></td>
<td>
<details>
<summary>
Reports an error if an option's <code><a href="#values">values</a></code> are not contained in the <code><a href="#only">only</a></code> list.
</summary>

<br />

Example:

```js
const {restrictToOnly} = require('shargs-parser')
const {number} = require('shargs-opts')

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
<details>
<summary>
Reverses the value of all <code><a href="#bool">bool</a></code> options annotated with <code><a href="#reverse">{reverse: true}</a></code>.
Works on string (e.g. <code>['false']</code>) and boolean (e.g. <code>[false]</code>) values.
</summary>

<br />

Example:

```js
const {reverseBools} = require('shargs-parser')
const {bool} = require('shargs-opts')

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
<details>
<summary>
Reverses the value of all <code><a href="#flag">flag</a></code> options annotated with <code><a href="#reverse">{reverse: true}</a></code>.
This may be useful if the presence of a flag should imply <code>false</code>.
</summary>

<br />

Example:

```js
const {reverseFlags} = require('shargs-parser')
const {flag} = require('shargs-opts')

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
<details>
<summary>
Even if an <code>argv</code> is misspelled (e.g. <code>--aeg</code> instead of <code>--age</code>),
shargs still keeps it as an unknown option (e.g. <code>{values: ['--aeg']}</code>).
The <code>suggestOptions</code> stage collects all unknown options and suggests similar args defined in <code>opts</code>.
</summary>

<br />

Example:

```js
const {suggestOptions} = require('shargs-parser')
const {number} = require('shargs-opts')

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
Did you mean: --age, -a
```

</details>
</td>
</tr>
<tr name="traverseOpts">
<td><code><a href="#traverseOpts">traverseOpts</a>(p)(f)({errs,opts})</code></td>
<td>
<details>
<summary>
<code>traverseOpts</code> applies a function <code>f</code> to each option that satisfies a predicate <code>p</code>.
It does not change the order of options in the process.
<code>p</code> takes a command-line option and returns a boolean.
<code>f</code> takes three arguments, a command-line option, the index of the option, and the <code>opts</code> array,
and returns an <code>{errs = [], opts = []}</code> object.
Most of the other <code>opts</code> checks and stages are defined in terms of <code>traverseOpts</code>.
</summary>

<br />

Example:

```js
const {traverseOpts} = require('shargs-parser')

const opts = [
  {key: 'age', types: ['number'], values: ['42']},
  {key: 'verbose', types: [], values: [1]},
  {key: 'help', types: [], values: [1]}
]

const isFlag = _ => Array.isArray(_.types) && _.types.length === 0

const reverseFlags = opt => ({
  opts: [
    {...opt, values: [-opt.values[0]]}
  ]
})

traverseOpts(isFlag)(reverseFlags)({opts})
```

Result:

```js
{
  opts: [
    {key: 'age', types: ['number'], values: ['42']},
    {key: 'verbose', types: [], values: [-1]},
    {key: 'help', types: [], values: [-1]}
  ]
}
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
<details>
<summary>
Reports an error for each argument in a rest field. E.g. <code>{_: ['foo']}</code> would add an error for <code>foo</code>.
</summary>

<br />

Example:

```js
const {failRest} = require('shargs-parser')

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
<details>
<summary>
Checks, whether the <code>args</code> adher to a given <code>rules</code> predicate.
</summary>

<br />

Example:

```js
const {verifyArgs} = require('shargs-parser')

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
<details>
<summary>
Tries its best to interpret strings in the <code>_</code> key as additional parameters.
Supports only <code><a href="#string">string</a></code> and <code><a href="#flag">flag</a></code> and requires options to follow a pattern:
A single minus and a single character for short options or exactly two minusses with any more characters for long options.
</summary>

<br />

Example:

```js
const {bestGuessArgs} = require('shargs-parser')

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
<tr name="bestGuessCast">
<td><code><a href="#bestGuessCast">bestGuessCast</a>({errs, args})</code></td>
<td>
<details>
<summary>
<code>bestGuessCast</code> tries its best to transform strings into other types.
</summary>

<br />

Example:

```js
const {bestGuessCast} = require('shargs-parser')

const args = {
  _: ['--name', 'Logan'],
  str1: 'yay',
  num1: '42.3',
  num2: '123e-1',
  num3: '0x11',
  num4: '0b11',
  bool1: 'true',
  arr1: ['-42', 'true', 'yay'],
  obj: {
    num5: '0o11',
    num6: '-Infinity',
    num7: '',
    num8: null,
    bool2: 'false',
    bool3: undefined
  }
}

bestGuessCast({args})
```

Result:

```js
{
  args: {
    _: ['--name', 'Logan'],
    str1: 'yay',
    num1: 42.3,
    num2: 12.3,
    num3: 17,
    num4: 3,
    bool1: true,
    arr1: [-42, true, 'yay'],
    obj: {
      num5: 9,
      num6: -Infinity,
      num7: '',
      num8: null,
      bool2: false,
      bool3: undefined
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
<details>
<summary>
Removes all entries from each <code>_</code> key.
</summary>

<br />

Example:

```js
const {clearRest} = require('shargs-parser')

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
<details>
<summary>
Transforms all count-based <code><a href="#flag">flag</a></code> options into booleans, that are <code>true</code> if the count is greater than <code>0</code> and <code>false</code> otherwise.
</summary>

<br />

Example:

```js
const {flagsAsBools} = require('shargs-parser')

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
<details>
<summary>
Transforms all count-based <code><a href="#flag">flag</a></code> options into numbers, that correspond to the count.
</summary>

<br />

Example:

```js
const {flagsAsNumbers} = require('shargs-parser')

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
<details>
<summary>
Recursively merges args objects of <code><a href="#command">command</a></code>s into their partent args objects.
Results into a flat object, where no key is an object.
Other <code>merge</code> functions may be given to the function.
If the <code>merge</code> parameter is left undefined, fields from the parent object are preferred
and the rest field `_` is concatenated.
</summary>

<br />

Example:

```js
const {mergeArgs} = require('shargs-parser')

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

const mergeLeft = (outer, inner) => ({
  ...inner,
  ...outer,
  _: [
    ...(outer._ || []),
    ...(inner._ || [])
  ]
})

mergeArgs(mergeLeft)({args})
```

Result:

```js
{
  args: {
    _: ['--help'],
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
<tr name="traverseArgs">
<td><code><a href="#traverseArgs">traverseArgs</a>(fs)({errs, args})</code></td>
<td>
<details>
<summary>
Transforms an args object into a new args object by applying functions <code>fs</code> based on the value type.
All fields of an object are updated independently and previous updates in the same run do not influence later updates.
Many <code>args</code> checks and stages are implemented in terms of <code>traverseArgs</code>.
</summary>

<br />

Example:

```js
const {traverseArgs} = require('shargs-parser')

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

traverseArgs(fs)({args})
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

#### Command-specific Parsers

Shargs' [`parser`](#command-line-parsers) function may use the `parsers` object
to define a different parser for each [`command`](#command) option.
If `parsers` contains a key that matches a `command`'s key, the value is used as a parser for that command.

If a `command` does not have its own parser, it uses the default parser defined at the `_` field.
The `_` field can be overridden by the user to define a custom default parser.
If left unchanged, it defaults to the parent parser.

#### Advanced Parsers

More in-depth information regarding parsers can be found in the [advanced command-line parsers](#advanced-command-line-parsers) section:

+   [`toOpts` stage documentation](#toOpts-stage)
+   [`toArgs` stage documentation](#toArgs-stage)
+   [Custom checks and stages](#custom-checks-and-stages)
+   [Relation between checks and stages](#relation-between-checks-and-stages)

### Automatic Usage Documentation Generation

Shargs offers a highly configurable variant of automatic usage documentation generation,
with the goal to **give developers as much control over the layout as possible**.
This means:

+   You may define your own usage documentation layout using shargs' [usage](#automatic-usage-documentation-generation) and [layout](#layout-functions) funtions.
+   You may provide your own [styles](#style) and control the number of columns on a component basis.
+   You are able to easily mix in [your own layout](#custom-layout-functions) and [your own usage](#custom-usage-functions) functions.
+   You may decide to not opt-in to shargs' approach and roll your own usage documentation.

Defining your own usage documentation layout is as simple as:

```js
const {note, space, synopsis, optsList, usage} = require('shargs-usage')

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

Here, `docs` is a declarative description of a usage documentation using shargs usage functions.
The `synopsis` gives a high level overview over all possible arguments
and the `optsList` lists all options with more details.

Shargs provides the following usage functions:

<table>
<tr>
<th>Usage&nbsp;Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="note">
<td><code name="noteFrom"><a href="#note">note</a>(string)(opts)(style)</code><br /><code><a href="#noteFrom">noteFrom</a>(id)(string)(opts)(style)</code></td>
<td>
<details>
<summary>
Prints the <code>string</code> as a <code><a href="#line">line</a></code>.
Takes the line width from <a href="#style">style</a> and pads with spaces at the end.
If the string is too long to fit the <code>line</code>'s width, it is broken up into words, and all remaining words are put into another <code>line</code>.
</summary>

<br />

```js
const {noteFrom} = require('shargs-usage')

const note = noteFrom('line')
```

Example:

```js
const {note} = require('shargs-usage')

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
Prints several strings using <code><a href="#note">note</a></code> for each.
</summary>

<br />

```js
const {notesFrom} = require('shargs-usage')

const notes = notesFrom('line')
```

Example:

```js
const {notes} = require('shargs-usage')

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
Prints a <code><a href="#defs">defs</a></code> (definitions) list,
with the command-line option <code><a href="#args">args</a></code> as title and the <code><a href="#desc">desc</a></code> field as text.
</summary>

<br />

```js
const {optsDefsFrom} = require('shargs-usage')

const optsDefs = optsDefsFrom('line', 'desc')
```

Example:

```js
const {optsDefs} = require('shargs-usage')
const {flag, number} = require('shargs-opts')

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
-a, --answer=<number>                   
    The answer.                         
-h, --help                              
    Prints help.                        
--version                               
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
Prints a <code><a href="#table">table</a></code> with two columns:
The command-line option's <code><a href="#args">args</a></code> in the left,
and the <code><a href="#desc">desc</a></code> field in the right column.
</summary>

<br />

```js
const {optsListFrom} = require('shargs-usage')

const optsList = optsListFrom('cols')
```

Example:

```js
const {optsList} = require('shargs-usage')
const {flag, number} = require('shargs-opts')

const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'Prints version.'})
]

const style = {
  cols: [
    {width: 30},
    {width: 25}
  ]
}

optsList(opts)(style)
```

Result:

```bash
-a, --answer=<number>         The answer.              
-h, --help                    Prints help.             
--version                     Prints version.          
```

</details>
</td>
</tr>
<tr name="space">
<td><code name="spaceFrom"><a href="#space">space</a>(opts)(style)</code><br /><code><a href="#spaceFrom">spaceFrom</a>(id)(opts)(style)</code></td>
<td>
<details>
<summary>
Introduces a single blank <code><a href="#line">line</a></code>.
</summary>

<br />

```js
const {spaceFrom} = require('shargs-usage')

const space = spaceFrom('line')
```

Example:

```js
const {note, space} = require('shargs-usage')

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
Introduces several blank <code><a href="#lines">lines</a></code> with the number defined by the <code>length</code> parameter.
</summary>

<br />

```js
const {spacesFrom} = require('shargs-usage')

const spaces = spacesFrom('line')
```

Example:

```js
const {note, spaces} = require('shargs-usage')

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
<td><code name="synopsisFrom"><a href="#synopsis">synopsis</a>(programName)(opts)(style)</code><br /><code><a href="#synopsisFrom">synopsisFrom</a>(id)(start, end)(opts)(style)</code></td>
<td>
<details>
<summary>
Prints a synopsis:
The <code>programName</code> is printed first, followed by the command-line options' <code><a href="#args">args</a></code>.
</summary>

<br />

```js
const {synopsisFrom} = require('shargs-usage')

const synopsis = synopsisFrom('cols')
```

Example:

```js
const {synopsis} = require('shargs-usage')
const {flag, number} = require('shargs-opts')

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

#### Usage Combinators

Several usage functions may be combined to form a new usage function.
Combinators let you build more complex components from simple components, like e.g.:

```js
const {layout, text, usageMap} = require('shargs-usage')

const simpleOptsDesc = usageMap(
  opt => layout([
    text(opt.args.join(', ')),
    text(opt.desc)
  ])
)
```

`simpleOptsDesc` prints a `text` with a comma-separated list of [`args`](#args) followed by the [`desc`](#desc) for each option in `opts`.
The [`layout`](#layout) and [`text`](#text) functions are introduced below in the section on [layout functions](#layout-functions).
The following usage combinators are available:

<table>
<tr>
<th>Usage&nbsp;Combinator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="usage">
<td><code><a href="#usage">usage</a>(functions)(opts)(style)</code></td>
<td>
<details>
<summary>
Groups several usage functions together.
</summary>

<br />

Example:

```js
const {note, optsList, space, synopsis, usage} = require('shargs-usage')
const {flag, number} = require('shargs-opts')

const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'Prints version.'})
]

const style = {
  line: {width: 40},
  cols: [{width: 20}, {width: 20}]
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
                                        
-a,                 The answer.         
--answer=<number>                       
-h, --help          Prints help.        
--version           Prints version.     
                                        
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
Takes an <code>opts</code> (options) list and a function <code>f</code>,
which is applied to each option and is expected to return a <a href="#layout-functions">layout function</a>.
</summary>

<br />

Example:

```js
const {layout, text, textFrom, usageMap} = require('shargs-usage')
const {flag, number} = require('shargs-opts')

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

#### Usage Decorators

Sometimes you want to pass only a portion of the command-line options to a usage function.
Shargs has usage decorators for that:

```js
const {note, space, synopsis, usage} = require('shargs-usage')
const {decorate, noCommands, onlyCommands, onlyFirstArg} = require('shargs-usage')

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

`decoratedDocs` displays [`commands`](#commands) in a separate component than other command-line options
by using the `onlyCommands` and `noCommands` decorators to filter relevant options.
Shargs provides the following usage decorators:

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
const {justArgs} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')

const style = {
  cols: [{width: 20}, {width: 20}]
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
-a,                 The answer          
--answer=<number>                       
-h, --help          Prints help         
```

</details>
</td>
</tr>
<tr name="noCommands">
<td><code><a href="#noCommands">noCommands</a>(usageFunction)(opts)</code></td>
<td>
<details>
<summary>
Filters out all <code><a href="#command">commands</a></code> from <code>opts</code>.
</summary>

<br />

Example:

```js
const {noCommands} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')

const style = {
  cols: [{width: 20}, {width: 20}]
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
-a,                 The answer          
--answer=<number>                       
--version           Prints version      
```

</details>
</td>
</tr>
<tr name="onlyCommands">
<td><code><a href="#onlyCommands">onlyCommands</a>(usageFunction)(opts)</code></td>
<td>
<details>
<summary>
Keeps only <code><a href="#command">commands</a></code> in <code>opts</code>.
</summary>

<br />

Example:

```js
const {onlyCommands} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')

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
Keeps only the first <code><a href="#args">arg</a></code> from each opt.
</summary>

<br />

Example:

```js
const {onlyFirstArg} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')

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
-a <number> The answer                  
-h          Prints help                 
--version   Prints version              
```

</details>
</td>
</tr>
<tr name="optsFilter">
<td><code><a href="#optsFilter">optsFilter</a>(p)(usageFunction)(opts)</code></td>
<td>
<details>
<summary>
Applies array's filter method to the <code>opts</code> array using a predicate <code>p</code>.
</summary>

<br />

Example:

```js
const {optsFilter} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')

const style = {
  cols: [{width: 20}, {width: 20}]
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
-a,                 The answer          
--answer=<number>                       
--version           Prints version      
```

</details>
</td>
</tr>
<tr name="optsMap">
<td><code><a href="#optsMap">optsMap</a>(f)(usageFunction)(opts)</code></td>
<td>
<details>
<summary>
Applies array's map method to the <code>opts</code> array using a function <code>f</code>.
</summary>

<br />

Example:

```js
const {optsMap} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')

const style = {
  cols: [{width: 20}, {width: 20}]
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
-a <number>         The answer          
-h                  Prints help         
--version           Prints version      
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
<td>Combines several usage decorators to one decorator. See the example at the <a href="#usage-decorators">begin of this section</a>.</td>
</tr>
</table>

#### Layout Functions

Usage functions are written in a lower level markup language for formatting text in the terminal called layout functions.
The `deepThought ask` documentation could be written as follows in layout syntax:

```js
const {br, layout, table, text} = require('shargs-usage')

const askDocs = layout([
  text('deepThought ask (-q|--question) [-h|--help]'),
  br,
  table([
    ['-q, --question=<string>', 'A question. [required]'],
    ['-h, --help', 'Print this help message and exit.']
  ]),
  br,
  text(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

If you just want to define a usage documentation, you do not need to know about layout functions.
They only come into play, if you want to write your own usage functions.

Shargs provides the following layout functions:

<table>
<tr>
<th>Layout&nbsp;Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
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
const {brFrom} = require('shargs-usage')

const br = brFrom('line')
```

Example:

```js
const {br, layout, line} = require('shargs-usage')

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
Introduces several blank lines with the number defined by the <code>length</code> parameter.
</summary>

<br />

```js
const {brsFrom} = require('shargs-usage')

const brs = brsFrom('line')
```

Example:

```js
const {brs, layout, line} = require('shargs-usage')

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
Takes a list of <code>columns</code> with each column consisting of several strings.
Prints the first column at the left and the last column at the right.
The <a href="#style">style</a> parameter must have a <code>cols</code> id with a number of style objects equal to the number of columns.
If a column string is longer than a column's width, it is cut off.
</summary>

<br />

```js
const {colsFrom} = require('shargs-usage')

const cols = colsFrom('cols')
```

Example:

```js
const {cols} = require('shargs-usage')

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
Prints the title as a <code><a href="#text">text</a></code> before printing the desc as a <code>text</code>.
Title and text may be assigned different <a href="#style">style</a> ids.
</summary>

<br />

```js
const {defsFrom} = require('shargs-usage')

const defs = defsFrom('line', 'desc')
```

Example:

```js
const {defs} = require('shargs-usage')

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
Prints the <code>string</code> with a linebreak at the end.
Takes the line width from <a href="#style">style</a> and pads with spaces at the end.
If the string is too long to fit the line's width, it is cut off.
</summary>

<br />

```js
const {lineFrom} = require('shargs-usage')

const line = lineFrom('line')
```

Example:

```js
const {line} = require('shargs-usage')

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
Prints several strings using the <code><a href="#line">line</a></code> function for each.
</summary>

<br />

```js
const {linesFrom} = require('shargs-usage')

const lines = linesFrom('line')
```

Example:

```js
const {lines} = require('shargs-usage')

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
Takes a <code>rowsList</code> with each row holding a number of strings equal to the number of table columns.
The <a href="#style">style</a> parameter must have a <code>cols</code> key with a number of style objects equal to the number of columns.
The strings in each row are formatted according to the defined columns.
If a string surpasses the width of a column, its remaining words are printed in the following rows.
</summary>

<br />

```js
const {tableFrom} = require('shargs-usage')

const table = tableFrom('cols')
```

Example:

```js
const {table} = require('shargs-usage')

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
Text acts much like <code><a href="#line">line</a></code>, but does not cut off strings that surpass a line's width.
Instead, it splits the string by words and adds new <code><a href="#line">lines</a></code> with the remaining words.
</summary>

<br />

```js
const {textFrom} = require('shargs-usage')

const text = textFrom('line')
```

Example:

```js
const {text} = require('shargs-usage')

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
Takes several <code>strings</code> and applies the <code><a href="#text">text</a></code> function to each.
</summary>

<br />

```js
const {textsFrom} = require('shargs-usage')

const texts = textsFrom('line')
```

Example:

```js
const {texts} = require('shargs-usage')

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

#### Layout Combinators

Like usage functions, several layout functions may be combined into more complex layout functions using layout combinators.
`textsFrom` is a good example:

```js
const {layoutMap, textFrom} = require('shargs-usage')

const textsFrom = id => layoutMap(textFrom(id))
```

Shargs provides the following layout combinators:

<table>
<tr>
<th>Layout&nbsp;Combinator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="layout">
<td><code><a href="#layout">layout</a>(functions)(style)</code></td>
<td>
<details>
<summary>
Groups several <a href="#layout-functions">layout functions</a> together and lets them share one <code><a href="#style">style</a></code> definition.
</summary>

<br />

Example:

```js
const {layout, line} = require('shargs-usage')

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
Takes a list of values and a function <code>f</code>,
which is applied to each string and is expected to return a <a href="#layout-functions">layout function</a>.
The strings are then formatted according to <code>f</code>.
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
const {layout, layoutMap, text, textFrom} = require('shargs-usage')

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
const {layoutMap, line} = require('shargs-usage')

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

#### Style

Usage styles are applied to [usage](#automatic-usage-documentation-generation) and [layout](#layout-functions) functions to format the generated text snippets.
Styles may define the [`width`](#width), [`padStart`](#padStart), and [`padEnd`](#padEnd) of the different parts of your usage documentation.
A minimum definition of `style` for `deepThought` may be:

```js
const style = {
  line: {width: 80},
  cols: [{width: 20}, {width: 60}]
}
```

`style` defines style objects for two ids: `line` and `cols`.
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

#### Advanced Usage Documentation

More in-depth information regarding usage documentation is available in the [advanced usage generation](#advanced-usage-generation) section:

+   [Custom usage functions](#custom-usage-functions)
+   [Custom layout functions](#custom-layout-functions)

### Combining Options, Parser, and Usage Documentation

You may now use the [command-line options](#command-line-options), the [parser](#command-line-parsers), and the [usage documentation](#automatic-usage-documentation-generation) in your program:

```js
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

If the program is executed with `node deepThought -ha 42 ask -q "What is the answer to everything?"`,
the following text is printed to the command-line:

```bash
deepThought [-a] [-h]                                                           
                                                                                
ask                                                                             
Just ask.                                                                       
                                                                                
-a, --answer=<42>   The (default) answer.                                       
-h, --help          Print this help message and exit.                           
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything.                                             
```

## Advanced Topics

The [shargs](#-shargs) section does not have enough room for going into every single detail.
This is what advanced topics are for.

### Advanced Command-line Parsers

The [`parser`](#command-line-parsers) function has lots of options the [command-line parsers](#command-line-parsers) could not talk about.
The following sections shed some light on these options.

#### `toOpts` Stage

The `toOpts` stage consists only of the <code><a href="#toOpts-stage">toOpts</a>(opts)({errs, argv})</code> function.
It transforms `argv` arrays into the [command-line options syntax](#command-line-options)
by matching the `argv` array with the [`args`](#args) and [`types`](#types) defined by the options.
The order of the command-line options plays an important role, since `toOpts` works from left to right.

While transforming, `toOpts` encounters the following cases:

1.  **A string matches no `args` value:**\
    In this case, `toOpts` returns an unmatched value (e.g. `{values: 'foo'}` if `foo` is the string).
2.  **A string matches an `args` value of exactly one option:**\
    Here, `toOpts` checks the [`types`](#types) arity and reads a matching number of `argv`.
    If too few `argv` are available, it returns an unmatched value like in case 1.
    If enough `argv` are available, it returns the matching option together with a [`values`](#values) field holding the `argv`.
3.  **A string matches an `args` value in several options:**\
    If this happens, `toOpts` proceeds as in case 2 for each option, with one addition:
    It checks if all options have the same arity as the first option.
    All options with the same arities are added a [`values`](#values) field.
    For all other options, an error is reported.

The `toOpts` key of the `stages` argument of the [`parser`](#command-line-parsers) function lets users override the described behavior with their own functions.
Do this with caution, as it may break defined parser checks and stages.

#### `toArgs` Stage

Similar to [`toOpts`](#toOpts), the `toArgs` stage takes just one function: <code><a href="#toArgs-stage">toArgs</a>(parsers)({errs, opts})</code>.
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

    The commands' [`values`](#values) fields still holds `argv` arrays
    that need to be processed by a parser.
    Thus, `toArgs` recursively calls a child parser for each command to get `args` objects.

    Then, non-empty rest keys (e.g. `{_: ['/tmp']}`) are parsed for positional arguments.
    For a more detailed description of positional arguments, see the [`posArgs`](#posArgs) options field.

    At this point, the `args` objects may still have non-empty rest keys (e.g. `{_: ['--help']}`).
    These unmatched arguments may have mistakenly assigned to the child command,
    although they actually belong to the parent.
    Therefore, non-empty rest keys are additionally parsed with the parent parser.
    See the [relation between checks and stages](#relation-between-checks-and-stages) section for details.
    
    The results of the child parsers and the results of the parent parser run are combined into a shared `args` object.
3.  **Set Default Values:**\
    Up to this point, only options with [`values`](#values) were processed.
    However, options without `values` fields may still have [`defaultValues`](#defaultValues).
    This stage sets the `values` of options without `values` to the `defaultValues`.

The resulting `args` objects of the three stages are then merged together.

The `toArgs` key of the `stages` argument of the [`parser`](#command-line-parsers) function lets users override the described behavior with their own functions.
Do this with caution, as it may break defined parser checks and stages.

#### Custom Checks and Stages

Shargs makes writing and using custom checks and stages very simple.
The only thing you have to do is to follow the correct function signatures for your check or stage.
In fact, checks and stages of the same kind have the same signatures.
The following code snippets showcase very simple examples with the correct signatures.

Regardless of whether you implement a check or a stage, the most important thing to remember is:
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

If you write a custom `argv` stage, have a look at [`traverseArgv`](#traverseArgv)!

Custom `opts` stage example:

```js
function demandACommand ({errs = [], opts = []} = {}) {
  const errs2 = []

  const aCommand = opts.some(
    ({types, values}) => types === null && typeof values !== 'undefined'
  )

  if (!aCommand) {
    errs2.push({
      code: 'Command required',
      msg:  'No command found. Please use at least one command!',
      info: {options: opts}
    })
  }

  return {errs: errs.concat(errs2), opts}
}
```

If you write a custom `opts` stage, have a look at [`traverseOpts`](#traverseOpts)!

Custom `args` stage example:

```js
const {traverseArgs} = require('shargs-usage')

function flagsAsBools ({errs = [], args = {}} = {}) {
  const fs = {
    flag: ({key, val, errs, args}) => ({
      errs,
      args: {...args, [key]: val.count > 0}
    })
  }

  const {errs: errs2, args: args2} = traverseArgs(fs)({args})

  return {errs: errs.concat(errs2), args: args2}
}
```

If you write a custom `args` stage, have a look at [`traverseArgs`](#traverseArgs)!

#### Relation Between Checks and Stages

As you may have noticed by now, checks and stages of the same kind have the same signatures.
This is not a coincidence.
In fact, checks and stages behave the same for most scenarios.
This section looks at the cases where they are different.

While stages change data and report errors once, checks only report errors and never change data.
Thus, if a check is run several times in a row, it is guaranteed to report multiple error messages.
Stages and checks are seldomly run several times, but there is a case in the [`toArgs`](#toargs-stage) stage, where this happens:

`toArgs` takes a list of parsers as its input, including the *parent parser* `__` that is set by the [`parser`](#command-line-parsers) function.
The parent parser's purpose is to parse any leftover argv from the commands' *child parsers*.
This comes to pass, if arguments to a parent command are given after the arguments of a child command, e.g. `--answer 42` in:

```bash
node deepThought ask --question "What is the Answer?" --answer 42
# 1:             |p|
# 2:                 |-------------------- c -------------------|
# 3:                                                  |---(p)---|
```

In row 1, the parent parser `p` reads the `ask` [`command`](#command) and interprets all following argv as parameters of `ask`.
Thus, as depicted in row 2, from `--question` onwards, `ask`'s child parser `c` is responsible for parsing up to `42`.
However, as row 3 suggests, the `--answer 42` argv are actually a parent's option and the child parser will not recognize them.

To solve situations like this, all unrecognized argv from child parsers are again processed by their parent's parsers.
This means, **parent parsers may run several times and their checks may be repeated**.
Since checks do not change any data, repeating them is not harmful.
However, it may result in duplicated error messages, which is undesirable.

Because of this, shargs and the [`parser`](#command-line-parsers) function distinguishes between checks and stages
and each parent parser `__` only includes the `parser`'s stages and not its checks. 

Repeated `parser` calls only occur in the presence of `command` options.
This means, if you do not use `command` options, you do not need to separate checks and stages.
In such cases, you may safely add your checks to `parser`'s stages parameter.

### Advanced Usage Generation

The [automatic usage documentation generation](#automatic-usage-documentation-generation) section had to leave out some more advanced topics.
These topics are covered here.

#### Custom Layout Functions

Using your own layout function is straightforward:
Your function only has to have the correct signature and it is ready to be used as a layout function:
It must take a [`style` object](#style) and return a `string`.

The following example showcases the custom `table2` layout function that takes `columns` instead of `rows` as input:

```js
const {table} = require('shargs-usage')

const table2 = (columns = []) => style => {
  const rows = []

  for (let i = 0; i < columns[0].length; i++) {
    const row = []
    for (let j = 0; j < columns.length; j++) {
      row.push(columns[j][i])
    }
    rows.push(row)
  }

  return table(rows)(style)
}
```

You may use `table2` as a layout function if you apply it to a `columns` array,
since that returns a function that takes a `style` argument and returns a `string`.

This is of course a very simplified example that makes many assumptions that are often not valid
and should not be made in real projects.
Your own function would most probably need much more validations and handling of edge cases.

#### Custom Usage Functions

Writing and using custom usage functions in shargs is very simple:
You only have to write a function with the correct signature and it can be used as a usage function.
It must take an [`opts`](#command-line-options) array and a [`style` object](#style) and return a `string`.

The following example shows the custom `descs` function that displays the options' descriptions:

```js
const {texts} = require('shargs-usage')

const descs = opts => style => {
  const descriptions = opts.map(_ => _.desc)

  return texts(descriptions)(style)
}
```

Using [`usageMap`](#usageMap) simplifies the process of defining your own functions:

```js
const {table, usageMap} = require('shargs-usage')

const optsTable = usageMap(
  ({key, args, required, desc}) => table([
    [(required ? '*' : '') + key, args.join(', '), desc]
  ])
)
```

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
<td>January 14th 2020</td>
<td>September 10th 2010</td>
<td>August 14th 2011</td>
<td>June 25th 2013</td>
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
<td>Use a DSL with many options to build <a href="#automatic-usage-documentation-generation">custom usage documentation layouts</a> with fine-grained control over <a href="#style">styles</a>.</td>
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
[shargs-example-async]: https://github.com/Yord/shargs-example-async
[shargs-example-deepthought]: https://github.com/Yord/shargs-example-deepthought
[shield-license]: https://img.shields.io/npm/l/shargs?color=yellow&labelColor=313A42
[shield-node]: https://img.shields.io/node/v/shargs?color=red&labelColor=313A42
[shield-npm]: https://img.shields.io/npm/v/shargs.svg?color=orange&labelColor=313A42
[shield-prs]: https://img.shields.io/badge/PRs-welcome-green.svg?labelColor=313A42
[shield-unit-tests-linux]: https://github.com/Yord/shargs/workflows/linux/badge.svg?branch=master
[shield-unit-tests-macos]: https://github.com/Yord/shargs/workflows/macos/badge.svg?branch=master
[shield-unit-tests-windows]: https://github.com/Yord/shargs/workflows/windows/badge.svg?branch=master