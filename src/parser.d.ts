export interface Err {
  code: string
  msg:  string
  info: object
}

export interface Opt {
  [key: string]: any
}

interface Args {
  _: string[]
  [key: string]: any
}

type Parser = (opts?: Opt[]) => (argv?: string[], errs?: Err[]) => {errs: Err[]; args: Args}

type PromiseParser = (opts?: Opt[]) => (argv?: string[], errs?: Err[]) => Promise<{errs: Err[]; args: Args}>

interface Parsers {
  _: Parser
  __: Parser
  [key: string]: Parser
}

interface Checks {
  argv?: ((obj?: {errs?: Err[], argv?: string[]}) => {errs?: Err[], argv?: string[]})[]
  opts?: ((obj?: {errs?: Err[], opts?: Opt[]   }) => {errs?: Err[], opts?: Opt[]   })[]
  args?: ((obj?: {errs?: Err[], args?: Args    }) => {errs?: Err[], args?: Args    })[]
}

interface Stages extends Checks {
  toOpts?: (opts?: Opt[]) => (obj?: {errs?: Err[], argv?: string[]}) => {errs: Err[], opts: Opt[]}
  toArgs?:                   (obj?: {errs?: Err[], opts?: Opt[]   }) => {errs: Err[], args: Args }
}

interface PromiseChecks {
  argv?: ((obj?: {errs?: Err[], argv?: string[]}) => ({errs?: Err[], argv?: string[]} | Promise<{errs?: Err[], argv?: string[]}>))[]
  opts?: ((obj?: {errs?: Err[], opts?: Opt[]   }) => ({errs?: Err[], opts?: Opt[]   } | Promise<{errs?: Err[], opts?: Opt[]   }>))[]
  args?: ((obj?: {errs?: Err[], args?: Args    }) => ({errs?: Err[], args?: Args    } | Promise<{errs?: Err[], args?: Args    }>))[]
}

interface PromiseStages extends PromiseChecks {
  toOpts?: (opts?: Opt[]) => (obj?: {errs?: Err[], argv?: string[]}) => ({errs: Err[], opts: Opt[]} | Promise<{errs: Err[], opts: Opt[]}>)
  toArgs?:                   (obj?: {errs?: Err[], opts?: Opt[]   }) => ({errs: Err[], args: Args } | Promise<{errs: Err[], args: Args }>)
}

export function parser <M extends 'async' | string>(stages?: M extends 'async' ? PromiseStages : Stages, options?: {checks?: M extends 'async' ? PromiseChecks : Checks; parsers?: Parsers; mode: M}): M extends 'async' ? PromiseParser : Parser