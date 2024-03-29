import { BigNumber } from 'ethers'
import { bn } from './numbers'

export const toMilliseconds = (seconds: string): number => parseInt(seconds) * 1000

export const currentTimestampEvm = (): BigNumber => bn(Math.floor(Date.now() / 1000))
