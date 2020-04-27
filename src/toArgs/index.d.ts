import {Args, Err, Opt, Parsers} from '../parser'

export const toArgs: <M extends 'async' | string>(parsers?: Parsers, mode?: M) =>
                                                 (obj?: {errs?: Err[], opts?: Opt[]}) =>
                                                 M extends 'async' ? Promise<{errs: Err[], args: Args}> : {errs: Err[], args: Args}