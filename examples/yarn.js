const {bool, command, flag, number, string} = require('../src/options')

const yarnOpts = [
  string( 'cacheFolder',            ['--cache-folder'],                           {desc: 'specify a custom folder that must be used to store the yarn cache'}),
  flag(   'checkFiles',             ['--check-files'],                            {desc: 'install will verify file tree of packages for consistency'}),
  string( 'cwd',                    ['--cwd'],                                    {desc: 'working directory to use'}),
  flag(   'disablePnp',             ['--disable-pnp'],                            {desc: "disable the Plug'n'Play installation"}),
  bool(   'emoji',                  ['--emoji'],                                  {desc: 'enable emoji in output'}),
  flag(   'enablePnp',              ['--enable-pnp', '--pnp'],                    {desc: "enable the Plug'n'Play installation"}),
  flag(   'flat',                   ['--flat'],                                   {desc: 'only allow one version of a package'}),
  flag(   'focus',                  ['--focus'],                                  {desc: 'Focus on a single workspace by installing remote copies of its sibling workspaces.'}),
  flag(   'force',                  ['--force'],                                  {desc: 'install and build packages even if they were built before, overwrite lockfile'}),
  flag(   'frozenLockfile',         ['--frozen-lockfile'],                        {desc: "don't generate a lockfile and fail if an update is needed"}),
  string( 'globalFolder',           ['--global-folder'],                          {desc: 'specify a custom folder to store global packages'}),
  flag(   'har',                    ['--har'],                                    {desc: 'save HAR output of network traffic'}),
  string( 'httpsProxy',             ['--https-proxy']),
  flag(   'ignoreEngines',          ['--ignore-engines'],                         {desc: 'ignore engines check'}),
  flag(   'ignoreOptional',         ['--ignore-optional'],                        {desc: 'ignore optional dependencies'}),
  flag(   'ignorePlatform',         ['--ignore-platform'],                        {desc: 'ignore platform checks'}),
  flag(   'ignoreScripts',          ['--ignore-scripts'],                         {desc: "don't run lifecycle scripts"}),
  flag(   'json',                   ['--json'],                                   {desc: 'format Yarn log messages as lines of JSON (see jsonlines.org)'}),
  flag(   'linkDuplicates',         ['--link-duplicates'],                        {desc: 'create hardlinks to the repeated modules in node_modules'}),
  string( 'linkFolder',             ['--link-folder'],                            {desc: 'specify a custom folder to store global links'}),
  string( 'modulesFolder',          ['--modules-folder'],                         {desc: 'rather than installing modules into the node_modules folder relative to the cwd, output them here'}),
  string( 'mutex',                  ['--mutex'],                                  {desc: 'use a mutex to ensure only one yarn instance is executing'}),
  number( 'networkConcurrency',     ['--network-concurrency'],                    {desc: 'maximum number of concurrent network requests'}),
  number( 'networkTimeout',         ['--network-timeout'],                        {desc: 'TCP timeout for network requests'}),
  flag(   'noBinLinks',             ['--no-bin-links'],                           {desc: "don't generate bin links when setting up packages"}),
  flag(   'noDefaultRc',            ['--no-default-rc'],                          {desc: 'prevent Yarn from automatically detecting yarnrc and npmrc files'}),
  flag(   'noLockfile',             ['--no-lockfile'],                            {desc: "don't read or generate a lockfile"}),
  flag(   'nonInteractive',         ['--non-interactive'],                        {desc: 'do not show interactive prompts'}),
  flag(   'noNodeVersionCheck',     ['--no-node-version-check'],                  {desc: 'do not warn when using a potentially unsupported Node version'}),
  flag(   'noProgress',             ['--no-progress'],                            {desc: 'disable progress bar'}),
  flag(   'offline',                ['--offline'],                                {desc: 'trigger an error if any required dependencies are not available in local cache'}),
  string( 'otp',                    ['--otp'],                                    {desc: 'one-time password for two factor authentication'}),
  flag(   'preferOffline',          ['--prefer-offline'],                         {desc: 'use network only if dependencies are not available in local cache'}),
  string( 'preferredCacheFolder',   ['--preferred-cache-folder'],                 {desc: 'specify a custom folder to store the yarn cache if possible'}),
  flag(   'prod',                   ['--prod', '--production']),
  string( 'proxy',                  ['--proxy']),
  flag(   'pureLockfile',           ['--pure-lockfile'],                          {desc: "don't generate a lockfile"}),
  string( 'registry',               ['--registry'],                               {desc: 'override configuration registry'}),
  flag(   'silent',                 ['-s', '--silent'],                           {desc: 'skip Yarn console logs, other types of logs (script output) will be printed'}),
  bool(   'scriptsPrependNodePath', ['--scripts-prepend-node-path'],              {desc: 'prepend the node executable dir to the PATH in scripts'}),
  flag(   'skipIntegrityCheck',     ['--skip-integrity-check'],                   {desc: 'run install without checking if node_modules is installed'}),
  flag(   'strictSemver',           ['--strict-semver']),
  flag(   'updateChecksums',        ['--update-checksums'],                       {desc: 'update package checksums from current repository'}),
  string( 'useYarnrc',              ['--use-yarnrc'],                             {desc: 'specifies a yarnrc file that Yarn should use (.yarnrc only, not .npmrc)'}),
  flag(   'version',                ['-v', '--version'],                          {desc: 'output the version number'}),
  flag(   'verbose',                ['--verbose'],                                {desc: 'output verbose messages on internal operations'}),
  flag(   'help',                   ['-h', '--help'],                             {desc: 'output usage information'}),
  command('access',                 ['access'],                                   {opts: []}),
  command('add',                    ['add'],                                      {opts: []}),
  command('audit',                  ['audit'],                                    {opts: []}),
  command('autoclean',              ['autoclean'],                                {opts: []}),
  command('bin',                    ['bin'],                                      {opts: []}),
  command('cache',                  ['cache'],                                    {opts: []}),
  command('check',                  ['check'],                                    {opts: []}),
  command('config',                 ['config'],                                   {opts: []}),
  command('create',                 ['create'],                                   {opts: []}),
  command('exec',                   ['exec'],                                     {opts: []}),
  command('generateLockEntry',      ['generate-lock-entry', 'generateLockEntry'], {opts: []}),
  command('global',                 ['global'],                                   {opts: []}),
  command('help',                   ['help'],                                     {opts: []}),
  command('import',                 ['import'],                                   {opts: []}),
  command('info',                   ['info'],                                     {opts: []}),
  command('init',                   ['init'],                                     {opts: []}),
  command('install',                ['install'],                                  {opts: []}),
  command('licenses',               ['licenses'],                                 {opts: []}),
  command('link',                   ['link'],                                     {opts: []}),
  command('list',                   ['list'],                                     {opts: []}),
  command('login',                  ['login'],                                    {opts: []}),
  command('logout',                 ['logout'],                                   {opts: []}),
  command('node',                   ['node'],                                     {opts: []}),
  command('outdated',               ['outdated'],                                 {opts: []}),
  command('owner',                  ['owner'],                                    {opts: []}),
  command('pack',                   ['pack'],                                     {opts: []}),
  command('policies',               ['policies'],                                 {opts: []}),
  command('publish',                ['publish'],                                  {opts: []}),
  command('remove',                 ['remove'],                                   {opts: []}),
  command('run',                    ['run'],                                      {opts: []}),
  command('tag',                    ['tag'],                                      {opts: []}),
  command('team',                   ['team'],                                     {opts: []}),
  command('unlink',                 ['unlink'],                                   {opts: []}),
  command('unplug',                 ['unplug'],                                   {opts: []}),
  command('upgrade',                ['upgrade'],                                  {opts: []}),
  command('upgradeInteractive',     ['upgrade-interactive', 'upgradeInteractive'], {opts: []}),
  command('version',                ['version'],                                   {opts: []}),
  command('versions',               ['versions'],                                  {opts: []}),
  command('why',                    ['why'],                                       {opts: []}),
  command('workspace',              ['workspace'],                                 {opts: []}),
  command('workspaces',             ['workspaces'],                                {opts: []})
]

const usage = require('../src/usage')

const columnWidth = process.stdout.columns || 80

const style = {
  line: {padSart: 2, width: columnWidth - 2},
  cols: [
    {padStart: 4, width: 34, padEnd: 2},
    {width: columnWidth - 40}
  ]
}

const note     = require('../src/help/usage/note')
const notes    = require('../src/help/usage/notes')
const optsList = require('../src/help/usage/optsList')
const space    = require('../src/help/usage/space')

const help = usage([
  space(),
  note('Usage: yarn [command] [flags]'),
  space(),
  note('Displays help information.'),
  space(),
  note('Options:'),
  space(),
  optsList(({types}) => types !== null),
  note('Commands:'),
  optsList(({types}) => types === null),
  space(),
  notes([
    'Run `yarn help COMMAND` for more information on specific commands.',
    'Visit https://yarnpkg.com/en/docs/cli/ to learn more about Yarn.'
  ]),
  space()
])(yarnOpts)(style)

process.stdout.write(help)