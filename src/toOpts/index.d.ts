import {Err, Opt} from '../parserSync'

export const toOpts: (opt?: Opt) =>
                     (obj?: {errs?: Err[], argv?: string[]}) =>
                     {errs: Err[], opts: Opt[]}