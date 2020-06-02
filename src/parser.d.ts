export interface Err {
  code: string
  msg:  string
  info: object
}

export interface Opt {
  args?: string[]
  contradicts?: string[],
  defaultValues?: any
  desc?: string
  descArg?: string
  implies?: string[]
  key?: string
  only?: any[]
  opts?: Opt[]
  required?: boolean
  reverse?: boolean
  rules?: (opt?: Opt) => (opts?: Opt[]) => boolean
  types?: string[]
  values?: any[]
  [key: string]: any
}

export interface Args {
  _?: string[]
  [key: string]: any
}

export interface Stages<A, B> {
  toArgv?:                                          (obj?: {errs?: Err[], any:   A       }) => {errs: Err[], argv: string[]}
  argv?:                                      Array<(obj?: {errs?: Err[], argv?: string[]}) => {errs: Err[], argv: string[]}>
  toOpts?: (opts?: Opt[], stages?: Stages<A, B>) => (obj?: {errs?: Err[], argv?: string[]}) => {errs: Err[], opts: Opt[]   }
  opts?:                                      Array<(obj?: {errs?: Err[], opts?: Opt[]   }) => {errs: Err[], opts: Opt[]   }>
  toArgs?:                                          (obj?: {errs?: Err[], opts?: Opt[]   }) => {errs: Err[], args: Args[]  }
  args?:                                      Array<(obj?: {errs?: Err[], args?: Args[]  }) => {errs: Err[], args: Args[]  }>
  fromArgs?:                                        (obj?: {errs?: Err[], args?: Args[]  }) => B
}

export interface AsyncStages<A, B> {
  toArgv?:                                          (obj?: {errs?: Err[], any:   A       }) => Promise<{errs: Err[], argv: string[]}>
  argv?:                                      Array<(obj?: {errs?: Err[], argv?: string[]}) => Promise<{errs: Err[], argv: string[]}>>
  toOpts?: (opts?: Opt[], stages?: Stages<A, B>) => (obj?: {errs?: Err[], argv?: string[]}) => Promise<{errs: Err[], opts: Opt[]   }>
  opts?:                                      Array<(obj?: {errs?: Err[], opts?: Opt[]   }) => Promise<{errs: Err[], opts: Opt[]   }>>
  toArgs?:                                          (obj?: {errs?: Err[], opts?: Opt[]   }) => Promise<{errs: Err[], args: Args[]  }>
  args?:                                      Array<(obj?: {errs?: Err[], args?: Args[]  }) => Promise<{errs: Err[], args: Args[]  }>>
  fromArgs?:                                        (obj?: {errs?: Err[], args?: Args[]  }) => Promise<B>
}

export interface Substages {
  [key]: Array<(obj?: {errs?: Err[], opts?: Opt[]}) => {errs: Err[], opts: Opt[]}> | Substages
}

const parserSync: <A, B>(stages?: Stages<A, B>, substages?: Substages) =>
                        (opt?: Opt) =>
                        (any?: A, errs?: Err[]) =>
                        {errs: Err[], any: B}

const parser: <A, B>(stages?: Stages<A, B> | AsyncStages<A, B>, substages?: Substages) =>
                    (opt?: Opt) =>
                    (any?: A, errs?: Err[]) =>
                    {errs: Err[], any: B}