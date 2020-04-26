import {Err, Opt} from '../parser'

export const toOpts: (opts?: Opt[]) => (obj?: {errs?: Err[], argv?: string[]}) => {errs: Err[], opts: Opt[]}