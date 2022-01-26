import { FC, ReactNode, useCallback, useState } from 'react'
import * as polaris from '@shopify/polaris';
import { ActionList, Button, Card, Heading, Popover, TextStyle } from '@shopify/polaris';

declare type Variation = 'positive' | 'negative' | 'strong' | 'subdued' | 'code';

declare type ToggleState = {
  title?: string | ReactNode,
  buttonTitle: string,
  content: string | React.ReactNode,
  contentStyle?: Variation | string,
  plain?: boolean,
  outline?: boolean,
  destructive?: boolean,
  sections?: polaris.ActionListSection[],
  defaultButton?: polaris.ComplexAction & polaris.ButtonProps,
}

interface IToggle {
  activated: boolean,
  onActivated: ToggleState,
  onDeactivated: ToggleState,
}

interface IStorePublishingCard extends IToggle {
  primary?: polaris.ComplexAction & polaris.ButtonProps,
}

const StorePublishingCard: FC<IStorePublishingCard> = ({
  activated,
  primary,
  onActivated,
  onDeactivated,
}) => {
  const [optionsActive, setOptionsActive] = useState(false)

  const toggleOptionsActive = useCallback(() => setOptionsActive((optionsActive) => !optionsActive), []);

  const state = activated ? onActivated : onDeactivated;

  const { 
    title,
    content,
    buttonTitle,
    contentStyle,
    plain,
    outline,
    destructive,
    sections,
    defaultButton,
  } = state

  const activator = (
    <Button 
      destructive={destructive} 
      outline={outline}
      plain={plain}
      onClick={toggleOptionsActive}>
        {buttonTitle}
    </Button>
  );

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
          { primary && 
            <Button 
              primary
              destructive={primary.destructive}
              outline={primary.outline} 
              icon={primary.icon} 
              plain={primary.plain}
              onClick={primary.onAction}>
                {primary.content}
            </Button> }
          { defaultButton
            ? <Button 
                primary
                destructive={defaultButton.destructive}
                outline={defaultButton.outline} 
                icon={defaultButton.icon} 
                plain={defaultButton.plain}
                onClick={defaultButton.onAction}>
                  {defaultButton.content}
              </Button>
            : <Popover
                active={optionsActive}
                activator={activator}
                onClose={toggleOptionsActive} >
                <ActionList 
                  sections={sections} 
                  onActionAnyItem={toggleOptionsActive}/>
              </Popover>
             }
        </div>
      </div>
    </Card>
  )
}

export default StorePublishingCard
