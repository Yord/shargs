import {Err, Opt} from '../parser'

export const toOpts: (opt?: Opt) =>
                     (obj?: {errs?: Err[], argv?: string[]}) =>
                     {errs: Err[], opts: Opt[]}