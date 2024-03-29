import { subscription } from '@1hive/connect-core'

import ArbitratorFee from './ArbitratorFee'
import CollateralRequirement from './CollateralRequirement'
import {
  CastData,
  IGardenConnector,
  StakeData,
  StakeHistoryData,
  ProposalData,
  SubscriptionHandler,
  VotingConfigData,
  FunctionCallback,
  OrganizationData,
} from '../types'

export default class Proposal {
  #connector: IGardenConnector

  readonly id: string
  readonly organization: OrganizationData
  readonly number: string
  readonly creator: string
  readonly status: string
  readonly type: string
  readonly createdAt: string
  readonly executedAt: string
  readonly metadata?: string
  readonly txHash: string

  // proposal data
  readonly link?: string
  readonly stakes?: StakeData[]
  readonly stakesHistory?: StakeHistoryData[]
  readonly beneficiary?: string
  readonly requestedAmount?: string
  readonly totalTokensStaked?: string
  readonly stable?: boolean

  // Voting data
  readonly setting?: VotingConfigData
  readonly startDate?: string
  readonly totalPower?: string
  readonly snapshotBlock?: string
  readonly yeas?: string
  readonly nays?: string
  readonly quietEndingExtensionDuration?: string
  readonly quietEndingSnapshotSupport?: string
  readonly script?: string
  readonly isAccepted?: boolean
  readonly casts?: CastData[]

  // Dispute data
  readonly actionId?: string
  readonly challengeId?: string
  readonly challenger?: string
  readonly challengeEndDate?: string
  readonly disputeId?: string
  readonly settledAt?: string
  readonly settlementOffer?: string
  readonly disputedAt?: string
  readonly pausedAt?: string
  readonly pauseDuration?: string
  readonly submitterArbitratorFeeId?: string
  readonly challengerArbitratorFeeId?: string

  /**
   * Create a new Proposal instance.
   * @param data The proposal data.
   * @param connector A GardenConnector instance.
   */
  constructor(data: ProposalData, connector: IGardenConnector) {
    this.#connector = connector

    this.id = data.id
    this.organization = data.organization
    this.number = data.number
    this.creator = data.creator
    this.status = data.status
    this.type = data.type
    this.createdAt = data.createdAt
    this.executedAt = data.executedAt
    this.metadata = data.metadata
    this.txHash = data.txHash

    // proposal data
    this.link = data.link
    this.stakes = data.stakes
    this.stakesHistory = data.stakesHistory
    this.beneficiary = data.beneficiary
    this.requestedAmount = data.requestedAmount
    this.totalTokensStaked = data.totalTokensStaked
    this.stable = data.stable

    //voting data
    this.setting = data.setting
    this.startDate = data.startDate
    this.totalPower = data.totalPower
    this.snapshotBlock = data.snapshotBlock
    this.yeas = data.yeas
    this.nays = data.nays
    this.quietEndingExtensionDuration = data.quietEndingExtensionDuration
    this.quietEndingSnapshotSupport = data.quietEndingSnapshotSupport
    this.script = data.script
    this.isAccepted = data.isAccepted
    this.casts = data.castVotes

    //dispute data
    this.actionId = data.actionId
    this.challengeId = data.challengeId
    this.challenger = data.challenger
    this.challengeEndDate = data.challengeEndDate
    this.disputeId = data.disputeId
    this.settledAt = data.settledAt
    this.settlementOffer = data.settlementOffer
    this.disputedAt = data.disputedAt
    this.pausedAt = data.pausedAt
    this.pauseDuration = data.pauseDuration
    this.submitterArbitratorFeeId = data.submitterArbitratorFeeId
    this.challengerArbitratorFeeId = data.challengerArbitratorFeeId
  }

  /**
   * Close the connection.
   */
  async disconnect(): Promise<void> {
    await this.#connector.disconnect()
  }

  /**
   * Fetch the collateral requirement of the proposal.
   * @returns A promise that resolves to the collateral requirement of the proposal.
   */
  async collateralRequirement(): Promise<CollateralRequirement> {
    return this.#connector.collateralRequirement(this.id)
  }

  /**
   * Subscribe to updates in the collateral requirement of the proposal.
   * @param callback A function callback to postprocess the result.
   * @returns A GraphQL subsription to the collateral requirement of the proposal.
   */
  onCollateralRequirement(callback?: FunctionCallback): SubscriptionHandler {
    return subscription<CollateralRequirement>(callback, (callback) =>
      this.#connector.onCollateralRequirement(this.id, callback)
    )
  }

  /**
   * Fetch the arbitrator fee for the submitter of the proposal.
   * @returns A promise that resolves to the arbitrator fee for the submitter of the proposal.
   */
  async submitterArbitratorFee(): Promise<ArbitratorFee | null> {
    return this.#connector.arbitratorFee(this.submitterArbitratorFeeId || '')
  }

  /**
   * Subscribe to updates in the arbitrator fee for the submitter of the proposal.
   * @param callback A function callback to postprocess the result.
   * @returns A GraphQL subsription to the arbitrator fee for the submitter of the proposal.
   */
  onSubmitterArbitratorFee(callback?: FunctionCallback): SubscriptionHandler {
    return subscription<ArbitratorFee | null>(callback, (callback) =>
      this.#connector.onArbitratorFee(this.submitterArbitratorFeeId || '', callback)
    )
  }

  /**
   * Fetch the arbitrator fee for the challenger of the proposal.
   * @returns A promise that resolves to the arbitrator fee for the challenger of the proposal.
   */
  async challengerArbitratorFee(): Promise<ArbitratorFee | null> {
    return this.#connector.arbitratorFee(this.challengerArbitratorFeeId || '')
  }

  /**
   * Subscribe to updates in the arbitrator fee for the challenger of the proposal.
   * @param callback A function callback to postprocess the result.
   * @returns A GraphQL subsription to the arbitrator fee for the challenger of the proposal.
   */
  onChallengerArbitratorFee(callback?: FunctionCallback): SubscriptionHandler {
    return subscription<ArbitratorFee | null>(callback, (callback) =>
      this.#connector.onArbitratorFee(this.challengerArbitratorFeeId || '', callback)
    )
  }
}
