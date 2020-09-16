import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import {
  ConvictionConfig as ConvictionConfigEntity,
  Proposal as ProposalEntity,
  Stake as StakeEntity,
  StakeHistory as StakeHistoryEntity,
} from '../../generated/schema'
import { 
  ConvictionVoting as ConvictionVotingContract,
  ProposalAdded as ProposalAddedEvent
} from '../../generated/templates/ConvictionVoting/ConvictionVoting'
import { loadOrCreateConfig, loadTokenData } from '.'

////// Conviction config entity //////
function getConvictionConfigEntityId(appAddress: Address): string {
  return appAddress.toHexString()
}

export function getConvictionConfigEntity(appAddress: Address): ConvictionConfigEntity | null {
  let configEntityId = getConvictionConfigEntityId(appAddress)

  let config = ConvictionConfigEntity.load(configEntityId)

  if (!config) {
    config = new ConvictionConfigEntity(configEntityId)
  }

  return config
}

export function loadConvictionConfig(orgAddress: Address, appAddress: Address): void {
  // General org config
  let config = loadOrCreateConfig(orgAddress)

  // Conviction voting config
  let convictionConfig = getConvictionConfigEntity(appAddress)
  let convictionVoting = ConvictionVotingContract.bind(appAddress)
  // Load tokens data
  let stakeToken = convictionVoting.stakeToken()
  let success = loadTokenData(stakeToken)
  if (success) {
    convictionConfig.stakeToken = stakeToken.toHexString()
  }

  let requestToken = convictionVoting.requestToken()
  // App could be instantiated without a vault
  success = loadTokenData(requestToken)
  if (success) {
    convictionConfig.requestToken = requestToken.toHexString()
  }

  // Load conviction params
  convictionConfig.decay = convictionVoting.decay()
  convictionConfig.weight = convictionVoting.weight()
  convictionConfig.maxRatio = convictionVoting.maxRatio()
  convictionConfig.pctBase = convictionVoting.D()
  convictionConfig.totalStaked = convictionVoting.totalStaked()
  convictionConfig.maxStakedProposals = convictionVoting.MAX_STAKED_PROPOSALS().toI32()
  convictionConfig.minThresholdStakePercentage = convictionVoting.minThresholdStakePercentage()

  convictionConfig.save()

  config.conviction = convictionConfig.id
  config.save()
}

////// Stake entity //////
export function getStakeEntityId(proposalNumber: BigInt, entity: Bytes): string {
  return proposalNumber.toHexString() + '-entity:' + entity.toHexString()
}

export function getStakeEntity(
  proposal: ProposalEntity | null,
  entity: Bytes
): StakeEntity | null {
  let stakeId = getStakeEntityId(proposal.number, entity)

  let stake = StakeEntity.load(stakeId)
  if (!stake) {
    stake = new StakeEntity(stakeId)
    stake.entity = entity
    stake.proposal = proposal.id
  }

  return stake
}

////// Stake History entity //////
export function getStakeHistoryEntityId(
  proposalNumber: BigInt,
  entity: Bytes,
  timestamp: BigInt
): string {
  return (
    proposalNumber.toHexString() +
    '-entity:' +
    entity.toHexString() +
    '-time:' +
    timestamp.toString()
  )
}

export function getStakeHistoryEntity(
  proposal: ProposalEntity | null,
  entity: Bytes,
  blockNumber: BigInt
): StakeHistoryEntity | null {
  let stakeHistoryId = getStakeHistoryEntityId(
    proposal.number,
    entity,
    blockNumber
  )

  let stakeHistory = new StakeHistoryEntity(stakeHistoryId)
  stakeHistory.proposal = proposal.id
  stakeHistory.entity = entity
  stakeHistory.time = blockNumber

  return stakeHistory
}

export function getOrgAddress(appAddress: Address): Address {
  let convictionVoting = ConvictionVotingContract.bind(appAddress)
  return convictionVoting.kernel()
}

////// Proposal entity //////
export function populateProposalDataFromEvent(
  proposal: ProposalEntity | null,
  event: ProposalAddedEvent
): void {
  proposal.name = event.params.title
  proposal.link = event.params.link.toString()
  proposal.requestedAmount = event.params.amount
  proposal.creator = event.params.entity
  proposal.createdAt = event.block.timestamp
  proposal.beneficiary = event.params.beneficiary
}
