import {Err} from '../parser'

export const toArgv: <A>(obj?: {errs?: Err[], any?: A}) => {errs: Err[], argv?: string[]}