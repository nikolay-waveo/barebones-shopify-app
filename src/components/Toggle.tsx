import React from 'react'
import * as polaris from '@shopify/polaris';
import { Button, Card, Heading, Icon, TextStyle } from '@shopify/polaris';

declare type Variation = 'positive' | 'negative' | 'strong' | 'subdued' | 'code';

declare type ToggleState = {
  title?: string,
  content: string | React.ReactNode,
  contentStyle?: Variation | string,
  primaryAction: polaris.ComplexAction & polaris.ButtonProps,
  secondaryAction?: polaris.ComplexAction & polaris.ButtonProps,
}

interface IToggle {
  activated: boolean,
  onActivate: ToggleState,
  onDeactivate: ToggleState,
}

const Toggle: React.FC<IToggle> = ({
  activated,
  onActivate,
  onDeactivate,
}) => {

  const state = activated ? onActivate : onDeactivate;

  const {
    title,
    content,
    contentStyle,
    primaryAction,
    secondaryAction,
  } = state

  const style = contentStyle as Variation

  return (
    <Card sectioned >
      <div className="flex flex-col sm:flex-row justify-between item-start sm:items-center gap-5">
        <div className="flex flex-col">
          <Heading>{title}</Heading>
          <span className="mt-4">
            <TextStyle variation={style}>
              {content}
            </TextStyle>
          </span>
        </div>
        <div className="flex flex-row-reverse sm:flex-row w-max gap-3">
          { secondaryAction && 
            <div className={secondaryAction.outline && secondaryAction.destructive ? 'text-red-600' : null}>
              <Button 
                destructive={secondaryAction.destructive}
                outline={secondaryAction.outline} 
                icon={secondaryAction.icon} 
                plain={secondaryAction.plain}
                onClick={secondaryAction.onAction}>
                  {secondaryAction.content}
              </Button>
            </div> }
          <Button 
            primary={primaryAction.primary} 
            destructive={primaryAction.destructive} 
            outline={primaryAction.outline}
            icon={primaryAction.icon} 
            plain={primaryAction.plain}
            onClick={primaryAction.onAction}>
              {primaryAction.content}
          </Button>
        </div>
      </div>
    </Card>
  )
}


export default Toggle
