import { Badge, SkeletonDisplayText, Spinner, TextStyle, Tooltip } from '@shopify/polaris'
import React, { FC, SVGProps } from 'react'
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
    dateTooltip: string,
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
    updatedAt
  } = item

  const {
    accessibilityLabel = 'Loading Spinner',
  } = loading

  const hasContent = (): boolean => {
    return !!(item.status && item.id && item.storeURL)
  }

  const badge = badges.find(badge => status === badge.status)

  const daysAsString = (): string => {
    if(!updatedAt) return '-1 DAYS'

    const MS_PER_DAY = 1000 * 60 * 60 * 24
    const daysInMS = new Date().getTime() - Date.parse(updatedAt)
    const days = Math.floor(daysInMS / MS_PER_DAY)
    const dayString = `${days.toString()} DAY`

    if (days > 1 || days < 1) return dayString + 'S'
    return dayString
  }

  const progressToStyle = (progress: Progress): Status => {
    switch(progress) {
      case 'complete': return "info"
      case 'partiallyComplete': return "critical"
      case 'incomplete': 
      default: return null
    }
  }

  return (
    <div className="grid grid-cols-9">
      <h3 className="col-span-5 truncate">
        { hasContent()
          ? <TextStyle variation="strong">{storeURL}</TextStyle>
          : <SkeletonDisplayText size="small" /> }
      </h3>
      <div className='col-span-2 justify-self-center'>
        <Tooltip
          content={badge.dateTooltip}
          preferredPosition='above'>
          <Badge
            size="small"
            progress={badge.progress}
            status={progressToStyle(badge.progress)} >
            {daysAsString()}
          </Badge>
        </Tooltip>
      </div>
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
