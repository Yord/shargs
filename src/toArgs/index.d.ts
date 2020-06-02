import {Args, Err, Opt} from '../parserSync'

export const toArgs: (obj?: {errs?: Err[], opts?: Opt[]}) => {errs: Err[], args: Args[]}