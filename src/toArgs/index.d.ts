import {Args, Err, Opt, Parsers} from '../parser'

export const toArgs: (parsers?: Parsers) => (obj?: {errs?: Err[], opts?: Opt[]}) => {errs: Err[], args: Args}