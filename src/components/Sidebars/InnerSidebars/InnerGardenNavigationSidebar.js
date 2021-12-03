import React from 'react'
import covenantIcon from '@assets/covenantIcon.svg'
import createProposalIcon from '@assets/createProposal.svg'
import feedIcon from '@assets/feedIcon.svg'
import { buildGardenPath } from '@/utils/routing-utils'
import NavigationItem from '../Items/NavigationItem'
import BaseInnerSidebar from './BaseInnerSidebar'
import { useHistory, useLocation } from 'react-router'

const InnerGardenNavigationSidebar = ({
  width,
  onToggle,
  onOpenCreateProposal,
}) => {
  const history = useHistory()
  const location = useLocation()

  const gardenNavigationItems = [
    {
      icon: feedIcon,
      label: 'Feed',
      path: buildGardenPath(history.location, ''),
      onClick: onToggle,
    },
    {
      icon: covenantIcon,
      label: 'Covenant',
      path: buildGardenPath(history.location, 'covenant'),
      onClick: onToggle,
    },
    {
      icon: createProposalIcon,
      label: 'Create Proposal',
      path: '',
      onClick: () => {
        onToggle()
        onOpenCreateProposal()
      },
    },
  ]

  return (
    <BaseInnerSidebar width={width}>
      <ul>
        {gardenNavigationItems.map(({ icon, label, path, onClick }) => (
          <NavigationItem
            key={path}
            active={location.pathname === path}
            label={label}
            path={path}
            src={icon}
            onClick={onClick}
          />
        ))}
      </ul>
    </BaseInnerSidebar>
  )
}

export default InnerGardenNavigationSidebar
