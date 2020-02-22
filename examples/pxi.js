const {command, flag, string} = require('../src/options')

const from = [
  command('id', ['id'], {opts: []}),
  command('dsv', ['dsv'], {
    desc: 'is a delimiter-separated values deserializer.',
    opts: [
      string('ddelimiter',     ['--ddelimiter', '--delimiter', '-D'],                 {desc: 'Delimiter used to separate values.'}),
      string('dquote',         ['--dquote', '--quote', '-Q'],                         {desc: 'Character used to quote strings.'}),
      string('descape',        ['--descape', '--escape', '-C'],                       {desc: 'Character used to escape quote in strings.'}),
      string('dheader',        ['--dheader', '--header', '-H'],                       {desc: 'Provide a custom header as a JSON array string.'}),
      string('dheaderPrefix',  ['--dheader-prefix', '--header-prefix', '-P'],         {desc: 'In cases where more values are given than headers, this prefix is used to generate a header name for the remaining values.'}),
      flag('dskipHeader',      ['--dskip-header', '--skip-header', '-S'],             {desc: 'Do not interpret first line as header.'}),
      flag('dfixedLength',     ['--dfixed-length', '--fixed-length', '-F'],           {desc: 'Post-processing #1: Controls, whether each line has the same number of values. Ignores all deviating lines while reporting errors.'}),
      flag('dskipEmptyValues', ['--dskip-empty-values', '--skip-empty-values', '-E'], {desc: 'Post-processing #2: Skip values that are empty strings.'}),
      flag('dtrimWhitespaces', ['--dtrim-whitespaces', '--trim-whitespaces', '-W'],   {desc: 'Post-processing #3: Trim whitespaces around values.'}),
      flag('demptyAsNull',     ['--dempty-as-null', '--empty-as-null', '-I'],         {desc: 'Post-processing #4: Treat empty fields as null.'}),
      flag('dskipNull',        ['--dskip-null', '--skip-null', '-N'],                 {desc: 'Post-processing #5: Skip values that are null.'}),
      flag('dmissingAsNull',   ['--dmissing-as-null', '--missing-as-null', '-M'],     {desc: 'Post-processing #6: Treat missing fields (if #values < #keys) as null.'})
    ]
  }),
  command('csv', ['csv'], {
    desc: 'is a comma-separated values deserializer.',
    opts: []
  })
]

const commands = [
  command('from', ['--from'], {desc: 'Input stream format.', opts: from}),
  command('by',   ['--by'],   {desc: 'How to split the input into chunks.', opts: []}),
  command('to',   ['--to'],   {desc: 'Output stream format.', opts: []})
]

const stages = [
  string('appliers', ['--map'],     {desc: 'Transforms each element using a function.'}),
  string('appliers', ['--flatMap'], {desc: 'Transforms each element into zero or more elements using a function.'}),
  string('appliers', ['--filter'],  {desc: 'Drops each element for which the function returns false.'})
]

const options = [
  flag('failEarly', ['--fail-early'],    {desc: 'Usually, every error is caught and written to stderr. But if this flag is set, only the first error is printed and the process exits with code 1.'}),
  flag('noPlugins', ['--no-plugins'],    {desc: 'Disables all plugins except those added in the .pxi module. Useful for plugin development. BEWARE: You may need to set new defaults in the .pxi module!'}),
  flag('verbose',   ['-v', '--verbose'], {desc: 'Apply -v several times (-vv) to be more verbose. Level 1 prints lines in deserializer and applier error messages. Level 2 also prints the chunks or JSON objects that failed to be deserialized or transformed.'}),
  flag('help',      ['-h', '--help'],    {desc: 'Shows this help message.'}),
  flag('version',   ['--version'],       {desc: 'Shows version number.'})
]

const opts = [...commands, ...stages, ...options]

const usage    = require('../src/usage')
const note     = require('../src/help/usage/note')
const notes    = require('../src/help/usage/notes')
const optsDefs = require('../src/help/usage/optsDefs')
const optsList = require('../src/help/usage/optsList')
const space    = require('../src/help/usage/space')
const synopsis = require('../src/help/usage/synopsis')

const help = usage([
  synopsis('pxi'),
  space(),
  note('Commands:'),
  space(),
  opts => usage(
    opts
    .filter(({key}) => commands.some(o => o.key === key))
    .flatMap(cmd => [
      () => optsList(() => true, 'foo')([cmd]),
      ...cmd.opts.flatMap(o => [
        space(),
        note(`"${o.args.join('')}" ${o.desc}`, 'bar'),
        space(),
        () => optsDefs()(o.opts)
      ])
    ])
  )(opts),
  space(),
  note('Stream Stages:'),
  space(),
  optsList(({key}) => stages.some(o => o.key === key)),
  space(),
  note('Options:'),
  space(),
  optsList(({key}) => options.some(o => o.key === key)),
  space(),
  note('Examples:'),
  space(),
  notes([
    "pxi --from json --flatMap 'json => json.results' --map 'json => json.time' --to csv"
  ], 'example'),
  space(),
  notes([
    "pxi                                \\",
    "  --from json                      \\",
    "  --flatMap 'json => json.results' \\",
    "  --map     'json => json.time'    \\",
    "  --to csv"
  ], 'example'),
  space(),
  note('Copyright (c) Philipp Wille 2019')
])

const width = process.stdout.columns // 80

const style = {
  line: {width},
  cols: [
    {padStart: 4, width: 13, padEnd: 2},
    {width: width - 4 - 13 - 2}
  ],
  defs: {
    title: {padStart: 12, width: width - 12},
    desc:  {padStart: 16, width: width - 16}
  },
  foo: [
    {padStart: 4, width: 6, padEnd: 2},
    {width: width - 4 - 6 - 2}
  ],
  bar: {padStart: 12, width: width - 12},
  example: {padStart: 4, width: process.stdout.columns - 4}
}

process.stdout.write(help(opts)(style))




/*
const opts = [
  string('deserializer', ['from', '--from', '-d', '--deserializer'], {desc: 'Defines how chunks are deserialized into JSON.'}),
  string('chunker',      ['by', '--by', '-c', '--chunker'],          {desc: 'Defines how the input is split into chunks.'}),
  string('applier',      ['--with', '-a', '--applier'],              {desc: 'Defines how FUNCTIONS are applied to JSON.'}),
  string('serializer',   ['to', '--to', '-s', '--serializer'],       {desc: 'Defines how the transformed JSON is converted to a string.'}),
  flag(  'failEarly',    ['--fail-early'],                           {desc: 'Usually, every error is caught and written to stderr. But if this flag is set, only the first error is printed and the process exits with code 1.'}),
  flag(  'noPlugins',    ['--no-plugins'],                           {desc: 'Disables all plugins except those added in the .pxi module. Useful for plugin development. BEWARE: You may need to set new defaults in the .pxi module!'}),
  flag(  'verbose',      ['-v', '--verbose'],                        {desc: 'Apply -v several times (-vv) to be more verbose. Level 1 prints lines in deserializer and applier error messages. Level 2 also prints the chunks or JSON objects that failed to be deserialized or transformed.'}),
  flag(  'help',         ['-h', '--help'],                           {desc: 'Shows this help message.'}),
  flag(  'version',      ['--version'],                              {desc: 'Shows version number.'})
]
*/