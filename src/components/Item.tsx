import { Badge, SkeletonDisplayText, Spinner, TextStyle, Tooltip } from '@shopify/polaris'
import React, { FC, SVGProps, useEffect } from 'react'
import Options from './Options'

declare type Status = 'success' | 'info' | 'critical' | 'warning' | 'new'
declare type Progress = 'incomplete' | 'partiallyComplete' | 'complete'

interface IItem {
  item: {
    storeURL: string,
    id: string,
    status: string,
    updatedAt: string,
  },
  badges?: {
    status: string,
    displayStatus?: string, 
    tooltip: string,
    statusStyle?: Status,
    progress?: Progress,
  }[],
  options?: {
    content: string,
    helpText: string,
    icon?: FC<SVGProps<SVGSVGElement>>,
    onAction: () => void,
    active?: boolean,
    destructive?: boolean,
  }[],
  loading?: {
    accessibilityLabel: string,
  },
}

const Item: React.FC<IItem> = ({
  item,
  badges = [],
  options,
  loading,
}) => {

  const {
    storeURL,
    status,
  } = item

  const {
    accessibilityLabel = 'Loading Spinner',
  } = loading

  const hasContent = (): boolean => {
    return !!(item.status && item.id && item.storeURL)
  }

  const badge = badges.find(badge => status === badge.status)

  return (
    <div className="grid grid-cols-9">
      <h3 className="col-span-7 truncate">
        { hasContent()
          ? <TextStyle variation="strong">{storeURL}</TextStyle>
          : <SkeletonDisplayText size="small" /> }
      </h3>
      <div className="col-start-8 justify-self-center">
        { !hasContent() && <Spinner accessibilityLabel={accessibilityLabel} size="small" /> }
        { hasContent() && badge && 
          <Tooltip 
            content={badge.tooltip}
            preferredPosition='above' >
              <div className="capitalize">
                <Badge 
                  size="small"
                  {...{status: badge.statusStyle}} >
                  {badge.displayStatus || status}
                </Badge>
              </div>
          </Tooltip> }
      </div>
      <div className="grid justify-end col-start-9">
        { options && 
          <Options options={options} />}
      </div>
    </div>
  )
}

export default Item
