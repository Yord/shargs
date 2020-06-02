import {Args, Err, Opt} from '../parser'

export const toArgs: (obj?: {errs?: Err[], opts?: Opt[]}) => {errs: Err[], args: Args[]}