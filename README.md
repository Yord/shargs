🦈 shargs (**sh**ell **args**) is a highly customizable command-line arguments parser and usage documentation generator.

[![node version][shield-node]][node]
[![npm version][shield-npm]][npm-package]
[![license][shield-license]][license]
[![PRs Welcome][shield-prs]][contribute]
[![linux unit tests status][shield-unit-tests-linux]][actions]
[![macos unit tests status][shield-unit-tests-macos]][actions]
[![windows unit tests status][shield-unit-tests-windows]][actions]

## Installation

<pre>
npm install --save <a href="https://github.com/Yord/shargs">shargs</a>
npm install --save <a href="https://github.com/Yord/shargs-opts">shargs-opts</a>   # opt-in to type functions for <a href="#command-line-options">command-line options</a>
npm install --save <a href="https://github.com/Yord/shargs-parser">shargs-parser</a> # opt-in to a standard library of <a href="#command-line-parsers">parser functions</a>
npm install --save <a href="https://github.com/Yord/shargs-usage">shargs-usage</a>  # opt-in to a standard library of <a href="#automatic-usage-documentation-generation">usage functions</a>
</pre>

## Features

Shargs **gives developers as much control over [command-line parsing](#command-line-parsers) as possible**.
The advantages are:

+   You get exactly the parser you need, without unnecessary features.
+   You are able to mix in your own problem-specific parser functions.
+   There is no magic going on in the background, everything is explicit.

Following the same approach, shargs offers
[automatic usage documentation generation](#automatic-usage-documentation-generation).
The advantages are:

+   You get exactly the usage documentation you need, no unnecessary extras.
+   You have fine-grained control over the documentation layout if you need that.
+   You can write your own layout functions and combine them with existing ones.

Shargs also has general qualities:

+   It has a synchronous as well as an asynchronous mode based on Promises.
+   It is well documented, extensively tested, modular, and highly extensible.
+   It has Typescript type declarations, and zero runtime dependencies.

Shargs' flexibility and adaptability sets it apart from
[other command-line parser libraries](#comparison-to-related-libraries).

## Quickstart

<details>
<summary>
Describe your command-line program and options:

<p>

```js
const {flag, number, program, stringPos} = require('shargs-opts')

const opts = [
  stringPos('question', {desc: 'Ask a question.', required: true}),
  number('answer', ['-a', '--answer'], {desc: 'The answer.', defaultValues: [42]}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
]

const script = program('deepThought', opts, {desc: 'Ask the Ultimate Question.'})
```

</p>
</summary>

Read up on the details in the [command-line options](#command-line-options) section.

</details>

<details>
<summary>
Declare a parser by choosing from 30+ parser stages:

<p>

```js
const {parser} = require('shargs')
const {cast, flagsAsBools, requireOpts, splitShortOpts} = require('shargs-parser')

const deepThought = parser({
  argv: [splitShortOpts],
  opts: [requireOpts, cast],
  args: [flagsAsBools]
})
```

</p>
</summary>

The [parser function](#the-parser-function)
and [command-line parsers](#command-line-parsers) sections have all the details.

</details>

<details>
<summary>
Layout a usage documentation:

<p>

```js
const {desc, optsList, space, synopsis, usage} = require('shargs-usage')

const docs = usage([
  synopsis,
  space,
  optsList,
  space,
  desc
])
```

</p>
</summary>

See the [automatic usage documentation generation](#automatic-usage-documentation-generation) section.

</details>

<details>
<summary>
Style the usage documentation:

<p>

```js
const style = {
  line: [{width: 80}],
  cols: [{width: 25}, {width: 55}]
}
```

</p>
</summary>

The [style](#style) section provides more details.

</details>

<details>
<summary>
Use the parser and the usage documentation in your program:

<p>

```js
const argv = process.argv.slice(2)

const {errs, args} = deepThought(script)(argv)

if (args.help) {
  const help = docs(script)(style)
  console.log(help)
} else if (errs.length > 0) {
  errs.forEach(({code, msg}) => console.log(`${code}: ${msg}`))
} else {
  console.log(JSON.stringify(args, null, 2))
}
```

</p>
</summary>

Find out more in the [writing programs with shargs](#writing-programs-with-shargs) section.

</details>

<details>
<summary>
Run your program with <code>node ./deepThought --help</code>:

<p>

```bash
deepThought (<question>) [-a|--answer] [-h|--help]                              
                                                                                
<question>               Ask a question. [required]                             
-a, --answer=<number>    The answer. [default: 42]                              
-h, --help               Print this help message and exit.                      
                                                                                
Ask the Ultimate Question.                                                      
```

</p>
</summary>

The [automatic usage documentation generation](#automatic-usage-documentation-generation)
and [writing programs with shargs](#writing-programs-with-shargs) sections have more.

</details>

<details>
<summary>
Run your program with <code>node ./deepThought "What is the meaning of Life, the Universe, and Everything?"</code>:

<p>

```js
{
  errs: [],
  args: {
    _: [],
    answer: 42,
    question: 'What is the meaning of Life, the Universe, and Everything?'
  }
}
```

</p>
</summary>

Read the [parser function](#the-parser-function) and [writing programs with shargs](#writing-programs-with-shargs) 
sections for more.

</details>

<details>
<summary>
Run your program with <code>node ./deepThought -a 23</code>:

<p>

```bash
Required option is missing: An option that is marked as required has not been provided.
```

</p>
</summary>

See the [error codes](#error-codes) sections for a reference of all error codes.

</details>

### More Examples

+   [shargs-example-async][shargs-example-async]
+   [shargs-example-deepthought][shargs-example-deepthought]

## Getting Started

Shargs is not a command-line parser, but a library for building command-line parsers.
Parsers build with shargs can be tiny or huge, strict or best guess, extensively checked or not checked at all:
You decide!

`shargs` is the core library of an ecosystem of modules and does exactly one thing:
It gives you the `parser` function that composes parsers from a list of parser stages.
Each parser stage is a small step in the transformation of argument values (`process.argv`)
to command-line options (`opts`) and finally to an object of parsed arguments (`args`):

```js
const {parser} = require('shargs')

const deepThought = parser({argv: [], opts: [], args: []})
```

Although not fancy, `deepThought` from the example is already a working command-line parser.
The empty `argv`, `opts`, and `args` arrays mark extension points, where parser stages may be plugged in.

While you are encouraged to write your own parser stages,
most of the time you get along by picking and choosing common ones from the `shargs-parser` module:

```js
const {parser} = require('shargs')
const {cast, flagsAsBools, requireOpts, splitShortOpts} = require('shargs-parser')

const deepThought = parser({
  argv: [splitShortOpts],
  opts: [requireOpts, cast],
  args: [flagsAsBools]
})
```

This version of `deepThought` does more advanced stuff:

1.  It splits short option groups: e.g. `-cvzf` is transformed to `-c -v -z -f`.
2.  It checks if all required options are set.
3.  It casts strings to other types, like numbers or booleans.
4.  It treats command-line flags as booleans.

Note that we did not tell `parser` how exactly to do those things.
Everything is nice and declarative, and the details are hidden away in the parser stages.

At this point we have decided on the capabilities of our parser.
We should now talk about what exactly we wish to parse:

```js
const {flag, number, program, stringPos} = require('shargs-opts')

const opts = [
  stringPos('question', {desc: 'Ask a question.', required: true}),
  number('answer', ['-a', '--answer'], {desc: 'The answer.', defaultValues: [42]}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
]

const script = program('deepThought', opts, {desc: 'Ask the Ultimate Question.'})
```

The `'deepThought'` script should have three command-line options:

1.  A `required` string positional argument named `question`.
2.  An `answer` number option specified with `-a` or `--answer` that should default to `42` if not given.
3.  A `help` command-line flag given by `-h` or `--help`.

We used the `shargs-opts` module to get a nice DSL for describing our options.
However, we could have also written them out as objects ourselves or could have used a different DSL.

Next, we tell our parser about the options:

```js
const parse = deepThought(script)
```

We may now use the `parse` function to transform `process.argv` arrays:

```js
const argv = process.argv.slice(2)

const {errs, args} = parse(argv)
```

If `argv` is `['-a', '5', 'What is the meaning of Life, the Universe, and Everything?']`,
`args` would be:

```js
{
  _: [],
  answer: 5,
  question: 'What is the meaning of Life, the Universe, and Everything?'
}
```

Now it would be nice if our users would have a usage documentation to look up which command-line options are available.
This is what the `--help` flag is for, after all.

How about a documentation following this layout:

```js
const {desc, optsList, space, synopsis, usage} = require('shargs-usage')

const docs = usage([
  synopsis,
  space,
  optsList,
  space,
  desc
])
```

We can use `shargs-usage` to automatically generate a usage documentation based on command-line option definitions
(e.g. `script` from before).
The module provides components generally found in usage documentations of popular tools, like:

1.  A `synopsis`, summarizing available options: e.g. `deepThought (<question>) [-a|--answer] [-h|--help]`.
2.  An options list (`optsList`), describing option details in a tabular format.

Note that `shargs-usage` is declarative:
We only specify what components our usage documentation should have.
The details on how exactly those components transform command-line options into text is hidden away.

We may now generate and print a usage documentation for `script`:

```js
const usageText = docs(script)

const style = {
  line: [{width: 80}],
  cols: [{width: 25}, {width: 55}]
}

const help = usageText(style)

console.log(help)
```

First, we tell `docs` about our command-line options.
Then, we decide to `style` the documentation with a `width` of `80` characters per `line`.
The `optsList` table's two `cols` should be `25` and `55` characters in `width`.

Let's print `help` to the terminal:

```bash
deepThought (<question>) [-a|--answer] [-h|--help]                              
                                                                                
<question>               Ask a question. [required]                             
-a, --answer=<number>    The answer. [default: 42]                              
-h, --help               Print this help message and exit.                      
                                                                                
Ask the Ultimate Question.                                                      
```

At this point you have seen the core of what shargs does.
Some topics like `commands`, command-specific and asynchronous parsers,
and many more parser stages and usage functions are yet to come.
They are described in detail in the following sections.

## Documentation

This documentation encompasses four different shargs modules:

1.  [`shargs-opts`][shargs-opts] is documented in [Command-line Options](#command-line-options).
2.  [`shargs`][shargs] is documented in [The `parser` Function](#the-parser-function).
3.  [`shargs-parser`][shargs-parser] is documented in [Command-line Parsers](#command-line-parsers).
4.  [`shargs-usage`][shargs-usage] is documented in [Automatic Usage Documentation Generation](#automatic-usage-documentation-generation).

### Command-line Options

Command-line options are the most important concept in shargs.
They are the basis for its two main features:
[Command-line parsers](#command-line-parsers)
and [automatic usage documentation generation](#automatic-usage-documentation-generation).

Shargs defines many different types of command-line options represented by objects following certain rules:

<table>
<tr>
<th>Type</th>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Interface&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Rules</th>
</tr>
<tr name="flag-option">
<td><a href="#flag-option">Flag Option</a></td>
<td><code>{<a href="#key">key</a>, <a href="#args">args</a>, <a href="#types">types</a>: []}</code></td>
<td>
<code><a href="#key">key</a></code> and <code><a href="#args">args</a></code> must be defined.
<code><a href="#types">types</a></code> must be an empty array.
</td>
</tr>
<tr name="primitive-option">
<td><a href="#primitive-option">Primitive Option</a></td>
<td><code>{<a href="#key">key</a>, <a href="#args">args</a>, <a href="#types">types</a>: [_]}</code></td>
<td>
<code><a href="#key">key</a></code> and <code><a href="#args">args</a></code> must be defined.
<code><a href="#types">types</a></code> must be an array of length 1 with a string representing a type.
</td>
</tr>
<tr name="array-option">
<td><a href="#array-option">Array Option</a></td>
<td><code>{<a href="#key">key</a>, <a href="#args">args</a>, <a href="#types">types</a>: [_, _, ...]}</code></td>
<td>
<code><a href="#key">key</a></code> and <code><a href="#args">args</a></code> must be defined.
<code><a href="#types">types</a></code> must be an array of at least length 2 with strings representing its types.
</td>
</tr>
<tr name="variadic-option">
<td><a href="#variadic-option">Variadic Option</a></td>
<td><code>{<a href="#key">key</a>, <a href="#args">args</a>}</code></td>
<td>
<code><a href="#key">key</a></code> and <code><a href="#args">args</a></code> must be defined.
<code><a href="#types">types</a></code> must be <code>undefined</code>.
</td>
</tr>
<tr name="command-option">
<td><a href="#command-option">Command Option</a></td>
<td><code>{<a href="#key">key</a>, <a href="#args">args</a>, <a href="#opts">opts</a>}</code></td>
<td>
<code><a href="#key">key</a></code> and <code><a href="#args">args</a></code> must be defined.
<code><a href="#types">types</a></code> must be <code>undefined</code>
and <code><a href="#opts">opts</a></code> must be defined.
</td>
</tr>
<tr name="primitive-pos-arg">
<td><a href="#primitive-pos-arg">Primitive Positional Argument</a></td>
<td><code>{<a href="#key">key</a>, <a href="#types">types</a>: [_]}</code></td>
<td>
<code><a href="#key">key</a></code> must be defined
and <code><a href="#args">args</a></code> must be <code>undefined</code>.
<code><a href="#types">types</a></code> must be an array of length 1 with a string representing a type.
</td>
</tr>
<tr name="array-pos-arg">
<td><a href="#array-pos-arg">Array Positional Argument</a></td>
<td><code>{<a href="#key">key</a>, <a href="#types">types</a>: [_, _, ...]}</code></td>
<td>
<code><a href="#key">key</a></code> must be defined
and <code><a href="#args">args</a></code> must be <code>undefined</code>.
<code><a href="#types">types</a></code> must be an array of at least length 2 with strings representing its types.
</td>
</tr>
<tr name="variadic-pos-arg">
<td><a href="#variadic-pos-arg">Variadic Positional Argument</a></td>
<td><code>{<a href="#key">key</a>}</code></td>
<td>
<code><a href="#key">key</a></code> must be defined
and <code><a href="#args">args</a></code> must be <code>undefined</code>.
<code><a href="#types">types</a></code> must be <code>undefined</code>.
</td>
</tr>
<tr name="program-pos-arg">
<td><a href="#program-pos-arg">Program Positional Argument</a></td>
<td><code>{<a href="#key">key</a>, <a href="#opts">opts</a>}</code></td>
<td>
<code><a href="#key">key</a></code> must be defined,
<code><a href="#args">args</a></code> and <code><a href="#types">types</a></code> must be <code>undefined</code>,
and <code><a href="#opts">opts</a></code> must be defined.
</td>
</tr>
<tr name="rest">
<td><a href="#rest">Rest</a></td>
<td><code>{<a href="#values">values</a>}</code></td>
<td>
<code><a href="#key">key</a></code> must be <code>undefined</code>.
<code><a href="#values">values</a></code> must be an array of length 1 with a string representing an unparsed value.
</td>
</tr>
</table>

Since writing objects following these rules by hand can be tedious,
[`shargs-opts`][shargs-opts] gives you a nice and simple type-based DSL for defining valid command-line options:

```js
const {command, flag, number, program} = require('shargs-opts')

const opts = [
  command(askOpts)('ask', ['ask'], {required: true, desc: 'Ask a question.'}),
  number('answer', ['-a', '--answer'], {defaultValues: [42], desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
]

const script = program('deepThought', opts, {
  desc: 'Deep Thought was created to come up with the Answer to ' +
        'The Ultimate Question of Life, the Universe, and Everything.'
})
```

In the example, using the type functions [`command`](#command), [`number`](#number), [`flag`](#flag),
and [`program`](#program) guarantees the generation of valid objects.

#### Type Functions

The following type functions are available:

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Type&nbsp;Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="array">
<td>
<code name="arrayPos"><a href="#array">array</a>(types)(key, args, fields)</code><br />
<code><a href="#arrayPos">arrayPos</a>(types)(key, fields)</code>
</td>
<td>
<details>
<summary>
<code>array</code> generates an <a href="#array-option">array option</a>,
while <code>arrayPos</code> generates an <a href="#array-pos-arg">array positional argument</a>.
These types represent arrays whose length is known in advance.
The closely related <code><a href="#variadic">variadic</a></code>
and <code><a href="#variadicPos">variadicPos</a></code> represent arrays with unknown lengths.
</summary>

<br />

`array` returns the following object:

```js
const array = types => (key, args, fields) => ({
  key, args, types, ...fields
})
```

`arrayPos` returns the following object:

```js
const arrayPos = types => (key, fields) => ({
  key, types, ...fields
})
```

</details>
</td>
</tr>
<tr name="bool">
<td>
<code name="boolPos"><a href="#bool">bool</a>(key, args, fields)</code><br />
<code><a href="#boolPos">boolPos</a>(key, fields)</code>
</td>
<td>
<details>
<summary>
<code>bool</code> generates a <a href="#primitive-option">primitive option</a>,
while <code>boolPos</code> generates a <a href="#primitive-pos-arg">primitive positional argument</a>.
These types represent boolean values that may be <code>'true'</code> or <code>'false'</code>.
Note that the values are represented as strings and you may want to <code><a href="#cast">cast</a></code> them.
If you need more values representing <code>'true'</code> (e.g. <code>'t'</code>, <code>'yes'</code>)
or <code>'false'</code> (e.g. <code>'F'</code>, <code>'no'</code>),
have a look at <code><a href="#broadenBools">broadenBools</a></code>.
If you want to treat a value as its <code><a href="#reverse">reverse</a></code>,
see <code><a href="#reverseBools">reverseBools</a></code>.
If you need <code><a href="#flag">flag</a></code>s instead of <code>bool</code>s, have a look at the
<code><a href="#boolAsFlag">boolAsFlag</a></code> and <code><a href="#boolsAsFlags">boolsAsFlags</a></code> 
parser stages.
</summary>

<br />

`bool` returns the following object:

```js
const bool = (key, args, fields) => ({
  key, args, types: ['bool'], ...fields
})
```

`boolPos` returns the following object:

```js
const boolPos = (key, fields) => ({
  key, types: ['bool'], ...fields
})
```

</details>
</td>
</tr>
<tr name="command">
<td>
<code name="program"><a href="#command">command</a>(opts)(key, args, fields)</code><br />
<code><a href="#program">program</a>(key, opts, fields)</code>
</td>
<td>
<details>
<summary>
<code>command</code> generates a <a href="#command-option">command option</a>,
while <code>program</code> generates a <a href="#program-pos-arg">program positional argument</a>.
These types represent command-line programs like <code>git commit</code> or <code>git push</code>,
where a <i>parent</i> program (<code>git</code>) has different <i>child</i> commands
(<code>commit</code> and <code>push</code>) for specific tasks.
<code>command</code>'s and <code>program</code>'s <code><a href="#opts">opts</a></code> fields
are arrays of command-line options used to parse their <code><a href="#values">values</a></code>.
Commands may have their own <a href="#parsers">command-specific parsers</a>
or are parsed by their parent <code>program</code>'s or <code>command</code>'s parser.
<code>program</code> or <code>command</code> values are either terminated by the end of the input or by <code>--</code>.
</summary>

<br />

`command` returns the following object:

```js
const command = opts => (key, args, fields) => ({
  key, args, opts, ...fields
})
```

`program` returns the following object:

```js
const program = (key, opts, fields) => ({
  key, opts, ...fields
})
```

</details>
</td>
</tr>
<tr name="flag">
<td><code><a href="#flag">flag</a>(key, args, fields)</code></td>
<td>
<details>
<summary>
<code>flag</code> generates a <a href="#flag-option">flag option</a>.
This type represents command-line options that stand for themselves and take no value.
Shargs counts the number of times a <code>flag</code> occurs
(e.g. <code>{verbose: {type: 'flag', count: 3}}</code>), so a <code>flag</code> may be amplified by repeating it.
If you don't need counts and prefer numbers or boolean values, have a look at the
<code><a href="#flagAsBool">flagAsBool</a></code>, <code><a href="#flagAsNumber">flagAsNumber</a></code>,
<code><a href="#flagsAsBools">flagsAsBools</a></code> and <code><a href="#flagsAsNumbers">flagsAsNumbers</a></code> 
parser stages.
If you need the presence of a <code>flag</code> to imply negativity (e.g. <code>--no-fun</code>),
see <code><a href="#complement">complement</a></code>,
<code><a href="#reverse">reverse</a></code> and <code><a href="#reverseFlags">reverseFlags</a></code>.
</summary>

<br />

`flag` returns the following object:

```js
const flag = (key, args, fields) => ({
  key, args, types: [], ...fields
})
```

</details>
</td>
</tr>
<tr name="number">
<td>
<code name="numberPos"><a href="#number">number</a>(key, args, fields)</code><br />
<code><a href="#numberPos">numberPos</a>(key, fields)</code>
</td>
<td>
<details>
<summary>
<code>number</code> generates a <a href="#primitive-option">primitive option</a>,
while <code>numberPos</code> generates a <a href="#primitive-pos-arg">primitive positional argument</a>.
These types represent JavaScript numbers.
Numbers are represented as strings and you may want to <code><a href="#cast">cast</a></code> them.
If you need <code><a href="#flag">flag</a></code>s instead of <code>number</code>s, have a look at the
<code><a href="#numberAsFlag">numberAsFlag</a></code> and <code><a href="#numbersAsFlags">numbersAsFlags</a></code> 
parser stages.
</summary>

<br />

`number` returns the following object:

```js
const number = (key, args, fields) => ({
  key, args, types: ['number'], ...fields
})
```

`numberPos` returns the following object:

```js
const numberPos = (key, fields) => ({
  key, types: ['number'], ...fields
})
```

</details>
</td>
</tr>
<tr name="string">
<td>
<code name="stringPos"><a href="#string">string</a>(key, args, fields)</code><br />
<code><a href="#stringPos">stringPos</a>(key, fields)</code>
</td>
<td>
<details>
<summary>
<code>string</code> generates a <a href="#primitive-option">primitive option</a>,
while <code>stringPos</code> generates a <a href="#primitive-pos-arg">primitive positional argument</a>.
These types represent strings.
</summary>

<br />

`string` returns the following object:

```js
const string = (key, args, fields) => ({
  key, args, types: ['string'], ...fields
})
```

`stringPos` returns the following object:

```js
const stringPos = (key, fields) => ({
  key, types: ['string'], ...fields
})
```

</details>
</td>
</tr>
<tr name="variadic">
<td>
<code name="variadicPos"><a href="#variadic">variadic</a>(key, args, fields)</code><br />
<code><a href="#variadicPos">variadicPos</a>(key, fields)</code>
</td>
<td>
<details>
<summary>
<code>variadic</code> generates a <a href="#variadic-option">variadic option</a>,
while <code>variadicPos</code> generates a <a href="#variadic-pos-arg">variadic positional argument</a>.
These types represent arrays whose length is not known in advance.
An <code>opts</code> array can have at most one <a href="#variadic-pos-arg">variadic positional argument</a>
and no other positional arguments (<code>*Pos</code>) may be defined after it.
The closely related <code><a href="#array">array</a></code>
and <code><a href="#arrayPos">arrayPos</a></code> represent arrays with known lengths
and <code><a href="#command">command</a></code> is essentially
a <code>variadic</code> with an <code><a href="#opts">opts</a></code> field.
A <code>variadic</code>'s or <code>variadicPos</code>' values are either terminated by the end of the input
or by <code>--</code>.
</summary>

<br />

`variadic` returns the following object:

```js
const variadic = (key, args, fields) => ({
  key, args, ...fields
})
```

`variadicPos` returns the following object:

```js
const variadicPos = (key, fields) => ({
  key, ...fields
})
```

</details>
</td>
</tr>
</table>

If you wish to write out command-line options by hand, or write your own DSLs for creating them, feel free.
Command-line options use the following syntax:

```js
const askOpts = [
  {key: 'format', args: ['--format'], types: ['string'], only: ['json', 'xml'], defaultValues: ['json'],
   desc: 'Respond either with json or xml.'},
  {key: 'html', args: ['--no-html'], types: [], reverse: true, desc: 'Remove HTML tags.'},
  {key: 'help', args: ['-h', '--help'], types: [], desc: 'Print this help message and exit.'},
  {key: 'question', types: ['string'], required: true, desc: 'State your question.'}
]
```

Apart from [`key`](#key), [`args`](#args), [`types`](#types), [`opts`](#opts), and [`values`](#values)
that you have already seen and that determine an option's type,
command-line option objects may be given any other <code>fields</code>,
that may be used to provide information to parser stages
(e.g. [`only`](#only), [`reverse`](#reverse)),
or to provide descriptions for usage documentation generation
(e.g. <code><a href="#desc">desc</a></code>, <code><a href="#descArg">descArg</a></code>).
If you wish to write your own parser stages, go ahead and define your own fields.

A very useful property of command-line option definitions is, that they are valid JSON.
This enables use cases like reading an API's option definitions from HTTPS,
or swapping out definitions on the fly.

#### Option Fields

The following fields are used by [`shargs`][shargs], [`shargs-parser`][shargs-parser] stages
or [`shargs-usage`][shargs-usage] functions:

<table>
<tr>
<th>Field</th>
<th>&nbsp;&nbsp;&nbsp;&nbsp;Value&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>

<tr name="args">
<td><code><a href="#args">args</a></code></td>
<td>array of strings</td>
<td>
<code>args</code> defines argument names for command-line options.
E.g. <code>['-h', '--help']</code> could be used for a help <code><a href="#flag">flag</a></code>
or <code>['ask']</code> could be used for a <code><a href="#command">command</a></code>.
Positional arguments must not have an <code>args</code> field,
as they are not given by argument, but by their position.
</td>
</tr>
<tr name="contradicts">
<td><code><a href="#contradicts">contradicts</a></code></td>
<td>array of <code><a href="#key">key</a></code>s</td>
<td>
<code>contradicts</code> defines what <code><a href="#key">key</a></code>s an option is incompatible with.
This information is used by the <code><a href="#contradictOpts">contradictOpts</a></code> parser stage
to report errors if incompatible options are used together.
Note that <code>contradicts</code> is unidirectional and not transitive
(e.g. if <code>a</code> contradicts <code>b</code> and <code>b</code> contradicts <code>c</code>,
<code>a</code> does not contradict <code>c</code>, and thus <code>a</code> and <code>c</code> are compatible).
Only two <code><a href="#key">key</a></code>s that each contradict the other <code><a href="#key">key</a></code>
are mutually exclusive.
</td>
</tr>
<tr name="defaultValues">
<td><code><a href="#defaultValues">defaultValues</a></code></td>
<td>*</td>
<td>
<code>defaultValues</code> defines values for command-line options
that are used if no <code><a href="#values">values</a></code> are supplied.
The type of <code>defaultValues</code>' values depends on the command-line option type:
<a href="#command-option">Command options</a> may take any value.
<a href="#flag-option">Flag options</a>' values have to be a count object
(e.g. <code>{type: 'flag', count: 2}</code>) whose <code>count</code> field may be any number.
All other options take an array of values,
that must have the same length as their <code><a href="#types">types</a></code> field.
</td>
</tr>
<tr name="desc">
<td><code><a href="#desc">desc</a></code></td>
<td>string</td>
<td>
<code>desc</code> defines a description for the command-line option used by the
<code><a href="#usage-desc">desc</a></code>, <code><a href="#optsList">optsList</a></code>,
<code><a href="#optsLists">optsLists</a></code>, <code><a href="#optsDef">optsDef</a></code>,
and <code><a href="#optsDefs">optsDefs</a></code> usage functions and their <code>*With</code> versions.
</td>
</tr>
<tr name="descArg">
<td><code><a href="#descArg">descArg</a></code></td>
<td>string</td>
<td>
<code>descArg</code> defines a description for an argument value
(e.g. <code>{descArg: 'format'}</code> would print <code>--format=&lt;format&gt;</code>
instead of <code>--format=&lt;string&gt;</code>).
It is used by the <code><a href="#optsList">optsList</a></code>, <code><a href="#optsLists">optsLists</a></code>,
<code><a href="#optsDef">optsDef</a></code>, and <code><a href="#optsDefs">optsDefs</a></code> usage functions
and their <code>*With</code> versions.
<code><a href="#only">only</a></code>, <code><a href="#types">types</a></code>, and <code><a href="#key">key</a></code> 
are other fields that change the argument value description.
These fields are applied in the following order (highest priority first):
<code>descArg</code>, <code><a href="#only">only</a></code>, <code><a href="#types">types</a></code>,
and <code><a href="#key">key</a></code>.
If <code>descArg</code> is an empty string, no argument value description is displayed.
</td>
</tr>
<tr name="implies">
<td><code><a href="#implies">implies</a></code></td>
<td>array of <code><a href="#key">key</a></code>s</td>
<td>
<code>implies</code> defines what <code><a href="#key">key</a></code>s an option must be defined with.
This information is used by the <code><a href="#implyOpts">implyOpts</a></code> parser stage
to report errors if mandatory options are missing.
Note that <code>implies</code> is unidirectional
(e.g. if <code>a</code> implies <code>b</code> and <code>a</code> is present, <code>b</code> must be present as well,
but if <code>b</code> is present, <code>a</code> does not have to be present)
and transitive
(e.g. if <code>a</code> implies <code>b</code> and <code>b</code> implies <code>c</code>,
<code>a</code> also implies <code>c</code>,
and thus if <code>a</code> is present, <code>c</code> must also be present).
Only two <code><a href="#key">key</a></code>s that each imply the other <code><a href="#key">key</a></code>
are mutually inclusive.
</td>
</tr>
<tr name="key">
<td><code><a href="#key">key</a></code></td>
<td>string</td>
<td>
<code>key</code> defines the name of a command-line option.
It is used by the <code><a href="#the-parser-function">parser</a></code> function
as a field name for the parsed values in the resulting <code>args</code> object.
Most command-line options should have a unique <code>key</code> to avoid collisions with other options.
However, if two different options describe the same result field, it may make sense to give them a shared key.
See <code><a href="#complement">complement</a></code> for an example.
A <code>key</code> must not be named <code>_</code>.
It is also used by the
<code><a href="#optsList">optsList</a></code>, <code><a href="#optsLists">optsLists</a></code>,
<code><a href="#optsDef">optsDef</a></code>, <code><a href="#optsDefs">optsDefs</a></code>,
<code><a href="#synopses">synopses</a></code>, and <code><a href="#synopsis">synopsis</a></code> usage functions
and their <code>*With</code> versions to describe argument values (e.g. <code>--format=&lt;format&gt;</code>).
<code><a href="#descArg">descArg</a></code>, <code><a href="#only">only</a></code>,
and <code><a href="#types">types</a></code> are other fields that change the argument value description.
These fields are applied in the following order (highest priority first):
<code><a href="#descArg">descArg</a></code>, <code><a href="#only">only</a></code>,
<code><a href="#types">types</a></code>, and <code>key</code>.
</td>
</tr>
<tr name="only">
<td><code><a href="#only">only</a></code></td>
<td>array of values</td>
<td>
<code>only</code> defines valid values of an option.
It is used by the <code><a href="#restrictToOnly">restrictToOnly</a></code> parser stage to validate user input.
<code>only</code> may be used to <a href="#can-i-use-enums">implement enumerations</a>.
It is also used by the <code><a href="#optsList">optsList</a></code>, <code><a href="#optsLists">optsLists</a></code>,
<code><a href="#optsDef">optsDef</a></code>, and <code><a href="#optsDefs">optsDefs</a></code> usage functions
and their <code>*With</code> versions to describe argument values (e.g. <code>--format=&lt;json|xml&gt;</code>).
<code><a href="#descArg">descArg</a></code>, <code><a href="#types">types</a></code>,
and <code><a href="#key">key</a></code> are other fields that change the argument value description.
These fields are applied in the following order (highest priority first):
<code><a href="#descArg">descArg</a></code>, <code>only</code>, <code><a href="#types">types</a></code>,
and <code><a href="#key">key</a></code>.
</td>
</tr>
<tr name="opts">
<td><code><a href="#opts">opts</a></code></td>
<td>array of options</td>
<td>
<code>opts</code> defines the command-line options of <code><a href="#command">command</a></code>s
and <code><a href="#program">program</a></code>s.
</td>
</tr>
<tr name="required">
<td><code><a href="#required">required</a></code></td>
<td>boolean</td>
<td>
<code>required</code> defines whether a command-line option has to be present or not.
It is used by the <code><a href="#requireOpts">requireOpts</a></code> stage that reports an error,
if a <code>required</code> option does not have <code><a href="#values">values</a></code>
or <code><a href="#defaultValues">defaultValues</a></code>.
A positional argument (<code>*Pos</code>) can only be <code>required</code>,
if all previously defined positional arguments are <code>required</code> as well.
The <code><a href="#synopsis">synopsis</a></code>, <code><a href="#synopses">synopses</a></code>,
<code><a href="#optsList">optsList</a></code>, <code><a href="#optsLists">optsLists</a></code>,
<code><a href="#optsDef">optsDef</a></code>, and <code><a href="#optsDefs">optsDefs</a></code> usage functions
and their <code>*With</code> versions mark <code>required</code> options.
</td>
</tr>
<tr name="reverse">
<td><code><a href="#reverse">reverse</a></code></td>
<td>boolean</td>
<td>
<code>reverse</code> defines whether a given option should be reversed by
the <code><a href="#reverseBools">reverseBools</a></code> or <code><a href="#reverseFlags">reverseFlags</a></code>
parser stages, that operate on
<code><a href="#values">values</a></code> as well as <code><a href="#defaultValues">defaultValues</a></code>.
</td>
</tr>
<tr name="types">
<td><code><a href="#types">types</a></code></td>
<td>array of types</td>
<td>
<code>types</code> defines what user input a command-line option takes.
<a href="#flag-option">Flag options</a>' <code>types</code> must be <code>[]</code>.
<a href="#primitive-option">Primitive options</a>' and <a href="#primitive-pos-arg">primitive positional arguments</a>'
<code>types</code> must be <code>[_]</code>,
and <a href="#array-option">array options</a>' and <a href="#array-pos-arg">array positional arguments</a>'
<code>types</code> must be <code>[_, _, ...]</code>,
where <code>_</code> is the name of a type given as a string.
<a href="#variadic-option">Variadic options</a>, <a href="#variadic-pos-arg">variadic positional arguments</a>,
<a href="#command-option">command options</a>, and <a href="#program-pos-arg">program positional arguments</a>
must not have a <code>types</code> field.
<code>types</code> is also used by the
<code><a href="#optsList">optsList</a></code>, <code><a href="#optsLists">optsLists</a></code>,
<code><a href="#optsDef">optsDef</a></code>, and <code><a href="#optsDefs">optsDefs</a></code> usage functions
and their <code>*With</code> versions to describe argument values
(e.g. <code>--format=&lt;bool&gt;</code> for a <code><a href="#bool">bool</a></code> option).
<code><a href="#descArg">descArg</a></code>, <code><a href="#only">only</a></code>,
and <code><a href="#key">key</a></code> are other fields that change the argument value description.
These fields are applied in the following order (highest priority first):
<code><a href="#descArg">descArg</a></code>, <code><a href="#only">only</a></code>, <code>types</code>,
and <code><a href="#key">key</a></code>.
</td>
</tr>
<tr name="values">
<td><code><a href="#values">values</a></code></td>
<td>array of value(s)</td>
<td>
<code>values</code> holds arguments provided by the user.
<b>This field should only be set by parser stages and never manually.</b>
If default values are needed, see the <code><a href="#defaultValues">defaultValues</a></code> field.
The length of a <code>values</code>' array depends on the command-line option type:
<a href="#flag-option">Flag options</a>, <a href="#primitive-option">primitive options</a>,
<a href="#primitive-pos-arg">primitive positional arguments</a>, and <a href="#rest">rest</a>
must each have <code>values</code> of length <code>1</code>.
<a href="#array-option">Array options</a>' and <a href="#array-pos-arg">array positional arguments</a>'
<code>values</code> field must match their <code><a href="#types">types</a></code> in length.
A , <a href="#command-option">command option</a>'s, <a href="#program-pos-arg">program positional argument</a>'s,
<a href="#variadic-option">variadic option</a>'s, and <a href="#variadic-pos-arg">variadic positional argument</a>'s
<code>values</code> may have any number of entries.
</td>
</tr>
</table>

#### Option Decorators

Certain changes to options are so frequent, [`shargs-opts`][shargs-opts] provides decorators for them.
You may think of decorators as recurring patterns that are provided as functions.

[`shargs-opts`][shargs-opts] provides the following decorators:

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Decorator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="complement">
<td><code><a href="#complement">complement</a>(prefix)(opt)</code></td>
<td>
<details>
<summary>
<code>complement</code> transforms a <code><a href="#bool">bool</a></code> or <code><a href="#flag">flag</a></code> 
option into a complementary option prefixed with a given string
(e.g. <code>--no-html</code> if used on <code>--html</code>).
The complementary option has the same <code><a href="#key">key</a></code> as the original option,
but <code><a href="#reverse">reverses</a></code> its value.
If <code>complement</code> is used, either the <code><a href="#reverseBools">reverseBools</a></code>
or <code><a href="#reverseFlags">reverseFlags</a></code>, or both parser stages must be used.
</summary>

<br />

Example:

```js
const {flag, complement} = require('shargs-opts')

const no = complement('--no-')

const html = flag('html', ['-H', '--html'], {defaultValues: ['false']})
const noHtml = no(html)
```

Is the same as:

```js
const {flag} = require('shargs-opts')

const html = flag('html', ['-H', '--html'], {defaultValues: ['false']})
const noHtml = flag('html', ['--no-H', '--no-html'], {reverse: true})
```

</details>
</td>
</tr>
<tr name="posArgToOpt">
<td><code><a href="#posArgToOpt">posArgToOpt</a>(args)(opt)</code></td>
<td>
<details>
<summary>
<code>posArgToOpt</code> transforms a positional argument into an option
by adding <code><a href="#args">args</a></code>.
</summary>

<br />

Example:

```js
const {program, stringPos} = require('shargs-opts')

const opts = [stringPos('question')]

const args = ['deepThought', 'D']

const deepThought = program('deepThought', opts)

posArgToOpt(args)(deepThought)
```

Is the same as:

```js
const {command} = require('shargs-opts')

command(opts)('deepThought', args)
```

</details>
</td>
</tr>
</table>

### The `parser` Function

The `parser` function is [`shargs`][shargs]' core abstraction and (almost) its only export.
It may be used entirely without [`shargs-opts`][shargs-opts] and [`shargs-parser`][shargs-parser],
e.g. with manually written option objects and parser stages, or with other option DSL or parser stage libraries.
Up to this point, we have already seen some of the things, `parser` does, and others have been hinted at,
but this section finally paints the whole picture:

```js
const {parser} = require('shargs')
const {cast, flagsAsBools, requireOpts, restrictToOnly} = require('shargs-parser')
const {reverseFlags, splitShortOpts} = require('shargs-parser')

const checks = {
  opts: [requireOpts]
}

const askChecks = {
  opts: [requireOpts]
}

const stages = {
  argv: [splitShortOpts],
  opts: [reverseFlags, restrictToOnly, cast],
  args: [flagsAsBools]
}

const options = {checks: askChecks}

const ask = parser(stages, options)

const parsers = {ask}

const deepThought = parser(stages, {checks, parsers, mode: 'sync'})
```

`parser` takes two parameters:

1.  A `stages` object that collects [parser stages](#command-line-parsers)
    and defines what transformations should be applied in which order.
2.  An optional `options` object with [`checks`](#checks), [`parsers`](#parsers), and [`mode`](#mode) fields.

#### `stages`

Let's first take a closer look at `stages`:

```js
const stages = {
  argv: [splitShortOpts],
  opts: [reverseFlags, restrictToOnly, cast],
  args: [flagsAsBools]
}
```

Shargs has five different `stages` that are applied in order to transform argument values (`process.argv`)
to command-line options (`opts`) and finally to arguments (`args`):

<table>
<tr>
<th></th>
<th>Stage</th>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Function&nbsp;Signature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="argv-stages">
<td>1</td>
<td><code><a href="#argv-stages">argv</a></code></td>
<td align="right"><code>({errs, argv}) => ({errs, argv})</code></td>
<td>
<code>argv</code> stages modify command-line argument values
(e.g. <code>['--help', '-a', '42']</code>).
</td>
</tr>
<tr name="toOpts-stages">
<td>2</td>
<td><code><a href="#toOpts-stages">toOpts</a></code></td>
<td align="right"><code>opts => ({errs, argv}) => ({errs, opts})</code></td>
<td>
<code>toOpts</code> transforms command-line argument values syntax into command-line options syntax.
</td>
</tr>
<tr name="opts-stages">
<td>3</td>
<td><code><a href="#opts-stages">opts</a></code></td>
<td align="right"><code>({errs, opts}) => ({errs, opts})</code></td>
<td>
<code>opts</code> stages modify command-line options
(e.g. <code>{key: 'answer', args: ['-a'], types: ['number'], values: ['42']}</code>).
</td>
</tr>
<tr name="toArgs-stages">
<td>4</td>
<td><code><a href="#toArgs-stages">toArgs</a></code></td>
<td align="right"><code>parsers => ({errs, opts}) => ({errs, args})</code></td>
<td>
<code>toArgs</code> transforms command-line options syntax into arguments objects syntax.
</td>
</tr>
<tr name="args-stages">
<td>5</td>
<td><code><a href="#args-stages">args</a></code></td>
<td align="right"><code>({errs, args}) => ({errs, args})</code></td>
<td>
<code>args</code> stages modify arguments objects
(e.g. <code>{_: [], answer: '42', help: {type: 'flag', count: 1}}</code>).
</td>
</tr>
</table>

The [`toOps`](#toOpts-stages) and [`toArgs`](#toArgs-stages) stages
define the core behavior of [`parser`](#the-parser-function) and should not have to be changed in most use cases.
However, if you do have a use case that needs adjustments to those stages, you may carefully swap them out.
The [`argv`](#argv-stages), [`opts`](#opts-stages), and [`args`](#args-stages) stages
are the actual developer-facing API for defining a parser's behavior using parser stages.

If you read the stage's function signatures from top to bottom, you get a good impression of what `parser` does:

Most importantly, it takes a list of errors (`errs`) and passes them on the the next stage.
If you write your own stages, it is of utmost importance to not interrupt this flow.
You may ask why errors are not collected internally, to make sure they are passed:
The answer is, to make stages possible that operate on errors,
e.g. by combining several errors into one or by improving error messages.

[`argv` stages](#argv-stages) transform `argv`s into other `argv`s,
[`opts` stages](#opts-stages) transform `opts`' into other `opts`', and
[`args` stages](#args-stages) transform `args`' into other `args`'.
Nothing to see here, move along.

The [`toOpts` stage's](#toOpts-stages) signature reveals more:
It takes an `opts` array, supposably the one we passed to parser, and transforms `args` to `opts`.
It is save to assume it uses the information defined in `opts` to drive this transformation.

Finally, the [`toArgs` stage's](#toArgs-stages) signature:
It takes several [`parsers`](#parsers), supposably from the `parsers` field in `options`, and transforms `opts` to `args`.
Since parsers are used to transform [`opts`](#opts),
it is save to assume that [`parsers`](#parsers) is used to recursively parse [`program`s](#program)
and [`command`s](#command).

#### `parsers`

Let's have a look at the `parsers` field:

```js
const checks = ...
const askChecks = ...
const stages = ...

const options = {checks: askChecks}

const ask = parser(stages, options)

const parsers = {ask}

const deepThought = parser(stages, {checks, parsers, mode: 'sync'})
```

`parsers` takes an object that assigns command-line [`parser`](#the-parser-function)s to keys, in this example `ask`.
The name of the key is not coincidentally the same as the [`key`](#key) of the `ask` [`command`](#command) from before:
`parsers` defines command-specific parsers.

That means, while some command-line arguments are parsed using the `deepThought` parser,
others (the ones that belong to the `ask` command) are parsed using the `ask` parser.
In this example, `deepThought` and `ask` have the same `stages`, but different `checks`.

If a [`command`](#command) does not have its own parser defined, it is parsed using its *parent's* parser,
with one important exception:
Only the `stages` are used, but not the `checks`.
So if `ask` did not have its own parser, it would have been parsed with the `deepThought` parser, but without `checks`.

The `parsers` object has a reserved key named `_`,
that is used as a default parser for all commands that have no key in `parsers`.
So if you need to define the same *child* parser for all [`command`s](#command), use the `_` key.

#### `checks`

We have learned in the [`parsers`](#parsers) section that checks are treated different than stages.
But both actually look quite similar, and even have the same signatures.
So why is that the case:

```js
const checks = {
  opts: [requireOpts]
}

const askChecks = {
  opts: [requireOpts]
}

const stages = {
  argv: [splitShortOpts],
  opts: [reverseFlags, restrictToOnly, cast],
  args: [flagsAsBools]
}
```

The difference between stages and checks is implicit and has to do with how they operate internally:
While stages do both, transforming `argv`, `opts`, and `args` and reporting `errs`,
checks never apply transformations and only report `errs`.

And this causes problems in two different cases:

First, when declaring the order of stages in `argv`, `opts`, and `args`:
Checks verify that `argv`, `opts`, or `args` have a certain shape or follow certain rules.
But applying stages may change that shape or bent those rules.
And checks cannot possibly account for all those changes, especially if your own custom stages are involved.
So there is only one way out:
Checks must always be run before any stage is run, and by splitting checks and stages into two different objects,
`parser` makes sure of that.

Second, when recursively parsing [`command`](#command)s:
While stages can report `errs` and then eliminate the cause of an error,
checks are bound to repeat `errs` if parsers are applied more than once.
And in some situations, parsers are applied several times, internally.
So in order to avoid duplicating errors, checks are not applied recursively, in contrast to stages.

#### `mode`

The `mode` field defines whether a parser runs synchronously or asynchronously.
So far, all examples we have seen have been synchronous parsers, because those are easier to reason about and to explain.
However, if `mode` is set to `'async'`, a parser becomes asynchronous.
But what does that mean exactly:

```js
const script = ...
const checks = ...
const stages = ...
const parsers = ...
const argv = ...

const asyncDeepThought = parser(stages, {checks, parsers, mode: 'async'})

const asyncParse = asyncDeepThought(script)

const asyncResults = parseAsync(argv)

asyncResults.then(
  ({errs, args}) => ...
)
```

An asynchronous parser differs in two ways:
It returns a [JavaScript Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise)
instead of an object,
and its [`stages`](#stages) and [`checks`](#checks) parameters take the following types of parser stages:

<table>
<tr>
<th></th>
<th>Stage</th>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Function&nbsp;Signature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="argv-stages-async">
<td>1</td>
<td><code><a href="#argv-stages-async">argv</a></code></td>
<td align="right">
<code>({errs, argv}) => ({errs, argv})</code><br />
<code>({errs, argv}) => Promise({errs, argv})</code>
</td>
<td>
Async <code>argv</code> stages work just like their sync counterpart, but return a Promise.
</td>
</tr>
<tr name="toOpts-stages-async">
<td>2</td>
<td><code><a href="#toOpts-stages-async">toOpts</a></code></td>
<td align="right">
<code>opts => ({errs, argv}) => ({errs, opts})</code><br />
<code>opts => ({errs, argv}) => Promise({errs, opts})</code>
</td>
<td>
An async <code>toOpts</code> stage works just like its sync counterpart, but returns a Promise.
</td>
</tr>
<tr name="opts-stages-async">
<td>3</td>
<td><code><a href="#opts-stages-async">opts</a></code></td>
<td align="right">
<code>({errs, opts}) => ({errs, opts})</code><br />
<code>({errs, opts}) => Promise({errs, opts})</code>
</td>
<td>
Async <code>opts</code> stages work just like their sync counterpart, but return a Promise.
</td>
</tr>
<tr name="toArgs-stages-async">
<td>4</td>
<td><code><a href="#toArgs-stages-async">toArgs</a></code></td>
<td align="right">
<code>parsers => ({errs, opts}) => ({errs, args})</code><br />
<code>parsers => ({errs, opts}) => Promise({errs, args})</code>
</td>
<td>
An async <code>toArgs</code> stage works just like its sync counterpart, but returns a Promise.
</td>
</tr>
<tr name="args-stages-async">
<td>5</td>
<td><code><a href="#args-stages-async">args</a></code></td>
<td align="right">
<code>({errs, args}) => ({errs, args})</code><br />
<code>({errs, args}) => Promise({errs, args})</code>
</td>
<td>
Async <code>args</code> stages work just like their sync counterpart, but return a Promise.
</td>
</tr>
</table>

If you read the stages' function signatures from top to bottom,
you get a good impression of what an asynchronous parser must do:

In addition to [what a synchronous parser does](#stages), it needs a way to wait for Promises to resolve,
before continuing processing functions.
So it needs a way to chain functions returning objects, as well as functions returning Promises.
Fortunately for us, this is exactly what [Promise.prototype.then][then] does.

So, internally, an asynchronous shargs parser really differs only in one way from a synchronous parser:
Instead of using function composition, it uses [Promise.prototype.then][then] to chain parser stages.

### Command-line Parsers

You do not have to write parser stages by yourself.
The [`shargs-parser`][shargs-parser] library offers a large collection of common parser stages, you can choose from.

The parser stages presented here are split into *checks* and *stages*.
You may read up on the difference between those two in the [`checks`](#checks) section.
I give you only the short version here:
Checks go into [`parser`](#the-parser-function)'s [`checks`](#checks) field, while stages go into [`stages`](#stages).

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
<code>verifyArgv</code> checks, whether the <code>argv</code> adhere to the <code>rules</code> predicate.
If <code>rules</code> returns <code>false</code>, it reports a <code>FalseArgvRules</code> error.
If <code>rules</code> is not a function, it reports a <code>WrongArgvRulesType</code> error.
</summary>

<br />

Example:

```js
const {verifyArgv} = require('shargs-parser')

const rules = argv => (
  argv.some(_ => _ === '--question') &&
  argv.some(_ => _ === '--answer')
)

const argv = ['--answer', '42']

verifyArgv(rules)({argv})
```

Result:

```js
{
  errs: [
    {
      code: 'FalseArgvRules',
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
<code>equalsSignAsSpace</code> transforms arguments of the form <code>['--answer=42']</code>
into <code>['--answer', '42']</code>.
It only removes the first <code>=</code>,
so <code>['--question=1+2=3?']</code> is transformed into <code>['--question', '1+2=3?']</code>.
</summary>

<br />

Example:

```js
const {equalsSignAsSpace} = require('shargs-parser')

const argv = ['--answer=42']

equalsSignAsSpace({argv})
```

Result:

```js
{
  argv: ['--answer', '42']
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
<code>shortOptsNoSpace</code> transforms arguments like <code>['-a42']</code> into <code>['-a', '42']</code>.
It cannot be used together with <code><a href="#splitShortOpts">splitShortOpts</a></code> in the same parser.
</summary>

<br />

Example:

```js
const {shortOptsNoSpace} = require('shargs-parser')

const argv = ['-a42']

shortOptsNoSpace({argv})
```

Result:

```js
{
  argv: ['-a', '42']
}
```

</details>
</td>
</tr>
<tr name="splitShortOpts">
<td><code><a href="#splitShortOpts">splitShortOpts</a>({errs, argv})</code></td>
<td>
<details>
<summary>
<code>splitShortOpts</code> transforms arguments like <code>['-vh']</code> into <code>['-v', '-h']</code>.
It cannot be used together with <code><a href="#shortOptsNoSpace">shortOptsNoSpace</a></code> in the same parser.
</summary>

<br />

Example:

```js
const {splitShortOpts} = require('shargs-parser')

const argv = ['-ha', '42']

splitShortOpts({argv})
```

Result:

```js
{
  argv: ['-h', '-a', '42']
}
```

</details>
</td>
</tr>
<tr name="traverseArgv">
<td><code><a href="#traverseArgv">traverseArgv</a>(p)(f)({errs,argv})</code></td>
<td>
<details>
<summary>
<code>traverseArgv</code> transforms arguments by applying a function <code>f</code>
to each argument satisfying a predicate <code>p</code>.
While <code>p</code>'s signature is <code>arg => true|false</code>,
<code>f</code>'s signature must be <code>(arg, index, argv) => ({errs = [], argv = []})</code>.
Many other <code>argv</code> checks and stages are defined in terms of <code>traverseArgv</code>
and it is of great help for writing custom <code>argv</code> stages.
</summary>

<br />

Example:

```js
const {traverseArgv} = require('shargs-parser')

const argv = [
  '--answer=42',
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
    '--answer', '42',
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
<code>contradictOpts</code> checks, if options with a <code><a href="#contradicts">contradicts</a></code> list
violate their constraints.
This is the case, if both, the option
and an option from its <code><a href="#contradicts">contradicts</a></code> list, have
<code><a href="#values">values</a></code> or <code><a href="#defaultValues">defaultValues</a></code>.
In case of a violation, a <code>ContradictionDetected</code> error is reported.
If <code><a href="#contradicts">contradicts</a></code> is not a list,
it reports a <code>WrongContradictsType</code> error.
</summary>

<br />

Example:

```js
const {contradictOpts} = require('shargs-parser')
const {number, string} = require('shargs-opts')

const opts = [
  number('age', ['-a'], {
    values: ['27']
  }),
  string('birthday', ['-b'], {
    contradicts: ['age'],
    values: ['27.7.1927']
  })
]

contradictOpts({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'ContradictionDetected',
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
<code>demandACommand</code> checks, whether at least one <code><a href="#command">command</a></code>
has <code><a href="#values">values</a></code> or <code><a href="#defaultValues">defaultValues</a></code>.
If that is not the case, a <code>CommandRequired</code> error is reported.
</summary>

<br />

Example:

```js
const {demandACommand} = require('shargs-parser')
const {command, flag, number} = require('shargs-opts')

const opts = [
  command([])('ask', ['ask'], {desc: 'Ask a question.'}),
  number('answer', ['-a', '--answer'], {
    values: ['42'],
    desc: 'The answer.'
  }),
  flag('help', ['-h', '--help'], {
    desc: 'Print this help message and exit.'
  })
]

demandACommand({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'CommandRequired',
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
<code>implyOpts</code> checks, if options with an <code><a href="#implies">implies</a></code> list
violate their constraints.
This is the case, if the option has
<code><a href="#values">values</a></code> or <code><a href="#defaultValues">defaultValues</a></code>,
but an option from its <code><a href="#implies">implies</a></code> list has not.
In case of a violation, a <code>ImplicationViolated</code> error is reported.
If <code><a href="#implies">implies</a></code> is not a list,
it reports a <code>WrongImpliesType</code> error.
</summary>

<br />

Example:

```js
const {implyOpts} = require('shargs-parser')
const {number, string} = require('shargs-opts')

const opts = [
  number('answer', ['-a']),
  string('question', ['-q'], {
    implies: ['answer'],
    values: ['How much is the fish?']
  })
]

implyOpts({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'ImplicationViolated',
      msg:  'Some given keys that imply...',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr name="requireOpts">
<td><code><a href="#requireOpts">requireOpts</a>({errs, opts})</code></td>
<td>
<details>
<summary>
<code>requireOpts</code> checks,
if all options whose <code><a href="#required">required</a></code> field is <code>true</code> have
<code><a href="#values">values</a></code> or <code><a href="#defaultValues">defaultValues</a></code>.
For each missing <code><a href="#required">required</a></code> option, a <code>RequiredOptionMissing</code> error
is reported.
If <code><a href="#values">values</a></code> or <code><a href="#defaultValues">defaultValues</a></code>
is not an array, it reports a <code>RequiredOptionFormat</code> error.
</summary>

<br />

Example:

```js
const {requireOpts} = require('shargs-parser')
const {string} = require('shargs-opts')

const opts = [
  string('question', ['--question'], {required: true})
]

requireOpts({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'RequiredOptionIsMissing',
      msg:  'A required option has not been provided.',
      info: {...}
    }
  ]
}
```

</details>
</td>
</tr>
<tr name="suggestOpts">
<td><code><a href="#suggestOpts">suggestOpts</a>({errs, opts})</code></td>
<td>
<details>
<summary>
<code>suggestOpts</code> checks all <a href="#rest">rest</a> <code><a href="#values">values</a></code>,
assuming they are in the <a href="#rest">rest</a> category because of spelling mistakes.
It collects all command-line options' <code><a href="#args">args</a></code>
and computes a distance metric (currently Levenshtein distance) between each arg and each <a href="#rest">rest</a>.
It reports the results in a <code>DidYouMean</code> error,
suggesting probable <code><a href="#args">args</a></code> replacements for spelling mistakes
<a href="#rest">rest</a> <code><a href="#values">values</a></code>.
</summary>

<br />

Example:

```js
const {suggestOpts} = require('shargs-parser')
const {number} = require('shargs-opts')

const opts = [
  number('answer', ['-a', '--ans']),
  {values: ['--asn']}
]

suggestOpts({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'DidYouMean',
      msg:  'An unknown command-line argument...',
      info: {
        argv: '--asn',
        options: [
          [],
          [],
          [{'--ans': number('answer', ['-a', '--ans'])}],
          [{'-a': number('answer', ['-a', '--ans'])}]
        ]
      }
    }
  ]
}
```

The <code>options</code> array looks a little bit strange, so an explanation is in order.
The array's index is the cost necessary to transform the unknown option in the arguments, represented as keys.
Because of this, you can conveniently work with the results, e.g. by only using the most probable ones:

```js
'Did you mean: ' + (
  options
  .slice(0, 3)
  .reduce((a, b) => a.concat(b))
  .flatMap(Object.keys)
  .join(', ')
)
```

Results in:

```bash
Did you mean: --age
```

</details>
</td>
</tr>
<tr name="validatePosArgs">
<td><code><a href="#validatePosArgs">validatePosArgs</a>({errs, opts})</code></td>
<td>
<details>
<summary>
<code>validatePosArgs</code> checks, if defined positional arguments (<code>*Pos</code>) violate their rules for the
<code><a href="#required">required</a></code> field
or the position of <code><a href="#variadicPos">variadicPos</a></code>:
If a positional argument is <code><a href="#required">required</a></code>,
all previously defined positional arguments must be <code><a href="#required">required</a></code>, as well,
and no other positional arguments can be defined after a <code><a href="#variadicPos">variadicPos</a></code>.
If rule one is violated, an <code>InvalidRequiredPositionalArgument</code> error is reported,
and in case of a violation of the second rule, <code>validatePosArgs</code> reports an
<code>InvalidVariadicPositionalArgument</code> error.
</summary>

<br />

Example:

```js
const {validatePosArgs} = require('shargs-parser')
const {stringPos, variadicPos} = require('shargs-opts')

const opts = [
  stringPos('name1', {required: true, values: ['Arthur']}),
  stringPos('name2', {required: false, values: ['Ford']}),
  stringPos('name3', {required: true, values: ['Trillian']}),
  variadicPos('names', {values: ['Zaphod', 'Marvin']}),
  stringPos('name4', {values: ['Douglas']})
]

validatePosArgs({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'InvalidRequiredPositionalArgument',
      msg:  'If a positional argument is required, all prev...',
      info: {...}
    },
    {
      code: 'InvalidVariadicPositionalArgument',
      msg:  'Only the last positional argument may be variadic.',
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
<code>verifyOpts</code> checks, whether the <code>opts</code> array adheres to the <code>rules</code> predicate.
<code>rules</code> must have the following function signature: <code>opt => true|false</code>.
For each <code>opt</code> that returns <code>false</code>, a <code>FalseOptsRules</code> error is reported.
If <code>rules</code> is not a function, <code>verifyOpts</code> reports a <code>WrongOptsRulesType</code> error.
</summary>

<br />

Example:

```js
const {verifyOpts} = require('shargs-parser')
const {string} = require('shargs-opts')

const implies = (p, q) => !p || q

const rules = opts => implies(
  opts.some(_ => _.key === 'question' && _.values),
  opts.some(_ => _.key === 'answer' && _.values)
)

const opts = [
  string('question', ['--question'], {
    values: ['How much is the fish?']
  }),
  number('answer', ['-a'])
]

verifyOpts(rules)({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'FalseOptsRules',
      msg:  'Your opts rules returned false...',
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
<code>verifyValuesArity</code> checks, whether <code>opts</code>'
<code><a href="#values">values</a></code> and <code><a href="#defaultValues">defaultValues</a></code>
fit their <code><a href="#types">types</a></code>.
See the <code><a href="#values">values</a></code> and <code><a href="#defaultValues">defaultValues</a></code>
documentations for the exact rules.
If the lengths of <code><a href="#values">values</a></code> or <code><a href="#defaultValues">defaultValues</a></code> 
and <code><a href="#types">types</a></code> do not match, an <code>InvalidArity</code> error is reported.
If the <code><a href="#types">types</a></code> field has an invalid value, an <code>InvalidTypes</code> error is reported
and <code>verifyValuesArity</code> reports an <code>InvalidValues</code> error in case of invalid
<code><a href="#values">values</a></code> or <code><a href="#defaultValues">defaultValues</a></code>.
</summary>

<br />

Example:

```js
const {verifyValuesArity} = require('shargs-parser')
const {number} = require('shargs-opts')

const opts = [
  number('answer', ['--answer'], {values: ['42', '23']})
]

verifyValuesArity({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'InvalidArity',
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
<code>arrayOnRepeat</code> transforms <code>opts</code>
by collecting the <code><a href="#values">values</a></code> of repeated <code><a href="#key">key</a></code>s in an array,
instead of taking only the first mention of a <code><a href="#key">key</a></code> while ignoring the rest.
</summary>

<br />

Example:

```js
const {arrayOnRepeat} = require('shargs-parser')
const {number, string} = require('shargs-opts')

const opts = [
  string('answer', ['-a'], {values: ['42']}),
  number('answer', ['-a'], {values: [42]})
]

arrayOnRepeat({opts})
```

Result:

```js
{
  opts: [
    array(['string', 'number'])('answer', ['-a'], {
      values: ['42', 42]
    })
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
<code>bestGuessOpts</code> transforms <a href="#rest">rest</a> options
(e.g. <code>{values: ['--version']}</code>)
into new command-line options that are introduced
based on the <a href="#rest">rest</a> <code><a href="#values">values</a></code>
(e.g. <code>{key: 'version', types: [], values: [1]}</code>).
It transforms single <a href="#rest">rest</a> options into a <code><a href="#flag">flag</a></code>
and two consecutive <a href="#rest">rest</a> options into a <code><a href="#string">string</a></code>
(e.g. <code>[{values: ['--not']}, {values: ['panic']}]</code> would become
<code>{key: 'not', types: ['string'], args: ['--not'], values: ['panic']}</code>).
It only assumes <a href="#rest">rest</a> <code><a href="#values">values</a></code>
to be <code><a href="#string">string</a></code>s
if the first <a href="#rest">rest</a> is in short option format
(one minus with a single character, e.g. <code>-h</code>, <code>-v</code>)
or in long option format (two minuses with any more characters, e.g. <code>--help</code>, <code>--verbose</code>).
<code><a href="#bestGuessArgs">bestGuessArgs</a></code> is very similar to <code>bestGuessOpts</code>,
but also considers non-consecutive rest <code><a href="#values">values</a></code>.
</summary>

<br />

Example:

```js
const {bestGuessOpts} = require('shargs-parser')
const {flag, string} = require('shargs-opts')

const opts = [
  string('age', ['--age'], {values: ['unknown']}),
  {values: ['--paranoid']},
  {values: ['--name']},
  {values: ['Marvin']},
  {values: ['foo']}
]

bestGuessOpts({opts})
```

Result:

```js
{
  opts: [
    string('age', ['--age'], {values: ['unknown']}),
    flag('paranoid', [], {values: [1]}),
    string('name', [], {values: ['Marvin']}),
    {values: ['foo']}
  ]
}
```

</details>
</td>
</tr>
<tr name="broadenBools">
<td><code><a href="#broadenBools">broadenBools</a>(alt)({errs, opts})</code></td>
<td>
<details>
<summary>
<code>broadenBools</code> transforms <code><a href="#bool">bool</a></code>s with
<code><a href="#values">values</a></code> like <code>['yes']</code> or <code>['no']</code> into
<code><a href="#bool">bool</a></code>s with <code>['true']</code> or <code>['false']</code>
<code><a href="#values">values</a></code> according to an <code>alt</code> mapping
(e.g. <code>{true: ['yes'], false: ['no']}</code>).
It also works on <code><a href="#defaultValues">defaultValues</a></code>.
</summary>

<br />

Example:

```js
const {broadenBools} = require('shargs-parser')
const {bool, number} = require('shargs-opts')

const opts = [
  number('answer', ['-a', '--answer'], {values: ['42']}),
  bool('verbose', ['--verbose'], {values: ['no']})
]

const alt = {
  true: ['yes'],
  false: ['no', 'f']
}

broadenBools(alt)({opts})
```

Result:

```js
{
  opts: [
    number('answer', ['-a', '--answer'], {values: ['42']}),
    bool('verbose', ['--verbose'], {values: ['false']})
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
<code>cast</code> transforms string <code><a href="#values">values</a></code>
and <code><a href="#defaultValues">defaultValues</a></code> into other JavaScript types (e.g. numbers, booleans)
according to the command-line options' <code><a href="#types">types</a></code>
(e.g. <code>{key: 'answer', types: ['number'], values: ['42']}</code> is transformed to
<code>{key: 'answer', types: ['number'], values: [42]}</code>).
If <code><a href="#types">types</a></code> contains <code>'number'</code>, but <code><a href="#values">values</a></code>
cannot be cast into a number, an <code>ArgumentIsNotANumber</code> error is reported.
If <code><a href="#types">types</a></code> contains <code>'bool'</code>, but <code><a href="#values">values</a></code>
is not <code>['true']</code> or <code>['false']</code>, it reports an <code>ArgumentIsNotABool</code> error.
</summary>

<br />

Example:

```js
const {cast} = require('shargs-parser')
const {bool, number} = require('shargs-opts')

const opts = [
  number('answer', ['-a', '--answer'], {values: ['42']}),
  bool('verbose', ['--verbose'], {defaultValues: ['false']})
]

cast({opts})
```

Result:

```js
{
  opts: [
    number('answer', ['-a', '--answer'], {values: [42]}),
    bool('verbose', ['--verbose'], {defaultValues: [false]})
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
<code>restrictToOnly</code> checks for each command-line option with both, <code><a href="#only">only</a></code>
and <code><a href="#values">values</a></code> fields, if all values in <code><a href="#values">values</a></code>
are also contained in <code><a href="#only">only</a></code>.
If values are not found in <code><a href="#only">only</a></code>,
a <code>ValueRestrictionsViolated</code> error is reported for each value
and the <code><a href="#values">values</a></code> field is removed from the option.
</summary>

<br />

Example:

```js
const {restrictToOnly} = require('shargs-parser')
const {number} = require('shargs-opts')

const opts = [
  number('answer', ['--answer'], {only: ['42'], values: ['23']})
]

restrictToOnly({opts})
```

Result:

```js
{
  errs: [
    {
      code: 'ValueRestrictionViolated',
      msg:  'A value lies outside the allowed values...',
      info: {...}
    }
  ],
  opts: [
    number('answer', ['--answer'], {only: ['42']})
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
<code>reverseBools</code> transforms
<code><a href="#values">values</a></code> and <code><a href="#defaultValues">defaultValues</a></code> of
<a href="#primitive-option">primitive options</a>,
<a href="#primitive-pos-arg">primitive positional arguments</a>, <a href="#array-option">array options</a>,
and <a href="#array-pos-arg">array positional arguments</a>
whose <code><a href="#types">types</a></code> contain <code>'bool'</code> and whose
<code><a href="#reverse">reverse</a></code> field is <code>true</code>.
It replaces <code>'true'</code> with <code>'false'</code> and vice versa.
</summary>

<br />

Example:

```js
const {reverseBools} = require('shargs-parser')
const {bool} = require('shargs-opts')

const opts = [
  bool('verbose', ['-v'], {reverse: true, values: [true]}),
  bool('verbose', ['-v'], {reverse: true, values: ['true']})
]

reverseBools({opts})
```

Result:

```js
{
  opts: [
    bool('verbose', ['-v'], {reverse: true, values: [false]}),
    bool('verbose', ['-v'], {reverse: true, values: ['false']})
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
<code>reverseFlags</code> transforms
<code><a href="#values">values</a></code> and <code><a href="#defaultValues">defaultValues</a></code> of
<a href="#flag-option">flag options</a> whose <code><a href="#reverse">reverse</a></code> field is <code>true</code>
by inverting the <code><a href="#flag">flag</a></code>'s value (e.g. <code>1</code> becomes <code>-1</code>).
</summary>

<br />

Example:

```js
const {reverseFlags} = require('shargs-parser')
const {flag} = require('shargs-opts')

const opts = [
  flag('help', ['-h'], {reverse: true, values: [1]})
]

reverseFlags({opts})
```

Result:

```js
{
  opts: [
    flag('help', ['-h'], {reverse: true, values: [-1]})
  ]
}
```

</details>
</td>
</tr>
<tr name="traverseOpts">
<td><code><a href="#traverseOpts">traverseOpts</a>(p)(f)({errs,opts})</code></td>
<td>
<details>
<summary>
<code>traverseOpts</code> transforms <code>opts</code> by applying a function <code>f</code>
to each option satisfying a predicate <code>p</code>.
While <code>p</code>'s signature is <code>opt => true|false</code>,
<code>f</code>'s signature must be <code>(opt, index, opts) => ({errs = [], opts = []})</code>.
Many other <code>opts</code> checks and stages are defined in terms of <code>traverseOpts</code>
and it is of great help for writing custom <code>opts</code> stages.
</summary>

<br />

Example:

```js
const {traverseOpts} = require('shargs-parser')
const {flag, number} = require('shargs-opts')

const opts = [
  number('answer', ['-a'], {values: ['42']}),
  flag('verbose', ['-v'], {values: [1]}),
  flag('help', ['-h'], {values: [1]})
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
    number('answer', ['-a'], {values: ['42']}),
    flag('verbose', ['-v'], {values: [-1]}),
    flag('help', ['-h'], {values: [-1]})
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
<code>failRest</code> checks, whether the rest field <code>_</code> in <code>args</code> has any values
and reports an <code>UnexpectedArgument</code> error for each value found.
</summary>

<br />

Example:

```js
const {failRest} = require('shargs-parser')

const args = {
  _: ['--help']
}

failRest({args})
```

Result:

```js
{
  errs: [
    {
      code: 'UnexpectedArgument',
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
<code>verifyArgs</code> checks, whether the <code>args</code> object adheres to the <code>rules</code> predicate.
<code>rules</code> must have the following function signature: <code>arg => true|false</code>.
For each arg that returns <code>false</code>, a <code>FalseArgsRules</code> error is reported.
If <code>rules</code> is not a function, <code>verifyArgs</code> reports a <code>WrongArgsRulesType</code> error.
</summary>

<br />

Example:

```js
const {verifyArgs} = require('shargs-parser')

const rules = args => (
  typeof args.question !== 'undefined' &&
  typeof args.answer   !== 'undefined'
)

const args = {
  question: 'How much is the fish?'
}

verifyArgs(rules)({args})
```

Result:

```js
{
  errs: [
    {
      code: 'FalseArgsRules',
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
<code>bestGuessArgs</code> transforms rest field values (e.g. <code>{_: ['--version']}</code>)
into new arguments (e.g. <code>{version: {type: 'flag', count: 1}}</code>).
It transforms single rest field values into a flag and two consecutive rest options into a string
(e.g. <code>{_: ['--not', 'panic']}</code> would become <code>{not: 'panic'}</code>).
It only assumes rest field values to be strings if the first rest is in short option format
(one minus with a single character, e.g. <code>-h</code>, <code>-v</code>)
or in long option format (two minuses with any more characters, e.g. <code>--help</code>, <code>--verbose</code>).
<code>bestGuessArgs</code> is very similar to <code><a href="#bestGuessOpts">bestGuessOpts</a></code>,
but also considers rest fields that were originally not in tandem.
</summary>

<br />

Example:

```js
const {bestGuessArgs} = require('shargs-parser')

const obj = {
  args: {
    _: ['--answer', '42', 'foo', '-h'],
    command: {
      _: ['bar', '-v', '--question', 'What is answer?', '-v']
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
    answer: '42',
    h: {type: 'flag', count: 1},
    command: {
      _: ['bar'],
      v: {type: 'flag', count: 2},
      question: 'What is answer?'
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
<code>bestGuessCast</code> transforms string <code>args</code> into other JavaScript types
by best guess based on their structure (e.g. <code>{answer: '42'}</code> becomes <code>{answer: 42}</code>).
It supports numbers and booleans (e.g. <code>{help: 'true'}</code> becomes <code>{help: true}</code>).
</summary>

<br />

Example:

```js
const {bestGuessCast} = require('shargs-parser')

const args = {
  _: ['--name', 'Marvin'],
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
    _: ['--name', 'Marvin'],
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
<tr name="boolAsFlag">
<td><code><a href="#boolAsFlag">boolAsFlag</a>(key)({errs, args})</code></td>
<td>
<details>
<summary>
<code>boolAsFlag</code> transforms the bool with <code>key</code> in <code>args</code> to a flag object.
If it is <code>true</code> it is transformed to <code>{type: 'flag', count: 1}</code>,
otherwise to <code>{type: 'flag', count: -1}</code>.
</summary>

<br />

Example:

```js
const args = {
  _: [],
  version: true
}

boolAsFlag('version')({args})
```

Result:

```js
{
  _: [],
  version: {type: 'flag', count: 1}
}
```

</details>
</td>
</tr>
<tr name="boolsAsFlags">
<td><code><a href="#boolsAsFlags">boolsAsFlags</a>({errs, args})</code></td>
<td>
<details>
<summary>
<code>boolsAsFlags</code> transforms all booleans in <code>args</code> to flag objects.
If a boolean is <code>true</code> it is transformed to <code>{type: 'flag', count: 1}</code>,
otherwise to <code>{type: 'flag', count: -1}</code>.
</summary>

<br />

Example:

```js
const args = {
  _: [],
  html: false,
  version: true
}

boolsAsFlags({args})
```

Result:

```js
{
  _: [],
  html: {type: 'flag', count: -1},
  version: {type: 'flag', count: 1}
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
<code>clearRest</code> transforms <code>args</code> by emptying rest values (i.e. <code>{_: []}</code>).
</summary>

<br />

Example:

```js
const {clearRest} = require('shargs-parser')

const args = {_: ['--verbose']}

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
<tr name="flagAsBool">
<td><code><a href="#flagAsBool">flagAsBool</a>(key)({errs, args})</code></td>
<td>
<details>
<summary>
<code>flagAsBool</code> transforms the flag with <code>key</code> in <code>args</code> to a boolean value.
If its <code>count</code> is greater than <code>0</code> it is considered <code>true</code>,
otherwise it is considered <code>false</code>
(e.g. <code>{help: {type: 'flag', count: 1}}</code> becomes <code>{help: true}</code>,
while <code>{help: {type: 'flag', count: -2}}</code> is transformed to <code>{help: false}</code>).
</summary>

<br />

Example:

```js
const {flagAsBool} = require('shargs-parser')

const args = {
  verbose: {type: 'flag', count: 1}
}

flagAsBool('verbose')({args})
```

Result:

```js
{
  args: {
    verbose: true
  }
}
```

</details>
</td>
</tr>
<tr name="flagAsNumber">
<td><code><a href="#flagAsNumber">flagAsNumber</a>(key)({errs, args})</code></td>
<td>
<details>
<summary>
<code>flagAsNumber</code> transforms the flag with <code>key</code> in <code>args</code>
to a number using its <code>count</code>
(e.g. <code>{verbose: {type: 'flag', count: 3}}</code> becomes <code>{verbose: 3}</code>.
</summary>

<br />

Example:

```js
const {flagAsNumber} = require('shargs-parser')

const args = {
  verbose: {type: 'flag', count: 2}
}

flagAsNumber('version')({args})
```

Result:

```js
{
  args: {
    verbose: 2
  }
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
<code>flagsAsBools</code> transforms all flags in <code>args</code> to boolean values.
All flags whose <code>count</code> is greater than <code>0</code> are considered <code>true</code>,
while all other flags are considered <code>false</code>
(e.g. <code>{help: {type: 'flag', count: 1}}</code> becomes <code>{help: true}</code>,
while <code>{help: {type: 'flag', count: -2}}</code> is transformed to <code>{help: false}</code>).
</summary>

<br />

Example:

```js
const {flagsAsBools} = require('shargs-parser')

const args = {
  verbose: {type: 'flag', count: 1}
}

flagsAsBools({args})
```

Result:

```js
{
  args: {
    verbose: true
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
<code>flagsAsNumbers</code> transforms all flags in <code>args</code> to numbers using their <code>count</code>
(e.g. <code>{verbose: {type: 'flag', count: 3}}</code> becomes <code>{verbose: 3}</code>.
</summary>

<br />

Example:

```js
const {flagsAsNumbers} = require('shargs-parser')

const args = {
  verbose: {type: 'flag', count: 2}
}

flagsAsNumbers({args})
```

Result:

```js
{
  args: {
    verbose: 2
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
<code>mergeArgs</code> transforms <code>args</code> by <i>flattening them</i>
by recursively merging nested objects into their parent object
(e.g. <code>{ask: {question: '42?'}, answer: 42}</code> becomes <code>{question: '42?', answer: 42}</code>).
A custom <code>merge</code> function may be passed with the following function signature:
<code>(obj1 = {}, obj2 = {}) => {}</code>.
The default <code>merge</code> function (if <code>merge</code> is <code>undefined</code>)
prefers keys from the parent object over keys from nested objects,
but concatenates rest values (<code>_</code>) from both objects
(e.g. <code>{_: ['foo'], answer: 42, ask: {_: ['bar'], answer: 23}}</code> becomes
<code>{_: ['foo', 'bar'], answer: 42}</code>).
</summary>

<br />

Example:

```js
const {mergeArgs} = require('shargs-parser')

const args = {
  _: ['--help'],
  version: {type: 'flag', count: 2},
  name: 'Arthur',
  command: {
    _: ['-v'],
    version: {type: 'flag', count: 1},
    name: 'Trillian',
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
    _: ['--help', '-v'],
    version: {type: 'flag', count: 2},
    name: 'Arthur',
    help: true,
    verbose: true
  }
}
```

</details>
</td>
</tr>
<tr name="numberAsFlag">
<td><code><a href="#numberAsFlag">numberAsFlag</a>(key)({errs, args})</code></td>
<td>
<details>
<summary>
<code>numberAsFlag</code> transforms the number with <code>key</code> in <code>args</code> to a flag object.
The number is the flag's <code>count</code> (e.g. <code>42</code> becomes <code>{type: 'flag', count: 42}</code>).
</summary>

<br />

Example:

```js
const args = {
  _: [],
  answer: 42
}

numberAsFlag('answer')({args})
```

Result:

```js
{
  _: [],
  answer: {type: 'flag', count: 42}
}
```

</details>
</td>
</tr>
<tr name="numbersAsFlags">
<td><code><a href="#numbersAsFlags">numbersAsFlags</a>({errs, args})</code></td>
<td>
<details>
<summary>
<code>numbersAsFlags</code> transforms all numbers in <code>args</code> to flag objects.
The numbers are the flags' <code>count</code>s (e.g. <code>42</code> becomes <code>{type: 'flag', count: 42}</code>).
</summary>

<br />

Example:

```js
const args = {
  _: [],
  answer: 42
}

numbersAsFlags({args})
```

Result:

```js
{
  _: [],
  answer: {type: 'flag', count: 42}
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
<code>traverseArgs</code> transforms <code>args</code>
by applying functions <code>fs</code> to each key/value pair based on the value's type.
<code>fs</code> supports the following types:
<code>array</code>, <code>boolean</code>, <code>flag</code>, <code>function</code>, <code>null</code>,
<code>number</code>, <code>object</code>, <code>string</code>, <code>undefined</code>, and <code>otherwise</code>.
The default behavior for most types is to not change the value, with three notable exceptions:
<code>function</code>s and <code>otherwise</code>s key/value pairs are removed from args,
while <code>object</code>'s default function applies <code>fs</code> to nested objects.
<code>{flag: ({key, val, errs, args}) => ({errs, args})}</code>
is the signature for <code>fs</code> with fields for each type.
Many other <code>args</code> checks and stages are defined in terms of <code>traverseArgs</code>
and it is of great help for writing custom <code>args</code> stages.
</summary>

<br />

Example:

```js
const {traverseArgs} = require('shargs-parser')

const args = {
  verbose: {type: 'flag', count: 2},
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
    verbose: 2,
    answer: 42
  }
}
```

Allowed <code>fs</code> fields:

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

#### Advanced Parsers

+   [`toOpts` stage](#toOpts-stage)
+   [`toArgs` stage](#toArgs-stage)
+   [Custom checks and stages](#custom-checks-and-stages)

### Automatic Usage Documentation Generation

Writing adequate documentation for your programs is a very important part of professional software development
and does not happen in just one place.
Most software I am concerned with on my day job is documented in at least two of the following places:

1.  In READMEs with contributor-facing documentation.
2.  On Websites or wikis with developer-facing documentation.
3.  In LaTeX or Word documents with user-facing documentation.
4.  Behind a `--help` flag or in `man` pages in case of CLIs.
5.  In example projects demonstrating a program's or library's use.

So, if documentation has all shapes and sizes, we should not lock it up inside a command-line parser.
This is why [`shargs`][shargs] does not handle usage documentation for you,
but strictly separates the concerns of parsing command-line arguments and generating usage documentation.

However, the shargs ecosystem does not leave you high and dry:
The [`shargs-usage`][shargs-usage] module specializes on
generating terminal-based usage documentation for `--help` flags
from [command-line options](#command-line-options).
And I would love to see more modules handling the other cases of documentation in the future,
e.g. by generating HTML or Markdown from option definitions.

But for now, we have [`shargs-usage`][shargs-usage]:

```js
const {desc, optsLists, space, synopses, usage} = require('shargs-usage')

const docs = usage([
  synopses,
  space,
  optsLists,
  space,
  desc
])
```

[`shargs-usage`][shargs-usage] lets you define how your usage documentation should look like in a declarative way.
In the example, we tell our `docs` to start with [`synopses`](#synopses), have [`optsLists`](#optsLists) in the body,
and close with a [`desc`](#usage-desc)ription.
We separate these three parts with [`space`](#space)s and enclose everything in a [`usage`](#usage) function.

Note that we have not mentioned any command-line options, yet.
We have only told `docs` how the usage documentation should look like, not what should be documented.

But we do that next:

```js
const {flag, number, program, stringPos} = require('shargs-opts')

const opts = [
  stringPos('question', {desc: 'Ask a question.', required: true}),
  number('answer', ['-a', '--answer'], {desc: 'The answer.', defaultValues: [42]}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
]

const script = program('deepThought', opts, {
  desc: 'Deep Thought was created to come up with the Answer to ' +
        'The Ultimate Question of Life, the Universe, and Everything.'
})

const optsDocs = docs(script)
```

`optsDocs` now knows what to layout (`script`), and how how to layout it (`docs`).
But there is still one decision to be made:
How to `style` the different parts of the documentation:

```js
const style = {
  line: [{width: 60}],
  cols: [{width: 25}, {width: 35}]
}

const text = optsDocs(style)
```

Now, if we `console.log(text)`, the following `text` is printed to the console:

```bash
deepThought (<question>) [-a|--answer] [-h|--help]          
                                                            
<question>               Ask a question. [required]         
-a, --answer=<number>    The answer. [default: 42]          
-h, --help               Print this help message and exit.  
                                                            
Deep Thought was created to come up with the Answer to The  
Ultimate Question of Life, the Universe, and Everything.    
```

[`script`](#command-line-options), `docs`, and [`style`](#style)
are the moving parts of [automatic usage documentation generation](#automatic-usage-documentation-generation)
and they are defined independently.
We have already talked about [command-line options](#command-line-options) before
and will talk about [`style`](#style) in an upcoming section.

Here, we have a closer look at how to declare a usage documentation layout.

#### Usage Functions

[`shargs-usage`][shargs-usage] provides the following usage functions to declare layouts:

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Usage&nbsp;Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="usage-desc">
<td>
<code name="usage-descWith"><a href="#usage-desc">desc</a>({desc})(style)</code><br />
<code><a href="#usage-descWith">descWith</a>({id})({desc})(style)</code>
</td>
<td>
<details>
<summary>
<code>desc</code> takes a command-line option's <code><a href="#desc">desc</a></code> field
and formats it according to a <code><a href="#style">style</a></code>.
If the description is too long to fit one line, it is split and spread over several lines.
<code>desc</code> is defined as <code>descWith({id: 'line'})</code>.
</summary>

<br />

Example:

```bash
Deep Thought should answer the Ultimate 
Question                                
```

Code:

```js
const {desc} = require('shargs-usage')

const opt = {
  opts: [],
  desc: 'Deep Thought should answer the Ultimate Question'
}

const style = {
  line: [{width: 40}]
}

desc(opt)(style)
```

</details>
</td>
</tr>
<tr name="note">
<td>
<code name="noteWith"><a href="#note">note</a>(string)()(style)</code><br />
<code><a href="#noteWith">noteWith</a>({id})(string)()(style)</code>
</td>
<td>
<details>
<summary>
<code>note</code> takes a <code>string</code> and formats it according to a <code><a href="#style">style</a></code>,
completely ignoring its second parameter.
If the string is too long to fit one line, it is split and spread over several lines.
<code>note</code> is defined as <code>noteWith({id: 'line'})</code>.
</summary>

<br />

Example:

```bash
Deep Thought was created to come up with
the Answer                              
```

Code:

```js
const {note} = require('shargs-usage')

const style = {
  line: [{width: 40}]
}

note(
  'Deep Thought was created to come up with the Answer'
)()(style)
```

</details>
</td>
</tr>
<tr name="notes">
<td>
<code name="notesWith"><a href="#notes">notes</a>(strings)()(style)</code><br />
<code><a href="#notesWith">notesWith</a>({id})(strings)()(style)</code>
</td>
<td>
<details>
<summary>
<code>notes</code> takes a list of <code>strings</code> and formats it
according to a <code><a href="#style">style</a></code>,
completely ignoring its second parameter.
If a string is too long to fit one line, it is split and spread over several lines.
<code>notes</code> is defined as <code>notesWith({id: 'line'})</code>.
</summary>

<br />

Example:

```bash
Deep Thought was created to come up with
the Answer                              
to The Ultimate Question.               
```

Code:

```js
const {notes} = require('shargs-usage')

const style = {
  line: [{width: 40}]
}

notes([
  'Deep Thought was created to come up with the Answer',
  'to The Ultimate Question.'
])()(style)
```

</details>
</td>
</tr>
<tr name="optsDef">
<td>
<code name="optsDefWith"><a href="#optsDef">optsDef</a>({opts})(style)</code><br />
<code><a href="#optsDefWith">optsDefWith</a>({id, pad})({opts})(style)</code>
</td>
<td>
<details>
<summary>
<code>optsDef</code> layouts its <code>opts</code> as a definition list
and formats it according to its <code><a href="#style">style</a></code>.
The term part comprises of an opt's <code><a href="#args">args</a></code>, <code><a href="#descArg">descArg</a></code>,
<code><a href="#only">only</a></code>, <code><a href="#types">types</a></code>, and <code><a href="#key">key</a></code>
fields, followed by the
<code><a href="#contradicts">contradicts</a></code>, <code><a href="#defaultValues">defaultValues</a></code>,
<code><a href="#implies">implies</a></code>, and <code><a href="#required">required</a></code> fields.
The <code><a href="#desc">desc</a></code> field is given in the definition part.
<code>optsDef</code> is defined as <code>optsDefWith({id: 'line', pad: 4})</code>.
</summary>

<br />

Example:

```bash
-a, --answer=<number> [default: 42]     
    The answer.                         
-h, --help                              
    Prints help.                        
--version                               
    The version.                        
```

Code:

```js
const {optsDef} = require('shargs-usage')
const {flag, number} = require('shargs-opts')

const opt = {
  opts: [
    number('answer', ['-a', '--answer'], {
      desc: 'The answer.', defaultValues: ['42']
    }),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'The version.'})
  ]
}

const style = {
  line: [{width: 40}]
}

optsDef(opt)(style)
```

</details>
</td>
</tr>
<tr name="optsDefs">
<td>
<code name="optsDefsWith"><a href="#optsDefs">optsDefs</a>({opts})(style)</code><br />
<code><a href="#optsDefsWith">optsDefsWith</a>({id, pad})({opts})(style)</code>
</td>
<td>
<details>
<summary>
<code>optsDefs</code> first layouts its <code>opts</code> and then the <code><a href="#opts">opts</a></code>
of all its <code><a href="#command">command</a></code>s recursively, using <code><a href="#optsDef">optsDef</a></code>s,
indenting each <code><a href="#optsDef">optsDef</a></code> layer by four spaces.
<code>optsDefs</code> is defined as <code>optsDefsWith({id: 'line', pad: 4})</code>.
</summary>

<br />

Example:

```bash
-a, --answer=<number> [default: 42]     
    The answer.                         
-h, --help                              
    Show the usage docs.                
ask [required]                          
    Ask questions.                      
    -h                                  
        Usage docs.                     
    <questions>... [required]           
        Questions.                      
```

Code:

```js
const {optsDefs} = require('shargs-parser')
const {command, flag} = require('shargs-opts')
const {number, variadicPos} = require('shargs-opts')

const required = true

const askOpts = [
  flag('help', ['-h'], {desc: 'Show the usage docs.'}),
  variadicPos('questions', {required, desc: 'Questions.'})
]

const ask = command(askOpts)

const opt = {
  opts: [
    ask('ask', ['ask'], {desc: 'Ask questions.', required}),
    number('answer', ['-a', '--answer'], {
      desc: 'The answer.', defaultValues: ['42']
    }),
    flag('help', ['-h', '--help'], {desc: 'Usage docs.'})
  ]
}

const style = {
  line: [{width: 40}]
}

optsDefs(opt)(style)
```

</details>
</td>
</tr>
<tr name="optsList">
<td>
<code name="optsListWith"><a href="#optsList">optsList</a>({opts})(style)</code><br />
<code><a href="#optsListWith">optsListWith</a>({id})({opts})(style)</code>
</td>
<td>
<details>
<summary>
<code>optsList</code> layouts its <code>opts</code> as a <code><a href="#table">table</a></code> with two columns
and formats it according to its <code><a href="#style">style</a></code>.
The first column comprises of an opt's <code><a href="#args">args</a></code>, <code><a href="#descArg">descArg</a></code>,
<code><a href="#only">only</a></code>, <code><a href="#types">types</a></code>, and <code><a href="#key">key</a></code>
fields.
The <code><a href="#desc">desc</a></code> field is given in the second column, followed by the
<code><a href="#contradicts">contradicts</a></code>, <code><a href="#defaultValues">defaultValues</a></code>,
<code><a href="#implies">implies</a></code>, and <code><a href="#required">required</a></code> fields.
<code>optsList</code> is defined as <code>optsListWith({id: 'cols'})</code>.
</summary>

<br />

Example:

```bash
-a, --answer=<number>    The answer. [default: 42]
-h, --help               Prints help.             
--version                The version.             
```

Code:

```js
const {optsList} = require('shargs-usage')
const {flag, number} = require('shargs-opts')

const opt = {
  opts: [
    number('answer', ['-a', '--answer'], {
      desc: 'The answer.', defaultValues: ['42']
    }),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'The version.'})
  ]
}

const style = {
  cols: [{width: 25}, {width: 25}]
}

optsList(opt)(style)
```

</details>
</td>
</tr>
<tr name="optsLists">
<td>
<code name="optsListsWith"><a href="#optsLists">optsLists</a>({opts})(style)</code><br />
<code><a href="#optsListsWith">optsListsWith</a>({id})({opts})(style)</code>
</td>
<td>
<details>
<summary>
<code>optsLists</code> first layouts its <code>opts</code> and then the <code><a href="#opts">opts</a></code>
of all its <code><a href="#command">command</a></code>s recursively, using <code><a href="#optsList">optsList</a></code>s,
indenting the first column of each <code><a href="#optsList">optsList</a></code> layer by four spaces.
<code>optsLists</code> is defined as <code>optsListsWith({id: 'cols'})</code>.
</summary>

<br />

Example:

```bash
-a, --answer=<number>    The answer. [default: 42]
-h, --help               Usage docs.              
ask                      Ask questions. [required]
    -h                   Show the usage docs.     
    <questions>...       Questions. [required]    
```

Code:

```js
const {optsLists} = require('shargs-parser')
const {command, flag} = require('shargs-usage')
const {number, variadicPos} = require('shargs-usage')

const required = true

const askOpts = [
  flag('help', ['-h'], {desc: 'Show the usage docs.'}),
  variadicPos('questions', {required, desc: 'Questions.'})
]

const ask = command(askOpts)

const opt = {
  opts: [
    ask('ask', ['ask'], {desc: 'Ask questions.', required}),
    number('answer', ['-a', '--answer'], {
      desc: 'The answer.', defaultValues: ['42']
    }),
    flag('help', ['-h', '--help'], {desc: 'Usage docs.'})
  ]
}

const style = {
  cols: [{width: 25}, {width: 25}]
}

optsLists(opt)(style)
```

</details>
</td>
</tr>
<tr name="space">
<td>
<code name="spaceWith"><a href="#space">space</a>()(style)</code><br />
<code><a href="#spaceWith">spaceWith</a>({id, lines})()(style)</code>
</td>
<td>
<details>
<summary>
<code>space</code> ignores its first argument and returns a line consisting entirely of spaces,
with a width according to <code><a href="#style">style</a></code>.
<code>space</code> is defined as <code>spaceWith({id: 'line', lines: 1})</code>.
</summary>

<br />

Example:

```bash
Deep Thought was created to come up with
                                        
the Answer to The Ultimate Question.    
```

Code:

```js
const {note, space} = require('shargs-usage')

const style = {
  line: [{width: 40}]
}

usage([
  note('Deep Thought was created to come up with'),
  space,
  note('the Answer to The Ultimate Question.')
])()(style)
```

</details>
</td>
</tr>
<tr name="synopses">
<td>
<code name="synopsesWith"><a href="#synopses">synopses</a>({key, opts})(style)</code><br />
<code><a href="#synopsesWith">synopsesWith</a>({id})({key, opts})(style)</code>
</td>
<td>
<details>
<summary>
<code>synopses</code> first layouts its <code>opts</code> and then the <code><a href="#opts">opts</a></code>
of all its <code><a href="#command">command</a></code>s,
using a <code><a href="#synopsis">synopsis</a></code> each.
<code>synopses</code> is defined as <code>synopsesWith({id: 'line'})</code>.
</summary>

<br />

Example:

```bash
deepThought (-a|--answer) [-h|--help]   
deepThought ask [-h] (<questions>...)   
```

Code:

```js
const {synopses} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')
const {program, variadicPos} = require('shargs-opts')

const required = true

const askOpts = [
  flag('help', ['-h']),
  variadicPos('questions', {required})
]

const ask = command(askOpts)

const opts = [
  ask('ask', ['ask'], {required}),
  number('answer', ['-a', '--answer'], {required}),
  flag('help', ['-h', '--help'])
]

const script = program('deepThought', opts)

const style = {
  line: [{width: 40}]
}

synopses(script)(style)
```

</details>
</td>
</tr>
<tr name="synopsis">
<td>
<code name="synopsisWith"><a href="#synopsis">synopsis</a>({key, opts})(style)</code><br />
<code><a href="#synopsisWith">synopsisWith</a>({id})({key, opts})(style)</code>
</td>
<td>
<details>
<summary>
<code>synopsis</code> layouts the program's <code>name</code> in the first and its <code>opts</code>
in the second column of a <code><a href="#table">table</a></code>
and formats it according to its <code><a href="#style">style</a></code>.
For each opt, the <code><a href="#args">args</a></code>, <code><a href="#descArg">descArg</a></code>,
<code><a href="#only">only</a></code>, <code><a href="#required">required</a></code>,
<code><a href="#types">types</a></code>, and <code><a href="#key">key</a></code> fields
are used for a brief overview.
<code>synopsis</code> is defined as <code>synopsisWith({id: 'line'})</code>.
</summary>

<br />

Example:

```bash
deepThought (-a|--answer) [-h|--help]   
            [--version] <questions>...  
```

Code:

```js
const {synopsis} = require('shargs-usage')
const {flag, number} = require('shargs-opts')
const {program, variadicPos} = require('shargs-opts')

const opts = [
  number('answer', ['-a', '--answer'], {
    desc: 'The answer.', required: true
  }),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'The version.'}),
  variadicPos('questions')
]

const script = program('deepThought', opts)

const style = {
  line: [{width: 40}]
}

synopsis(script)(style)
```

</details>
</td>
</tr>
</table>

#### Usage Combinators

While [usage functions](#usage-functions) taken for themselves are useful,
they really begin to shine if they are combined.
This is what usage combinators are for.
In a way, usage combinators are higher-order usage functions in that they take other usage functions as parameters,
combine them somehow, and return a new one.

Let's see how usage combinators may be used to implement [`synopses`](#synopses):

```js
const {decorate, noCommands, onlyCommands, optsMap, synopsis, usage, usageMap} = require('shargs-usage')

const prefixKey = prefix => optsMap(opts => ({...opts, key: prefix + ' ' + opts.key}))

function synopses (opt) {
  return usage([
    noCommands(synopsis),
    decorate(prefixKey(opt.key), onlyCommands)(
      usageMap(synopses)
    )
  ])(opt)
}
```

This example uses [usage decorators](#usage-decorators), that are only introduced in the next section.
For now, you do not need to know what they are, as they work exactly as their name suggests:
[`noCommands`](#noCommands) removes all [`command`](#command)s from [`opts`](#opts) before applying a usage function,
[`onlyCommands`](#onlyCommands) removes everything but [`command`](#command)s from [`opts`](#opts),
[`optsMap`](#optsMap) applies a function to an option's [`opts`](#opts),
and [`decorate`](#decorate-usage) combines decorators.

The implementation of `synopses` uses two usage combinators:
[`usage`](#usage) and [`usageMap`](#usageMap).

[`usage`](#usage) is used to combine two usage functions:
A [`synopsis`](#synopsis) of all `opts`, but commands, and the usage function returned by [`usageMap`](#usageMap). 
[`usageMap`](#usageMap) iterates over all [`command`](#command)s
and recursively calls `synopses` on each [`command`](#command)'s [`opts`](#opts).
The recursion stops, if `opt`'s `opts` has no more [`command`](#command)s,
since usage functions with empty `opts` return an empty string.

Combinators are a powerful feature, as they let you build more complex things from smaller parts.
[`shargs-usage`][shargs-usage] provides the following usage combinators:

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Usage&nbsp;Combinator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="usage">
<td><code><a href="#usage">usage</a>(functions)(opt)(style)</code></td>
<td>
<details>
<summary>
<code>usage</code> takes a list of usage <code>functions</code>
that each take an <code>opt</code>, a <code>style</code> and return a string.
It then applies its own <code>opt</code> and <code>style</code> to each function,
and concatenates the resulting strings.
</summary>

<br />

Example:

```bash
deepThought [-a|--answer] [-h|--help] [--version] 
                                                  
-a, --answer=<number>    The answer.              
-h, --help               Prints help.             
--version                Prints version.          
                                                  
Deep Thought was created to come up with the      
Answer.                                           
```

Code:

```js
const {note, optsList, space} = require('shargs-usage')
const {synopsis, usage} = require('shargs-usage')
const {flag, number, program} = require('shargs-opts')

const opts = [
  number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
  flag('version', ['--version'], {desc: 'Prints version.'})
]

const script = program('deepThought', opts, {
  desc: 'Deep Thought was created to come up with the Answer.'
})

const style = {
  line: [{width: 50}],
  cols: [{width: 25}, {width: 25}]
}

usage([synopsis, space, optsList, space, desc])(script)(style)
```

</details>
</td>
</tr>
<tr name="usageMap">
<td><code><a href="#usageMap">usageMap</a>(f)({opts})(style)</code></td>
<td>
<details>
<summary>
<code>usageMap</code> takes a function <code>f</code> that takes an <code>opt</code>ion
and returns a <a href="#layout-functions">layout function</a>.
It maps <code>f</code> over the option's <code><a href="#opts">opts</a></code>
and applies its <code>style</code> to each resulting <a href="#layout-functions">layout function</a>.
Finally, it concatenates the resulting strings and returns the result.
</summary>

<br />

Example:

```bash
-a, --answer                            
    The answer.                         
-h, --help                              
    Prints help.                        
--version                               
    Prints version.                     
```

Code:

```js
const {text, textWith, usageMap} = require('shargs-usage')
const {flag, number} = require('shargs-opts')

const cmd = {
  opts: [
    number('answer', ['-a', '--answer'], {desc: 'The answer.'}),
    flag('help', ['-h', '--help'], {desc: 'Prints help.'}),
    flag('version', ['--version'], {desc: 'Prints version.'})
  ]
}

const style = {
  line: [{width: 40}]
}

usageMap(({args, desc}) => layout([
  text(args.join(', ')),
  textWith({id: 'desc'})(desc)
]))(cmd)(style)
```

</details>
</td>
</tr>
</table>

#### Usage Decorators

When defining layouts, we may want to feature some `opts` in one place,
and the others in a different place of our documentation.
For example, the [`command`](#command)s should be presented in a definition list,
while the other options are layed out as a table.

Usage decorators enable these use cases by modifying inputs of [usage functions](#usage-functions):

```js
const {desc, optsDef, optsList, space, synopsis, usage} = require('shargs-usage')
const {decorate, noCommands, onlyCommands, onlyFirstArg} = require('shargs-usage')

const decoratedDocs = usage([
  noCommands(onlyFirstArg(synopsis)),
  space,
  onlyCommands(optsDef),
  space,
  noCommands(optsList),
  space,
  desc
])
```

The example uses three different decorators:
[`noCommands`](#noCommands), [`onlyCommands`](#onlyCommands), and [`onlyFirstArg`](#onlyFirstArg).
Each of these decorators modifies the `opts` array in some way,
before passing it on to their wrapped [usage function](#usage-functions).
The first two focus on filtering `opts`:
[`noCommands`](#noCommands) removes all [`command`](#command)s,
while [`onlyCommands`](#onlyCommands) keeps only [`command`](#command)s.
[`onlyFirstArg`](#onlyFirstArg) goes one step further and modifies each option in `opts`,
removing all but the first argument in their [`args`](#args) fields.

[`shargs-usage`](#shargs-usage) has the following usage decorators:

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Usage&nbsp;Decorator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="justArgs">
<td><code><a href="#justArgs">justArgs</a>(args)(usageFunction)(opt)</code></td>
<td>
<details>
<summary>
<code>justArgs</code> modifies its <code>opt</code>
by removing all <code><a href="#opts">opts</a></code> that have no <code><a href="#args">args</a></code> field
or whose <code><a href="#args">args</a></code> do not contain any argument
given in the <code>args</code> list.
</summary>

<br />

Example:

```js
const {justArgs} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')

const style = {
  cols: [{width: 25}, {width: 25}]
}

const opt = {
  opts: [
    number('answer', ['-a', '--answer'], {
      desc: 'The answer'
    }),
    command([])('ask', ['ask'], {desc: 'Asks a question'}),
    flag('version', ['--version'], {desc: 'Prints version'})
  ]
}

justArgs(['-a'])(optsList)(opt)(style)
```

Result:

```bash
-a, --answer=<number>    The answer               
```

</details>
</td>
</tr>
<tr name="noCommands">
<td><code><a href="#noCommands">noCommands</a>(usageFunction)(opt)</code></td>
<td>
<details>
<summary>
<code>noCommands</code> modifies its <code>opt</code>
by removing all <code><a href="#command">command</a></code>s from its <code><a href="#opts">opts</a></code>.
</summary>

<br />

Example:

```js
const {noCommands} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')

const style = {
  cols: [{width: 25}, {width: 25}]
}

const opt = {
  opts: [
    number('answer', ['-a', '--answer'], {
      desc: 'The answer'
    }),
    command([])('ask', ['ask'], {desc: 'Asks a question'}),
    flag('version', ['--version'], {desc: 'Prints version'})
  ]
}

noCommands(optsList)({opts})(style)
```

Result:

```bash
-a, --answer=<number>    The answer               
--version                Prints version           
```

</details>
</td>
</tr>
<tr name="onlyCommands">
<td><code><a href="#onlyCommands">onlyCommands</a>(usageFunction)(opt)</code></td>
<td>
<details>
<summary>
<code>onlyCommands</code> modifies its <code>opt</code>
by keeping only <code><a href="#command">command</a></code>s in its <code><a href="#opts">opts</a></code>.
</summary>

<br />

Example:

```js
const {onlyCommands} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')

const style = {
  cols: [{width: 25}, {width: 25}]
}

const opt = {
  opts: [
    number('answer', ['-a', '--answer'], {
      desc: 'The answer'
    }),
    command([])('ask', ['ask'], {desc: 'Asks a question'}),
    flag('version', ['--version'], {desc: 'Prints version'})
  ]
}

onlyCommands(optsList)(opt)(style)
```

Result:

```bash
ask                      Asks a question          
```

</details>
</td>
</tr>
<tr name="onlyFirstArg">
<td><code><a href="#onlyFirstArg">onlyFirstArg</a>(usageFunction)(opt)</code></td>
<td>
<details>
<summary>
<code>onlyFirstArg</code> modifies its <code>opt</code>
by first keeping only <code><a href="#opts">opts</a></code> that have <code><a href="#args">args</a></code>
and by then removing all <code><a href="#args">args</a></code> but the first.
</summary>

<br />

Example:

```js
const {onlyFirstArg} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')

const style = {
  cols: [{width: 25}, {width: 25}]
}

const opt = {
  opts: [
    number('answer', ['-a', '--answer'], {
      desc: 'The answer'
    }),
    command([])('ask', ['ask'], {desc: 'Asks a question'}),
    flag('version', ['--version'], {desc: 'Prints version'})
  ]
}

onlyFirstArg(optsList)(opt)(style)
```

Result:

```bash
-a <number>              The answer               
ask                      Asks a question          
--version                Prints version           
```

</details>
</td>
</tr>
<tr name="optsFilter">
<td><code><a href="#optsFilter">optsFilter</a>(p)(usageFunction)(opt)</code></td>
<td>
<details>
<summary>
<code>optsFilter</code> modifies its <code>opt</code> by applying a filter with the predicate <code>p</code>,
whose function signature must be <code>opt => true|false</code> to its <code><a href="#opts">opts</a></code>.
Many other usage decorators are defined in terms of <code>optsFilter</code>
and it is of great help for writing custom ones.
</summary>

<br />

Example:

```js
const {optsFilter} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')

const style = {
  cols: [{width: 25}, {width: 25}]
}

const opt = {
  opts: [
    number('answer', ['-a', '--answer'], {
      desc: 'The answer'
    }),
    command([])('ask', ['ask'], {desc: 'Asks a question'}),
    flag('version', ['--version'], {desc: 'Prints version'})
  ]
}

optsFilter(
  ({types}) => types !== null
)(optsList)(opt)(style)
```

Result:

```bash
-a, --answer=<number>    The answer               
ask                      Asks a question          
--version                Prints version           
```

</details>
</td>
</tr>
<tr name="optsMap">
<td><code><a href="#optsMap">optsMap</a>(f)(usageFunction)(opt)</code></td>
<td>
<details>
<summary>
<code>optsMap</code> modifies its <code>opt</code> by applying a function <code>f</code>
to each option in <code><a href="#opts">opts</a></code>,
whose function signature must be <code>opt => opt</code>.
Many other usage decorators are defined in terms of <code>optsMap</code>
and it is of great help for writing custom ones.
</summary>

<br />

Example:

```js
const {optsMap} = require('shargs-usage')
const {command, flag, number} = require('shargs-opts')

const style = {
  cols: [{width: 25}, {width: 25}]
}

const opt = {
  opts: [
    number('answer', ['-a', '--answer'], {
      desc: 'The answer'
    }),
    command([])('ask', ['ask'], {desc: 'Asks a question'}),
    flag('version', ['--version'], {desc: 'Prints version'})
  ]
}

optsMap(
  opt => ({...opt, args: opt.args.slice(0, 1)})
)(optsList)({opts})(style)
```

Result:

```bash
-a <number>              The answer               
ask                      Asks a question          
--version                Prints version           
```

</details>
</td>
</tr>
</table>

#### Usage Decorator Combinators

If many usage decorators are applied to a usage function, things get unwieldy, fast:

```js
const {justArgs, noCommands, onlyFirstArg, synopsis} = require('shargs-usage')

const synopsis2 = noCommands(onlyFirstArg(justArgs(['--help'])(synopsis)))
```

In the example, `synopsis2` is decorated three times and the code is not very readable.
Usage decorator combinators facilitate a cleaner code layout:

```js
const {decorate, justArgs, noCommands, onlyFirstArg, synopsis} = require('shargs-usage')

const decorated = decorate(noCommands, onlyFirstArg, justArgs(['--help']))

const synopsis2 = decorated(synopsis)
```

This version of `synopsis2` is much more readable.
Note, that [`decorate`](#decorate-usage) applies its usage decorators from right to left.
As is apparent from the example, usage decorator combinators are usage decorators, themselves.

[`shargs-usage`][shargs-usage] has the following usage decorator combinators:

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Usage&nbsp;Decorator&nbsp;Combinator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="decorate-usage">
<td><code><a href="#decorate-usage">decorate</a>(decorators)(usageFunction)(opt)</code></td>
<td>
<code>decorate</code> takes many usage function <code>decorators</code>
and applies them to its <code>usageFunction</code> from right to left.
</td>
</tr>
</table>

#### Layout Functions

[Usage functions](#usage-functions) that are applied to an `opt`
are transformed into a group of functions called `layout functions`.
If we take a closer look at the signatures of usage and layout functions, this becomes apparent:

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Signature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="layout-function">
<td><a href="#layout-function">Layout Function</a></td>
<td align="right"><code>style => string</code></td>
<td>Layout functions take a <code>style</code> and return a <code>string</code>.</td>
</tr>
<tr name="usage-function">
<td><a href="#usage-function">Usage Function</a></td>
<td align="right"><code>opt => style => string</code></td>
<td>Usage functions take an <code>opt</code> and return a layout function.</td>
</tr>
</table>

In [`shargs-usage`][shargs-usage], an `opt`'s purpose is to provide the textual contents of layout functions
and the [usage functions](#usage-functions)' only job is to specify how this textual content is extracted from the `opt`.
The layout functions do the actual work of formatting strings.

Let's have a look at an example:

```js
const {br, defs, layout, table, text} = require('shargs-usage')

const askDocs = layout([
  table([
    ['deepThought ask', '[--format] [--no-html] [-h|--help] (<question>)']
  ]),
  br,
  defs([
    ['--format=<json|xml> [default: json]', 'Respond either with json or xml.'],
    ['--no-html', 'Remove HTML tags.'],
    ['-h, --help', 'Print this help message and exit.'],
    ['<question> [required]', 'State your question.']
  ]),
  br,
  text(
    'Deep Thought was created to come up with the Answer to ' +
    'The Ultimate Question of Life, the Universe, and Everything.'
  )
])
```

In the example, `askDocs` is a [`layout`](#layout) that comprises four different layout functions:
[`table`](#table), [`br`](#br), [`defs`](#defs), and [`text`](#text).
Depending on how we [`style`](#style) the [`layout`](#layout), we get different strings:

```js
const style = {
  line: [{width: 80}],
  cols: [{width: 16}, {width: 64}]
}

const string = askDocs(style)
```

If we `console.log(string)`, the following text is printed to the console:

```bash
deepThought ask [--format] [--no-html] [-h|--help] (<question>)                 
                                                                                
--format=<json|xml> [default: json]                                             
    Respond either with json or xml.                                            
--no-html                                                                       
    Remove HTML tags.                                                           
-h, --help                                                                      
    Print this help message and exit.                                           
<question> [required]                                                           
    State your question.                                                        
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything.                                             
```

Experiment with [`style`](#style) to get different layouts!

[`shargs-usage`][shargs-usage] gives you the following layout functions:

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Layout&nbsp;Function&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="br">
<td>
<code name="brWith"><a href="#br">br</a>(style)</code><br />
<code><a href="#brWith">brWith</a>({id, lines})(style)</code>
</td>
<td>
<details>
<summary>
<code>br</code> returns a <code><a href="#line">line</a></code> filled with spaces,
with a <code><a href="#width">width</a></code> according to <code><a href="#style">style</a></code>.
<code>br</code> is defined as <code>brWith({id: 'line', lines: 1})</code>.
</summary>

<br />

Example:

```bash
Deep Thought was created to come up with
the Answer                              
                                        
to The Ultimate Question.               
```

Code:

```js
const {br, layout, text} = require('shargs-usage')

const style = {
  line: [{width: 40}]
}

layout([
  text('Deep Thought was created to come up with the Answer'),
  br,
  text('to The Ultimate Question.')
])(style)
```

</details>
</td>
</tr>
<tr name="cols">
<td>
<code name="colsWith"><a href="#cols">cols</a>(columns)(style)</code><br />
<code><a href="#colsWith">colsWith</a>({id})(columns)(style)</code>
</td>
<td>
<details>
<summary>
<code>cols</code> takes a list of <code>columns</code>,
where each column is a list of strings corresponding to <code><a href="#line">line</a></code>s.
It formats the <code>columns</code> according to their <code><a href="#width">width</a></code>s
and cuts off strings that are too long.
<code>cols</code> is defined as <code>colsWith({id: 'cols'})</code>.
</summary>

<br />

Example:

```bash
-a, --answer=<number>    The answer. [default: 42]
-h, --help               Prints help.             
--version                Prints version.          
```

Code:

```js
const {cols} = require('shargs-usage')

const style = {
  cols: [{width: 25}, {width: 25}]
}

cols([
  [
    '-a, --answer=<number>',
    '-h, --help',
    '--version'
  ],
  [
    'The answer. [default: 42]',
    'Prints help.',
    'Prints version.'
  ]
])(style)
```

</details>
</td>
</tr>
<tr name="defs">
<td>
<code name="defsWith"><a href="#defs">defs</a>(tuples)(style)</code><br />
<code><a href="#defsWith">defsWith</a>({id, pad})(tuples)(style)</code>
</td>
<td>
<details>
<summary>
<code>defs</code> takes a list of <code>tuples</code>,
where each entry is a tuple of strings,
with a term at the first and a definition at the second position.
It formats its <code>tuples</code> as a definition list over two <code><a href="#line">line</a></code>s,
with the term in the first, and the definition in the second <code><a href="#line">line</a></code>.
If a term or definition extends its <code><a href="#line">line</a></code>,
it is continued in another <code><a href="#line">line</a></code>.
<code>defs</code> is defined as <code>defsWith({id: 'line', pad: 4})</code>.
</summary>

<br />

Example:

```bash
-a, --answer=<number> [default: 42]     
    The answer.                         
-h, --help                              
    Prints help.                        
--version                               
    Prints version.                     
```

Code:

```js
const {defs} = require('shargs-usage')

const style = {
  line: [{width: 40}]
}

defs([
  ['-a, --answer=<number> [default: 42]', 'The answer.'],
  ['-h, --help', 'Prints help.'],
  ['--version', 'Prints version.']
])(style)
```

</details>
</td>
</tr>
<tr name="line">
<td>
<code name="lineWith"><a href="#line">line</a>(string)(style)</code><br />
<code><a href="#lineWith">lineWith</a>({id})(string)(style)</code>
</td>
<td>
<details>
<summary>
<code>line</code> takes a <code>string</code>
and formats it according to a <code><a href="#style">style</a></code>'s <code><a href="#width">width</a></code>.
If a <code>string</code> exceeds its <code><a href="#width">width</a></code>, it is cut off,
otherwise, the <code><a href="#width">width</a></code> is filled up with spaces.
It ends with a line break.
<code>line</code> is defined as <code>lineWith({id: 'line'})</code>.
</summary>

<br />

Example:

```bash
Deep Thought was created to come up with
the Answer                              
```

Code:

```js
const {layout, line} = require('shargs-usage')

const style = {
  line: [{width: 40}]
}

layout([
  line('Deep Thought was created to come up with'),
  line('the Answer')
])(style)
```

</details>
</td>
</tr>
<tr name="lines">
<td>
<code name="linesWith"><a href="#lines">lines</a>(strings)(style)</code><br />
<code><a href="#linesWith">linesWith</a>({id})(strings)(style)</code>
</td>
<td>
<details>
<summary>
<code>lines</code> takes a list of <code>strings</code>
and layouts each <code>string</code> with <code><a href="#line">line</a></code>.
<code>lines</code> is defined as <code>linesWith({id: 'line'})</code>.
</summary>

<br />

Example:

```bash
Deep Thought was created to come up with
the Answer                              
to The Ultimate Question.               
```

Code:

```js
const {lines} = require('shargs-usage')

const style = {
  line: [{width: 40}]
}

lines([
  'Deep Thought was created to come up with',
  'the Answer',
  'to The Ultimate Question.'
])(style)
```

</details>
</td>
</tr>
<tr name="table">
<td>
<code name="tableWith"><a href="#table">table</a>(rows)(style)</code><br />
<code><a href="#tableWith">tableWith</a>({id})(rows)(style)</code>
</td>
<td>
<details>
<summary>
<code>table</code> takes a list of <code>rows</code>, lays it out as a borderless table,
and formats it according to a <code><a href="#style">style</a></code>.
If an entry exceeds the length of a column, it breaks into the next row.
<code>table</code> is defined as <code>tableWith({id: 'cols'})</code>.
</summary>

<br />

Example:

```bash
-a, --answer=<number>    The answer. [default: 42]
-h, --help               Prints help.             
--version                Prints version.          
```

Code:

```js
const {table} = require('shargs-usage')

const style = {
  cols: [{width: 25}, {width: 25}]
}

table([
  ['-a, --answer=<number>', 'The answer. [default: 42]'],
  ['-h, --help', 'Prints help.'],
  ['--version', 'Prints version.']
])(style)
```

</details>
</td>
</tr>
<tr name="text">
<td>
<code name="textWith"><a href="#text">text</a>(string)(style)</code><br />
<code><a href="#textWith">textWith</a>({id})(string)(style)</code>
</td>
<td>
<details>
<summary>
<code>text</code> takes a <code>string</code> and formats it according to a <code><a href="#style">style</a></code>.
If the <code>string</code> exceeds a line, it continues on the next.
<code>text</code> is defined as <code>textWith({id: 'line'})</code>.
</summary>

<br />

Example:

```bash
Deep Thought was created to come up with
the Answer                              
```

Code:

```js
const {text} = require('shargs-usage')

const style = {
  line: [{width: 40}]
}

text(
  'Deep Thought was created to come up with the Answer'
)(style)
```

</details>
</td>
</tr>
<tr name="texts">
<td>
<code name="textsWith"><a href="#texts">texts</a>(strings)(style)</code><br />
<code><a href="#textsWith">textsWith</a>({id})(strings)(style)</code>
</td>
<td>
<details>
<summary>
<code>texts</code> takes a list of <code>strings</code>
and layouts each <code>string</code> with <code><a href="#text">text</a></code>.
<code>texts</code> is defined as <code>textsWith({id: 'line'})</code>.
</summary>

<br />

Example:

```bash
Deep Thought was created to come up with
the Answer                              
to The Ultimate Question.               
```

Code:

```js
const {texts} = require('shargs-usage')

const style = {
  line: [{width: 40}]
}

texts([
  'Deep Thought was created to come up with the Answer',
  'to The Ultimate Question.'
])(style)
```

</details>
</td>
</tr>
</table>

#### Layout Combinators

Layout combinators are functions that wrap [layout functions](#layout-functions)
and return new [layout functions](#layout-functions).
They are the primary way of building more complex constructs from simpler components.
The following examples demonstrate the use of layout combinators:

```js
const {layout, layoutMap, textWith} = require('shargs-usage')

const defsWith = ({id}) => layoutMap(
  ([term, definition] = []) => layout([
    textWith({id})(term),
    textWith({id})(definition)
  ])
)
```

[`defsWith`](#defsWith) is implemented in terms of [`layout`](#layout), [`layoutMap`](#layoutMap),
and [`textWith`](#textWith).
It [`maps`](#layoutMap) over a list of `term` and `definition` pairs and `layout`s them as [`texts`](#texts).

[`shargs-usage`][shargs-usage] has the following layout combinators:

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Layout&nbsp;Combinator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="layout">
<td><code><a href="#layout">layout</a>(functions)(style)</code></td>
<td>
<details>
<summary>
<code>layout</code> takes a list of layout <code>functions</code>
that each take a <code>style</code> and return a string.
It then applies its own <code>style</code> to each function,
and concatenates the resulting strings.
</summary>

<br />

Example:

```js
const {layout, line} = require('shargs-usage')

const style = {
  line: [{width: 40}]
}

layout([
  line('Deep Thought was created to come up with'),
  line('the Answer')
])(style)
```

Result:

```bash
Deep Thought was created to come up with
the Answer                              
```

</details>
</td>
</tr>
<tr name="layoutMap">
<td><code><a href="#layoutMap">layoutMap</a>(f)(list)(style)</code></td>
<td>
<details>
<summary>
<code>layoutMap</code> takes a function <code>f</code> that takes any value
and returns a <a href="#layout-functions">layout function</a>.
It maps <code>f</code> over the <code>list</code>
and applies its <code>style</code> to each resulting <a href="#layout-functions">layout function</a>.
Finally, it concatenates the resulting strings and returns the result.
</summary>

<br />

Example:

```js
const {layout, layoutMap, textWith} = require('shargs-usage')

const defsWith = ({id}) => layoutMap(
  ([term, definition] = []) => layout([
    textWith({id})(term),
    textWith({id})(definition)
  ])
)

const defs = defsWith({id: 'line'})

const style = {
  line: [{width: 40}]
}

defs([
  ['-a, --answer=<number> [default: 42]', 'The answer.'],
  ['-h, --help', 'Prints help.'],
  ['--version', 'Prints version.']
])(style)
```

Result:

```bash
-a, --answer=<number> [default: 42]     
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

#### Layout Decorators

When working with [layout functions](#layout-functions) that take a [`style`](#style) as input,
you sometimes want to modify this [`style`](#style) just before it is passed to the function,
and only for this function call.
This is what layout decorators are for:

```js
const {layout, layoutMap, pad, text} = require('shargs-usage')

const defs = layoutMap(
  ([term, definition] = []) => layout([
    text(term),
    pad(['line', 0], 4)(text(definition))
  ])
)
```

The example shows a sample implementation of [`defs`](#defs) using the [`pad`](#pad) layout decorator.
Here, the `term`, as well as the `definition` have the same id, [`text`](#text)s default id `'line'`.
However, we want to add a padding of `4` spaces to the `definition`.
So we use [`pad`](#pad) to add `4` spaces to the id at the `['line']` path of [`style`](#style).

[`shargs-usage`][shargs-usage] ships with the following layout decorators:

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Layout&nbsp;Decorator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="pad">
<td>
<code><a href="#pad">pad</a>(path, spaces)(layoutFunction)(style)</code>
</td>
<td>
<details>
<summary>
<code>pad</code> looks up the style object at the <code>path</code> in its <code>style</code>
and modifies it, by adding a number of <code>spaces</code> to its <code><a href="#padStart">padStart</a></code>
and subtracting the same number from its <code><a href="#width">width</a></code>.
It then passes the modified <code><a href="#style">style</a></code> to its <code>layoutFunction</code>.
</summary>

<br />

Example:

```js
const {pad, table} = require('shargs-usage')

const style = {
  cols: [{width: 20}, {width: 20}]
}

pad(['cols', 0], 4)(
  table([['--answer', '42']])
)(style)
```

Result:

```js
    --answer        42                  
```

</details>
</td>
</tr>
<tr name="stylePath">
<td>
<code><a href="#stylePath">stylePath</a>(path, f)(layoutFunction)(style)</code>
</td>
<td>
<details>
<summary>
<code>stylePath</code> looks up the style object at the <code>path</code> in its <code><a href="#style">style</a></code>
and modifies it by applying the function <code>f</code> to it.
It then passes the modified <code><a href="#style">style</a></code> to its <code>layoutFunction</code>.
</summary>

<br />

```js
const {stylePath, table} = require('shargs-usage')

const pad4 = obj => ({
  ...obj,
  padStart: (obj.padStart || 0) + 4,
  width: obj.width - 4
})

const style = {
  cols: [{width: 20}, {width: 20}]
}

stylePath(['cols', 0], pad4)(
  table([['--answer', '42']])
)(style)
```

Result:

```js
    --answer        42                  
```

</details>
</td>
</tr>
</table>

#### Layout Decorator Combinators

If many decorators are applied to a [layout function](#layout-functions), the resulting code can get deeply nested:

```js
const {pad, table} = require('shargs-usage')

const style = {
  cols: [{width: 25}, {width: 30}]
}

pad(['cols', 0], 4)(
  pad(['cols', 1], 4)(
    table([
      ['-a, --answer=<number>', 'The answer. [default: 42]']
    ])
  )
)(style)
```

Layout decorator combinators avoid nesting deeply, by first collecting layout decorators and applying them all at once:

```js
const {decorate, pad, table} = require('shargs-usage')

const style = {
  cols: [{width: 25}, {width: 30}]
}

const decorated = decorate(pad(['cols', 0], 4), pad(['cols', 1], 4))

decorated(
  table([
    ['-a, --answer=<number>', 'The answer. [default: 42]']
  ])
)(style)
```

Note, that [`decorate`](#decorate-layout) applies layout decorators from right to left.

[`shargs-usage`][shargs-usage] contains the following layout decorator combinators:

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Layout&nbsp;Decorator&nbsp;Combinator&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Description</th>
</tr>
<tr name="decorate-layout">
<td><code><a href="#decorate-layout">decorate</a>(decorators)(layoutFunction)(style)</code></td>
<td>
<code>decorate</code> takes many layout function <code>decorators</code>
and applies them to its <code>layoutFunction</code> from right to left.
</td>
</tr>
</table>

#### Style

[Layout functions](#layout-functions) are transformed to strings by applying `style`s:

```js
const style = {
  line: [{width: 80}],
  cols: [{width: 25}, {width: 55}]
}
```

In the example, `style` provides the details for how many columns a usage documentation text should be wide,
and whether it should have padding.
A `style` is an object whose values are arrays of *style objects*, that must have a [`width`](#width) key,
and may have [`padEnd`](#padEnd) and [`padStart`](#padStart) keys:

<table>
<tr>
<th>Parameter</th>
<th>Type</th>
<th>Description</th>
</tr>
<tr name="padEnd">
<td><code><a href="#padEnd">padEnd</a></code></td>
<td>number</td>
<td>
<code>padEnd</code> defines a padding to the right.
It is filled with spaces.
</td>
</tr>
<tr name="padStart">
<td><code><a href="#padStart">padStart</a></code></td>
<td>number</td>
<td>
<code>padStart</code> defines a padding to the left.
It is filled with spaces.
</td>
</tr>
<tr name="width">
<td><code><a href="#width">width</a></code></td>
<td>number</td>
<td>
<code>width</code> defines the length of text.
The full length of the string is the <code>width</code>
plus <code><a href="#padEnd">padEnd</a></code> and <code><a href="#padStart">padStart</a></code>.
</td>
</tr>
</table>

#### Advanced Usage Documentation

+   [Custom usage functions](#custom-usage-functions)
+   [Custom layout functions](#custom-layout-functions)

### Writing Programs with Shargs

Two programs written with [`shargs`][shargs] may look completely different.
Since shargs does its best to keep out of the way, it has very little influence on a program's code layout.
It is safe to say that the only reliable similarity between shargs programs
is parsing `process.argv` with a parser at some point.

Before we go into the program, let us revisit some code snippets from earlier that we will reuse:

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Snippets&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
</tr>
<tr>
<td>
<details>
<summary>
<code>askOpts</code> from the <a href="#type-functions">Type functions</a> section.
</summary>

<br />

```js
const askOpts = [
  {key: 'format', args: ['--format'], types: ['string'], only: ['json', 'xml'],
   defaultValues: ['json'], desc: 'Respond either with json or xml.'},
  {key: 'html', args: ['--no-html'], types: [], reverse: true, desc: 'Remove HTML tags.'},
  {key: 'help', args: ['-h', '--help'], types: [], desc: 'Print this help message and exit.'},
  {key: 'question', types: ['string'], required: true, desc: 'State your question.'}
]
```

</details>
</td>
</tr>
<tr>
<td>
<details>
<summary>
<code>script</code> from the <a href="#command-line-options">Command-line options</a> section.
</summary>

<br />

```js
const {command, flag, number, program} = require('shargs-opts')

const opts = [
  command(askOpts)('ask', ['ask'], {required: true, desc: 'Ask a question.'}),
  number('answer', ['-a', '--answer'], {defaultValues: [42], desc: 'The answer.'}),
  flag('help', ['-h', '--help'], {desc: 'Print this help message and exit.'})
]

const script = program('deepThought', opts, {
  desc: 'Deep Thought was created to come up with the Answer to ' +
        'The Ultimate Question of Life, the Universe, and Everything.'
})
```

</details>
</td>
</tr>
<tr>
<td>
<details>
<summary>
<code>deepThought</code> from the <a href="#the-parser-function"><code>parser</code> function</a> section.
</summary>

<br />

```js
const {parser} = require('shargs')
const {cast, flagsAsBools, requireOpts, restrictToOnly} = require('shargs-parser')
const {reverseFlags, splitShortOpts} = require('shargs-parser')

const checks = {
  opts: [requireOpts]
}

const askChecks = {
  opts: [requireOpts]
}

const stages = {
  argv: [splitShortOpts],
  opts: [reverseFlags, restrictToOnly, cast],
  args: [flagsAsBools]
}

const parsers = {ask: parser(stages, {checks: askChecks})}

const deepThought = parser(stages, {checks, parsers, mode: 'sync'})
```

</details>
</td>
</tr>
<tr>
<td>
<details>
<summary>
<code>docs</code> from the
<a href="#automatic-usage-documentation-generation">automatic usage documentation generation</a> section.
</summary>

<br />

```js
const {desc, optsLists, space, synopses, usage} = require('shargs-usage')

const docs = usage([
  synopses,
  space,
  optsLists,
  space,
  desc
])
```

</details>
</td>
</tr>
<tr>
<td>
<details>
<summary>
<code>style</code> from the <a href="#style">style</a> section.
</summary>

<br />

```js
const style = {
  line: [{width: 80}],
  cols: [{width: 25}, {width: 55}]
}
```

</details>
</td>
</tr>
</table>

Just imagine these snippets were located in their own modules and imported for the program.
Then, a sample program written with shargs could be:

```js
const argv = process.argv.slice(2)
const {errs, args} = deepThought(script)(argv)

if (args.help) {
  const help = docs(script)(style)
  console.log(help)
  process.exit(0)
}

if (errs.length > 0) {
  errs.forEach(({code, msg}) => console.log(`${code}: ${msg}`))
  process.exit(1)
}

console.log(`The answer is: ${args.answer}`)
process.exit(0)
```

First, we skip the first two values of `process.argv`.
They are `node` and the file name and can be ignored.

We then parse the remaining `argv` with our `deepThought` parser and get two results:
A list of `errs`, and an `args` object with parsed argument values.
Based on those two results, we build our program.

If the `args.help` field is set, we print a `help` text generated from `docs` by applying `script` and `style`.
Then, we `exit` with exit code `0`.

E.g. if we run the program with `node ./deepThought --help`, the following text is printed:

```bash
deepThought [-a|--answer] [-h|--help]                                           
deepThought ask [--format] [--no-html] [-h|--help] (<question>)                 
                                                                                
-a, --answer=<number>    The answer. [default: 42]                              
-h, --help               Print this help message and exit.                      
ask                      Ask a question. [required]                             
    --format=<json|xml>  Respond either with json or xml. [default: json]       
    --no-html            Remove HTML tags.                                      
    -h, --help           Print this help message and exit.                      
    <question>           State your question. [required]                        
                                                                                
Deep Thought was created to come up with the Answer to The Ultimate Question of 
Life, the Universe, and Everything.                                             
```

If the `errs` array has errors, we print all errors and `exit` with exit code `1`.

E.g. if we execute `node ./deepThought --answer 5`, without specifying the required `ask` command,
the following text appears:

```bash
Required option is missing: An option that is marked as required has not been provided.
```

Otherwise, we print the `args.answer`.

E.g. if we run it with `node ./deepThought ask "What is the meaning of Life, the Universe, and Everything?"`,
it prints:

```bash
The answer is: 42
```

## More In-depth Documentation

While you may want to read the whole [documentation](#documentation) section when getting started,
this section is for topics that do not occur often and need to be consulted on a case by case basis.
You may still want to read this section to get the most out of shargs,
but feel free to skip it, start using shargs, and come back later.

### Advanced Command-line Parsers

Although we have talked about [`parser`](#the-parser-function) in quite some detail
in the [parser function](#the-parser-function) section
and about parser stages in [command-line parsers](#command-line-parsers),
some topics are left to be discussed, here.

#### `toOpts` Stage

The `toOpts` stage consists only of the <code><a href="#toOpts-stage">toOpts</a>(opts)({errs, argv})</code> function.
It transforms `argv` arrays into the [command-line options syntax](#command-line-options)
by matching the `argv` array with the [`args`](#args) and [`types`](#types) fields from its `opts`.
The order of the command-line options plays an important role, since `toOpts` works from left to right.

While transforming, `toOpts` encounters the following cases:

1.  **A string matches no `args` value:**\
    In this case, `toOpts` returns a [rest option](#rest) (e.g. `{values: 'foo'}` if `foo` is the string).
    If positional arguments are defined that have no [`values`](#values) yet,
    the `args` value goes to the first positional argument, instead.
    If the positional argument is variadic, it collects all remaining [rest](#rest) values.
2.  **A string matches an `args` value of exactly one option:**\
    Here, `toOpts` checks the [`types`](#types)' arity and reads a matching number of `argv`.
    If too few `argv` are available, it returns a [rest option](#rest) like in case 1.
    If enough `argv` are available,
    it returns the matching option, augmented with a [`values`](#values) field holding the `argv`.
3.  **A string matches an `args` value in several options:**\
    If this happens, `toOpts` proceeds as in case 2 for each option, with one addition:
    It checks if all options have the same arity as the first option.
    All options with the same arities are added a [`values`](#values) field.
    For all other options, an error is reported.

The `toOpts` key of the [`parser`](#command-line-parsers)'s [`stages`](#stages) field
lets users override the described behavior with their own functions.
Do this with caution, as it may break defined parser checks and stages.

#### `toArgs` Stage

Like [`toOpts`](#toOpts-stage), the `toArgs` stage takes just one function:
<code><a href="#toArgs-stage">toArgs</a>(parsers)({errs, opts})</code>.
It transforms `opts` arrays into an `args` object by applying three different stages in parallel:

1.  **Convert Non-commands:**\
    It converts all options that are not [`command`](#command)s, resulting in an object of key-values-pairs.
    The keys and values are taken from the option fields of the same name: [`key`](#key) and [`values`](#values).
    If an option does not have a [`values`](#values) field, it is ignored for now.
    All [rest options](#rest) (e.g. `{values: '--help'}`) are collected in the rest key `_` (e.g. `{_: ['--help']}`).
2.  **Convert Commands:**\
    Next, it converts all [`command`](#command) options.
    In the following, we refer to the parser of this `toArgs` stage as the *parent parser*
    and the [`command`](#command)s parsers as *child parsers*.

    The [`command`](#command)s' [`values`](#values) fields still have `argv`s that need to be processed by a parser.
    Thus, `toArgs` recursively calls the child parser of each [`command`](#command) to get `args` objects.

    At this point, the `args` objects may still have non-empty rest keys (e.g. `{_: ['--help']}`).
    These unmatched arguments may have been mistakenly assigned to the child command,
    although they actually belong to the parent.
    Therefore, non-empty rest keys are additionally parsed with the parent parser.

    The results of the child parsers and the results of the parent parser run are combined into a nested `args` object.
3.  **Set Default Values:**\
    Up to this point, only options with [`values`](#values) were processed.
    However, options without [`values`](#values) fields may still have [`defaultValues`](#defaultValues).
    This stage sets the [`values`](#values) of options without [`values`](#values)
    to the [`defaultValues`](#defaultValues).

The resulting `args` objects of the three stages are then merged together.

The `toArgs` key of the [`parser`](#command-line-parsers)'s [`stages`](#stages) field
lets users override the described behavior with their own functions.
Do this with caution, as it may break defined parser checks and stages.

#### Custom Checks and Stages

Shargs makes writing and using custom checks and stages very simple.
The only thing you have to do is to follow the correct function signatures for your check or stage,
as given in the [`stages`](#stages) and [`mode`](#mode) sections.
The following code snippets showcase very simple examples with the correct signatures.

Regardless of whether you implement a check or a stage, the most important thing to remember is:
Always pass on errors!

Custom `argv` stage example:

```js
function splitShortOpts ({errs = [], argv = []} = {}) {
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
    ({key, args, types, opts}) => (
      typeof key !== 'undefined' &&
      typeof types === 'undefined' &&
      Array.isArray(args) && Array.isArray(opts)
    )
  )

  if (!aCommand) {
    errs2.push({
      code: 'CommandRequired',
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
const {traverseArgs} = require('shargs-parser')

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

### Advanced Usage Generation

We have talked about [automatic usage documentation generation](#automatic-usage-documentation-generation) before.
But some topics do not come up every day and are discussed, here.

#### Custom Layout Functions

Using your own [layout function](#layout-function) is straightforward:
Your function only has to have the correct signature and it is ready to be used as a [layout function](#layout-function):
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

You may use `table2` as a [layout function](#layout-function) if you apply it to a `columns` array,
since that returns a function that takes a `style` argument and returns a `string`.

This is of course a very simplified example that makes many assumptions that are often not valid
and should not be made in real projects.
Your own function would most probably need much more validations and handling of edge cases.

#### Custom Usage Functions

Writing and using custom [usage functions](#usage-function) in shargs is very simple:
You only have to write a function with the correct signature and it can be used as a [usage function](#usage-function).
It must take an [`opt`](#command-line-options) object and a [`style` object](#style) and return a `string`.

The following example shows the custom `descs` function that displays the options' descriptions:

```js
const {text} = require('shargs-usage')

const desc = ({desc = ''} = {}) => text(desc)
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

### Error Codes

[`shargs`][shargs] and [`shargs-parser`][shargs-parser] report errors if a
[command-line option](#command-line-options)'s syntax is invalid, or if [`checks`](#checks) fail.
The following table contains all error codes currently in use and where they are thrown:

<table>
<tr>
<th>Code</th>
<th>Message</th>
<th>Thrown&nbsp;by</th>
</tr>
<tr name="ArgumentIsNotABool">
<td><code><a href="#ArgumentIsNotABool">ArgumentIsNotABool</a></code></td>
<td>The passed command line argument must either be 'true' or 'false'.</td>
<td>
<code><a href="#cast">cast</code>
</td>
</tr>
<tr name="ArgumentIsNotANumber">
<td><code><a href="#ArgumentIsNotANumber">ArgumentIsNotANumber</a></code></td>
<td>The passed command line argument must be a number.</td>
<td>
<code><a href="#cast">cast</code>
</td>
</tr>
<tr name="CommandRequired">
<td><code><a href="#CommandRequired">CommandRequired</a></code></td>
<td>No command found. Please use at least one command!</td>
<td>
<code><a href="#demandACommand">demandACommand</code>
</td>
</tr>
<tr name="ContradictionDetected">
<td><code><a href="#ContradictionDetected">ContradictionDetected</a></code></td>
<td>Some given keys contradict each other.</td>
<td>
<code><a href="#contradictOpts">contradictOpts</code>
</td>
</tr>
<tr name="DidYouMean">
<td><code><a href="#DidYouMean">DidYouMean</a></code></td>
<td>An unknown command-line argument was passed. Did you mean any of the following options?</td>
<td>
<code><a href="#suggestOpts">suggestOpts</code>
</td>
</tr>
<tr name="FalseArgsRules">
<td><code><a href="#FalseArgsRules">FalseArgsRules</a></code></td>
<td>Your args rules returned false. Please abide to the rules defined in verifyArgs.</td>
<td>
<code><a href="#verifyArgs">verifyArgs</code>
</td>
</tr>
<tr name="FalseArgvRules">
<td><code><a href="#FalseArgvRules">FalseArgvRules</a></code></td>
<td>Your argv rules returned false. Please abide to the rules defined in verifyArgv.</td>
<td>
<code><a href="#verifyArgv">verifyArgv</code>
</td>
</tr>
<tr name="FalseOptsRules">
<td><code><a href="#FalseOptsRules">FalseOptsRules</a></code></td>
<td>Your opts rules returned false. Please abide to the rules defined in verifyOpts.</td>
<td>
<code><a href="#verifyOpts">verifyOpts</code>
</td>
</tr>
<tr name="IllegalKeyName">
<td><code><a href="#IllegalKeyName">IllegalKeyName</a></code></td>
<td>An option key had an illegal name.</td>
<td>
<code><a href="#toOpts-stage">toOpts</code>
</td>
</tr>
<tr name="ImplicationViolated">
<td><code><a href="#ImplicationViolated">ImplicationViolated</a></code></td>
<td>Some given keys that imply each other are not all defined.</td>
<td>
<code><a href="#implyOpts">implyOpts</code>
</td>
</tr>
<tr name="IncompatibleTypes">
<td><code><a href="#IncompatibleTypes">IncompatibleTypes</a></code></td>
<td>Repeated options must either both be variadic or both not.</td>
<td>
<code><a href="#arrayOnRepeat">arrayOnRepeat</code>
</td>
</tr>
<tr name="InvalidArity">
<td><code><a href="#InvalidArity">InvalidArity</a></code></td>
<td>An option's types arity does not match its values arity.</td>
<td>
<code><a href="#verifyValuesArity">verifyValuesArity</code>
</td>
</tr>
<tr name="InvalidBoolMapping">
<td><code><a href="#InvalidBoolMapping">InvalidBoolMapping</a></code></td>
<td>The mapping provided to broadenBools must only map from 'true' or 'false' to a list of alternatives.</td>
<td>
<code><a href="#broadenBools">broadenBools</code>
</td>
</tr>
<tr name="InvalidDefaultValues">
<td><code><a href="#InvalidDefaultValues">InvalidDefaultValues</a></code></td>
<td>An option's defaultValues field has an invalid type. It must be an array with any values in it.</td>
<td>
<code><a href="#toArgs-stage">toArgs</code>
</td>
</tr>
<tr name="InvalidOptionsListInCombine">
<td><code><a href="#InvalidOptionsListInCombine">InvalidOptionsListInCombine</a></code></td>
<td>Options list in combine was undefined, null or empty.</td>
<td>
<code><a href="#toOpts-stage">toOpts</code>
</td>
</tr>
<tr name="InvalidRequiredPositionalArgument">
<td><code><a href="#InvalidRequiredPositionalArgument">InvalidRequiredPositionalArgument</a></code></td>
<td>
If a positional argument is required, all previous positional arguments must be required as well.
The required field must either be undefined, true or false.
</td>
<td>
<code><a href="#validatePosArgs">validatePosArgs</code>
</td>
</tr>
<tr name="InvalidTypes">
<td><code><a href="#InvalidTypes">InvalidTypes</a></code></td>
<td>Each argument must have a types key that must be null or an array.</td>
<td>
<code><a href="#toOpts-stage">toOpts</a></code><br />
<code><a href="#verifyValuesArity">verifyValuesArity</a></code>
</td>
</tr>
<tr name="InvalidValues">
<td><code><a href="#InvalidValues">InvalidValues</a></code></td>
<td>An option's values field has an invalid type.</td>
<td>
<code><a href="#verifyValuesArity">verifyValuesArity</code>
</td>
</tr>
<tr name="InvalidVariadicPositionalArgument">
<td><code><a href="#InvalidVariadicPositionalArgument">InvalidVariadicPositionalArgument</a></code></td>
<td>Only the last positional argument may be variadic.</td>
<td>
<code><a href="#validatePosArgs">validatePosArgs</code>
</td>
</tr>
<tr name="NonMatchingArgumentTypes">
<td><code><a href="#NonMatchingArgumentTypes">NonMatchingArgumentTypes</a></code></td>
<td>If arguments have the same arg, their types must either be equal or have the same length.</td>
<td>
<code><a href="#toOpts-stage">toOpts</code>
</td>
</tr>
<tr name="RequiredOptionMissing">
<td><code><a href="#RequiredOptionMissing">RequiredOptionMissing</a></code></td>
<td>An option that is marked as required has not been provided.</td>
<td>
<code><a href="#requireOpts">requireOpts</code>
</td>
</tr>
<tr name="UnexpectedArgument">
<td><code><a href="#UnexpectedArgument">UnexpectedArgument</a></code></td>
<td>An unexpected argument was used that has no option defined.</td>
<td>
<code><a href="#failRest">failRest</code>
</td>
</tr>
<tr name="ValueRestrictionsViolated">
<td><code><a href="#ValueRestrictionsViolated">ValueRestrictionsViolated</a></code></td>
<td>A value lies outside the allowed values of an option.</td>
<td>
<code><a href="#restrictToOnly">restrictToOnly</code>
</td>
</tr>
<tr name="WrongArgsRulesType">
<td><code><a href="#WrongArgsRulesType">WrongArgsRulesType</a></code></td>
<td>The args rules are of a wrong type, please provide a predicate with the following signature: (args) => boolean.</td>
<td>
<code><a href="#verifyArgs">verifyArgs</code>
</td>
</tr>
<tr name="WrongArgvRulesType">
<td><code><a href="#WrongArgvRulesType">WrongArgvRulesType</a></code></td>
<td>The argv rules are of a wrong type, please provide a predicate with the following signature: (argv) => boolean.</td>
<td>
<code><a href="#verifyArgv">verifyArgv</code>
</td>
</tr>
<tr name="WrongContradictsType">
<td><code><a href="#WrongContradictsType">WrongContradictsType</a></code></td>
<td>The contradicts field has the wrong type, please provide an array of command-line option keys.</td>
<td>
<code><a href="#contradictOpts">contradictOpts</code>
</td>
</tr>
<tr name="WrongFormatForRequiredOption">
<td><code><a href="#WrongFormatForRequiredOption">WrongFormatForRequiredOption</a></code></td>
<td>
A required option has values or defaultValues in the wrong format.
Default values are different depending on the command-line option type:
Commands take objects, flags take counts, and other options take arrays of the correct length.
</td>
<td>
<code><a href="#requireOpts">requireOpts</code>
</td>
</tr>
<tr name="WrongImpliesType">
<td><code><a href="#WrongImpliesType">WrongImpliesType</a></code></td>
<td>The implies field has the wrong type, please provide an array of command-line option keys.</td>
<td>
<code><a href="#implyOpts">implyOpts</code>
</td>
</tr>
<tr name="WrongOptsRulesType">
<td><code><a href="#WrongOptsRulesType">WrongOptsRulesType</a></code></td>
<td>
The opts rules are of a wrong type, please provide a predicate with the following signature: (options) => boolean.
</td>
<td>
<code><a href="#verifyOpts">verifyOpts</code>
</td>
</tr>
</table>

## FAQ

<table>
<tr>
<th>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Question&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
<th>Answer</th>
</tr>
<tr name="how-can-i-use-config-objects-with-shargs">
<td><b>How can I use config objects with shargs?</b></td>
<td>
<details>
<summary>
A <i>config object</i> in this question denotes an object that is used to read in default values from a file or a URI.
Shargs does not include reading and merging config objects because there are other specialized libraries for this task
that are easy to use alongside shargs.
There are several simple ways to combine shargs' <code>args</code> objects with config objects:
</summary>

<br />

If you just want to have default values, you may want to check out the [`defaultValues`](#defaultValues) options field.
If this does not suffice or you have a different problem, read on.

Say we have read in a `config` object from somewhere:

```js
const config = {
  question: 'How can I use config objects with shargs?',
  answer: 'Read the FAQ section!'
}
```

And we have run a shargs parser and have obtained the following `args` object:

```js
const args = {
  _: [],
  question: 'What is the meaning of life, the universe, and everything?'
}
```

Then *using* the config object would just mean merging the two objects:

```js
const preferArgs = {
  ...config,
  ...args
}

const preferConfig = {
  ...args,
  ...config
}
```

Of course these example merges are simple cases, because the objects are *flat*.

In case of [`command`](#command)s, the `args` object would have (deeply) nested objects.
Such cases are common and there are specialized libraries for merging deeply nested objects,
like [ramda][ramda] or [lodash][lodash]:

```js
const {mergeDeepLeft, mergeDeepRight} = require('ramda')

const preferArgs = mergeDeepLeft(args, config)

const preferConfig = mergeDeepRight(args, config)
```

</details>
</td>
</tr>
<tr name="why-key-field">
<td><b>Why do command-line options have a <code>key</code> field?</b></td>
<td>
<details>
<summary>
The <code><a href="#key">key</a></code> field is an apparent difference between shargs and other command-line parsers.
So one might ask, why shargs uses it, while other parsers do not need it.
But as is mostly the case, shargs has good reasons:
</summary>

<br />

Command-line parsers read arguments and assign them to variables that are passed as inputs to programs.
So we are dealing with two different sets of names, here: Names of arguments and names of variables.
Those two sets are connected by a unidirectional mapping, where arguments map to variable names.

If a single argument would only ever map to a single variable, the two could just as well have the same name.
But for more complex mappings, things start to get complex, too:

Say we have two arguments, `-v` and `--version`, that can be used interchangeably.
If they would map to two variables, `-v` and `--version`,
the program would have to have knowledge about the arguments being interchangeable,
in order to correctly interpret its inputs.
As leaking this knowledge to the program would be undesirable,
parsers usually work around this by assigning the value of one argument to both variables.
But now we are in a situation where we have two dependant variables that always have the same value.
A less verbose solution is just letting both arguments map to the same variable (the [`key`](#key) field):

```js
const {string} = require('shargs-opts')

const opts = [
  string('version', ['-v', '--version'])
]
```

A special situation of two arguments mapping to the same variable is, when the arguments belong to separate options.
This frequently occurs for [`flag`](#flag) and [`bool`](#bool) options that have a [`complement`](#complement):

```js
const {flag} = require('shargs-opts')

const opts = [
  flag('fun', ['--fun']),
  flag('fun', ['--no-fun'], {reverse: true})
]
```

In the example, `--fun` adds `1` to the flag count, while `--no-fun` adds `-1` due to [`reverse`](#reverse)
(assuming the parser has the [`reverseFlags`](#reverseFlags) stage).

But we have other possible mappings yet to explore:
Situations, where one argument maps to two different variable names.
Say we have a `--birthday` argument and the `birthday` and `age` variables.
`birthday` is a string in date format, while `age` is a number holding the current age,
transformed by the custom `ageAsNumber` stage.
This kind of mapping is only possible if the parser's arguments are independent of the program's variables.

So, command-line options have a `key` field, because:

1.  Separating internal variable names from external argument names is a good practice.
2.  Separating argument and variable names enables functionality that would otherwise not be possible.
3.  Separating arguments and variables makes interpreting variables less verbose for programs.

If you really do not need `key` fields and wish to use just argument names instead,
it is straight forward to adjust the type function syntax accordingly:

```js
const array2 = types => (args = [], fields = {}) => ({
  key: args.length > 0 ? args[0] : undefined,
  args,
  types,
  ...fields
})

const number2 = array2(['number'])

// ...
```

</details>
</td>
</tr>
<tr name="custom-command-line-options-date">
<td><b>Can I use custom command-line option <code><a href="#types">types</a></code> like <code>date</code>?</b></td>
<td>
<details>
<summary>
Yes, you can add and use your own option types.
Both, the command-line options DSL and the parser functions have been designed with this in mind:
</summary>

<br />

Say you want to add your own custom `date` type.
First, you need to add a [command-line option](#command-line-options) of that type:

```js
const {array} = require('shargs-opts')

const date = array(['date'])
```

A `date` is an option that takes exactly one argument, whose type is described as `'date'`.

Now we have an option, we may want to write parser stages that work with `dates`.
How about a stage that transforms dates to their millisecond representation:

```js
const {traverseOpts} = require('shargs-parser')

function dateToMillis ({errs = [], opts = []} = {}) {
  const isDate = ({types}) => (
    Array.isArray(types) &&
    types.length === 1 &&
    types[0] === 'date'
  )

  const toMillis = string => new Date(string).getTime()

  const dateToMillis = opt => ({
    opts: [{
      ...opt,
      ...(Array.isArray(opt.values)
          ? {values: opt.values.map(toMillis)}
          : {}
      )
    }]
  })

  return traverseOpts(isDate)(dateToMillis)({errs, opts})
}
```

This parser stage works alongside the other parser stages.
Note, that a real implementation would test much more edge cases, like dates that occur in arrays.

</details>
</td>
</tr>
<tr name="comma-separated-values">
<td><b>Can I use comma-separated values to define <code><a href="#array">arrays</a></code>?</b></td>
<td>
<details>
<summary>
<code><a href="https://github.com/Yord/shargs-parser">shargs-parser</a></code> does not include a parser stage
to split comma-separated values into arrays.
But it is easy enough to write a stage yourself:
</summary>

<br />

We are inventing a new option type for this FAQ: `commas`:

```js
const {array} = require('shargs-opts')

const commas = array(['commas'])
```

The `commas` type function is used to mark options we want to split.

We then write a custom [`opts` stage](#opts-stages) to perform the splitting:

```js
const {traverseOpts} = require('shargs-parser')

const isCommas = ({key, types, values}) => (
  typeof key !== 'undefined' &&
  Array.isArray(types) && types.indexOf('commas') > -1 &&
  Array.isArray(values) && values.length === types.length
)

const transformCommaArray = opt => {
  let values = []
  let types  = []

  for (let i = 0; i < opt.values.length; i++) {
    const value = opt.values[i]
    const type = opt.types[i]

    if (type === 'commas') {
      const elements = value.split(',')
      values = [...values, ...elements]
      types = [...types, ...Array.from({length: elements.length}, () => 'string')]
    } else {
      values.push(value)
      types.push(type)
    }
  }

  return {opts: [{...opt, types, values}]}
}

const splitCommas = traverseOpts(isCommas)(transformCommaArray)
```

`splitCommas` may now be used with options of type `commas`!

So why doesn't `shargs-parser` support comma-separated values by default?
The reason is that using comma-separated values is just not that common.
And if you nonetheless need comma-separated values, it is simple enough to implement yourself.

</details>
</td>
</tr>
<tr name="why-no-no">
<td><b>Why are <code>--no-*</code> arguments not reversed by the <code>bestGuess*</code> stages?</b></td>
<td>
The reason is because there is no simple way to opt-out of this functionality, once it is employed.
You could add an <code>optOutReverse</code> parameter to each <code>bestGuess*</code> stage, I guess,
but that would clutter the stages' signatures.
So shargs decided to leave interpreting these arguments to the individual programs.
</td>
</tr>
<tr name="option-cardinalities-0-1">
<td><b>Can I have command-line options with 0..1 values?</b></td>
<td>
<details>
<summary>
An example for such an option would be ternary logics types,
like <code>true</code>, <code>false</code>, <code>unknown</code>,
that could be represented as a mixture of <code><a href="#flag">flags</a></code>
and <code><a href="#bool">bools</a></code>.
Shargs does not support such options out of the box, but you can implement them with some gotchas:
</summary>

<br />

We generally recommend against using options with 0..1 cardinalities in programs.
This is also why shargs does not support it.

A better approach is using an enumeration, implemented with the [`only`](#only) options field
and the [`restrictToOnly`](#restrictToOnly) parser stage.

If you want to use it anyway, here is how you could do it in shargs:

Flags give you only two cases, the presence of the flag (`true` if [`flagsAsBools`](#flagsAsBools) is used),
and its absence (`unknown`):

```js
const {flag} = require('shargs-opts')

const fun = flag('fun', ['--fun'])
```

You could add a third case by using only `flags` by defining a complement:

```js
const {complement} = require('shargs-opts')

const noFun = complement('--no-')(fun)
```

Which is the same as writing:

```js
const noFun = flag('fun', ['--no-fun'], {reverse: true})
```

If you provide `--fun`, the `fun` variable is set to `true`, on `--no-fun` it is set to `false`,
and providing neither `--fun`, nor `--no-fun` would mean `unknown`.

You could implement the same behavior with an option that takes none or one argument,
by using a combination of variable length arrays, aka [`commands`](#command) and a custom command-line options field.
The general idea is to mark a `command` as `threeValued` with a flag,
and then transform it to a custom type in the opts stage.

First, let us define an option:

```js
const {command} = require('shargs-opts')

const fun = command('fun', ['--fun'], {threeValued: true})
```

Now, let us define an [`opts`](#opts-stages) stage that transforms the `command`:

```js
const {traverseOpts} = require('shargs-parser')

const isThreeValued = ({threeValued}) => threeValued === true

const toThreeValued = opt => {
  const types = ['threeValued']

  const interpretValues = values => (
    values.length === 0         ? 'true' :
    values[0]     === 'true'    ? 'true' :
    values[0]     === 'false'   ? 'false'
                                : 'unknown'
  )

  const values = (
    !Array.isArray(opt.values)
      ? 'unknown'
      : interpretValues(opt.values)
  )

  const {threeValued, opts, ...rest} = opt

  return {
    opts: [
      {...rest, types, values}
    ]
  }
}

const commandsToThreeValued = traverseOpts(isThreeValued)(toThreeValued)
```

`commandsToThreeValued` only transforms `commands` that have the `threeValued` field.
For each `command`, it checks, whether the `command` is not present (`unknown`),
it is present but has no values (`true`), or if it is present and has at least one value,
(`true` if the value is `true`, `false` if it is `false`, otherwise `unknown`).

Note that a `command` takes all arguments following it, not just the first.
However, the `toArgs` stages reparses those arguments with the parent parser, so they are not lost.
But the parent parser does not run [`checks`](#checks).

Also note that this demonstration implementation is very brittle and should not be used as presented in a program.

</details>
</td>
</tr>
<tr name="can-i-use-enums">
<td><b>Can I use enums?</b></td>
<td>
<details>
<summary>
Yes, you can use enums with a combination of <code><a href="#string">string</a></code> command-line options,
the <code><a href="#only">only</a></code> options field,
and the <code><a href="#restrictToOnly">restrictToOnly</a></code> parser stage:
</summary>

<br />

```js
const {string} = require('shargs-opts')

const answers = string('answers', ['-a'], {only: ['yes', 'no', 'maybe']})
```

</details>
</td>
</tr>
<tr name="nest-keys">
<td><b>Can I use keys like <code>'a.b'</code>, indicating object fields?</b></td>
<td>
<details>
<summary>
Some command-line parsers allow arguments of the form <code>--a.b 42</code>,
whose values are stored in nested objects <code>{a: {b: 42}}</code>.
Shargs does not provide this functionality.
However, it is very easy to write your own parser stage for it:
</summary>

<br />

First, let us write a helper function for traversing `args` objects:

```js
function traverseKeys (p) {
  return f => ({errs, args}) => Object.keys(args).reduce(
    ({errs, args: obj}, key) => {
      const val = args[key]
      if (!Array.isArray(val) && typeof val === 'object') {
        obj[key] = traverseKeys(p)(f)(val)
      }
      if (p(key)) {
        const {[key]: _, ...rest} = obj
        obj = {...rest, ...f(key, val)}
      }
      return {errs, args: obj}
    },
    {errs, args}
  )
}
```

Using `traverseKeys`, we can implement a `nestKeys` [`args` stage](#args-stages):

```js
const _ = require('lodash')

const hasDots = key => key.indexOf('.') > -1

const nestValue = (key, val) => {
  const obj = {}
  _.set(obj, key, val)
  return obj
}

const nestKeys = traverseKeys(hasDots)(nestValue)
```

The `nestKeys` args stage should now nest the values into an object.

The reason why shargs does not include such a stage by default is,
that this is a niche case that can be either implemented after parsing,
or is easy enough to implement yourself.

</details>
</td>
</tr>
<tr name="shargs-tacit">
<td><b>Why do shargs' functions have several parameter lists?</b></td>
<td>
<details>
<summary>
Many functions have an unusual signature, like <code><a href="#text">text</a>(string)(style)</code>
and the question arises, why it is not <code><a href="#text">text</a>(string, style)</code>, instead.
The reason has to do with function composition
and <a href="https://en.wikipedia.org/wiki/Tacit_programming">tacit programming</a>:
</summary>

<br />

[`shargs`][shargs] builds command-line parsers and usage documentation by composing parser
and usage functions with functions it calls *combinators*.
An exemplary combinator function is <code><a href="#layout">layout</a>(functions)(style)</code>.

`layout` takes a list of `functions` that have a common signature:
They take a [`style`](#style), and return a string.
Next, it takes its own `style` parameter and feeds it to each function, getting a list of strings.
Then it concatenates all strings together, which results in a string:

```js
const {layout, text} = require('shargs-usage')

const style = {line: [{width: 10}]}

const string = layout([
  text('First.'),
  text('Second.')
])(style)

// string === 'First.    \nSecond.   \n'
```

What [`layout`](#layout) basically gives us is a way to provide only one `style` parameter to a list of functions,
instead of one parameter per function.
But why does [`layout`](#layout) have to have such a weird signature?

Let us assume we had the following `layout2` and `text2` functions, instead:

```js
const {layout, text} = require('shargs-usage')

const layout2 = (functions, style) => layout(functions)(style)

const text2 = (string, style) => text(string)(style)
```

How could we concatenate strings only using `text2`?

```js
const style = {line: [{width: 10}]}

const string = text2('First.', style) + text2('Second.', style)

// string === 'First.    \nSecond.   \n'
```

Do you see how the `style` parameter is repeated for every function?
It gets worse if you have more functions.

Now let us use `layout2`:

```js
const style = {line: [{width: 10}]}

const string = layout2([
  style => text2('First.', style),
  style => text2('Second.', style)
], style)

// string === 'First.    \nSecond.   \n'
```

See how `style` is still repeated and we do not have the advantage of only providing it once?
Actually, using `layout2` looks worse than using just `text2`!

But we can do better and rewrite the same example with `text` and two parameter lists:

```js
const {text} = require('shargs-usage')

const style = {line: [{width: 10}]}

const string = layout2([
  style => text('First.')(style),
  style => text('Second.')(style)
], style)

// string === 'First.    \nSecond.   \n'
```

And then we can apply an optimization:
See how we define a function that takes a `style` and feed it to a function `text('First.')` that takes a `style`?
This is redundant, and we can just leave out `style` altogether:

```js
const {text} = require('shargs-usage')

const style = {line: [{width: 10}]}

const string = layout2([
  text('First.'),
  text('Second.')
], style)

// string === 'First.    \nSecond.   \n'
```

Now we do not repeat `style` for every function!
The code is much shorter and is easier to read.

And we can do even better by using a signature like `layout`.
Because then `layout` is also a function that takes a `style` and returns a string,
like `text`, and can be used inside other `layout` functions!

```js
const {layout, text} = require('shargs-usage')

const style = {line: [{width: 10}]}

const firstSecond = layout([
  text('First.'),
  text('Second.')
])

const andThird = layout([
  firstSecond,
  text('Third.')
])

const string = andThird(style)

// string === 'First.    \nSecond.   \nThird.    \n'
```

And although we have five functions that each take a `style` parameter, we only have to apply it once.

Shargs employs tacit programming techniques to reduce boilerplate in its DSLs.
A side-effect is that function signatures are weird (the technical term is *curried*).

Some JavaScript libraries like [Ramda][ramda] and [lodash/fp][lodash-fp] use a technique called *auto-currying*.
If `layout` would be auto-curried, it would have the signatures of `layout`
and `layout2` at the same time and you could choose which one to use.
Shargs decided against auto-currying its functions,
since it is simple enough to [`curry`](https://ramdajs.com/docs/#curry) your functions yourself if you wanted:

```js
const {curry} = require('ramda')
const {layout} = require('shargs-usage')

const curriedLayout = curry((fs, style) => layout(fs)(style))
```

`curriedLayout` can now be used like `layout` and like `layout2`.

</details>
</td>
</tr>
</table>

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
<td>
Shargs turns command-line arguments parsing inside out
and gives you fine-grained control over parser stages and usage docs.
</td>
<td>
Yargs helps you build interactive command line tools, by parsing arguments and generating an elegant user interface.
</td>
<td>
The complete solution for node.js command-line interfaces, inspired by Ruby's commander.
</td>
<td>
Minimist is the guts of optimist's argument parser without all the fanciful decoration.
</td>
</tr>
<tr>
<td><b>Focus</b></td>
<td>
A command-line parser library with a focus on enabling developers to easily
and quickly build their own parsers of just the right size.
</td>
<td>
A large parser with lots of features with a focus on providing the options out of the box.
</td>
<td>
A medium parser with a strong focus on a textual DSL that makes it easy to define options.
</td>
<td>
A tiny parser, mostly without an options schema, with a strong focus on optimistic parsing.
</td>
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
<td>
Pick and choose your <a href="#command-line-parsers">parser checks and stages</a>,
write and use <a href="#custom-checks-and-stages">custom checks and stages</a>,
and optionally define <a href="#parsers">command-specific parsers</a>.
</td>
<td>
You can
<a href="https://github.com/yargs/yargs/blob/master/docs/advanced.md#customizing-yargs-parser">turn on and off</a>
some of yargs' parsing features,
and use a kind of <a href="https://github.com/yargs/yargs/blob/master/docs/advanced.md#middleware">middleware</a>
similar to shargs' <code>args</code> stages.
</td>
<td>
You may specify a function to do
<a href="https://github.com/tj/commander.js#custom-option-processing">custom processing of option values</a>.
</td>
<td>
None that I am aware of.
</td>
</tr>
<tr>
<td><b>Customize Usage Docs</b></td>
<td>
Use a DSL with many options to build
<a href="#automatic-usage-documentation-generation">custom usage documentation layouts</a>
with fine-grained control over <a href="#style">styles</a>.
</td>
<td>
Allows specifying the <a href="https://github.com/yargs/yargs/blob/master/docs/api.md#scriptname0">scriptName</a>,
a <a href="https://github.com/yargs/yargs/blob/master/docs/api.md#usagemessagecommand-desc-builder-handler">usage</a> 
string,
an <a href="https://github.com/yargs/yargs/blob/master/docs/api.md#epiloguestr">epilogue</a>,
<a href="https://github.com/yargs/yargs/blob/master/docs/api.md#examplecmd-desc">examples</a> as strings,
and the number of columns after which to
<a href="https://github.com/yargs/yargs/blob/master/docs/api.md#wrapcolumns">wrap</a>.
</td>
<td>
Display extra information by
<a href="https://github.com/tj/commander.js#custom-help">listening to the <code>--help</code> event</a>,
customize <a href="https://github.com/tj/commander.js#usage-and-name">program name and usage description</a>,
and <a href="https://github.com/tj/commander.js#addhelpcommand">add custom description text</a>.
</td>
<td>
None that I am aware of.
</td>
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
[lodash]: https://github.com/lodash/lodash
[lodash-fp]: https://github.com/lodash/lodash/wiki/FP-Guide
[node]: https://nodejs.org/
[npm-package]: https://www.npmjs.com/package/shargs
[ramda]: https://ramdajs.com/docs/#mergeDeepLeft
[shargs]: https://github.com/Yord/shargs
[shargs-example-async]: https://github.com/Yord/shargs-example-async
[shargs-example-deepthought]: https://github.com/Yord/shargs-example-deepthought
[shargs-opts]: https://github.com/Yord/shargs-opts
[shargs-parser]: https://github.com/Yord/shargs-parser
[shargs-usage]: https://github.com/Yord/shargs-usage
[shield-license]: https://img.shields.io/npm/l/shargs?color=yellow&labelColor=313A42
[shield-node]: https://img.shields.io/node/v/shargs?color=red&labelColor=313A42
[shield-npm]: https://img.shields.io/npm/v/shargs.svg?color=orange&labelColor=313A42
[shield-prs]: https://img.shields.io/badge/PRs-welcome-green.svg?labelColor=313A42
[shield-unit-tests-linux]: https://github.com/Yord/shargs/workflows/linux/badge.svg?branch=master
[shield-unit-tests-macos]: https://github.com/Yord/shargs/workflows/macos/badge.svg?branch=master
[shield-unit-tests-windows]: https://github.com/Yord/shargs/workflows/windows/badge.svg?branch=master
[then]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise/then