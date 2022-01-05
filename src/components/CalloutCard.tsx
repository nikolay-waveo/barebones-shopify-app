import * as polaris from '@shopify/polaris';
import React from 'react';

interface ICalloutCard {
  title: string,
  content?: React.ReactNode | string,
  primaryAction: polaris.Action,
  secondaryAction?: polaris.Action,
  illustrationSRC?: string,
  onDismiss?: () => void,
}

const CalloutCard: React.FC<ICalloutCard> = ({
  title,
  content,
  primaryAction,
  secondaryAction,
  illustrationSRC,
  onDismiss,
}) => {  
  return (
    <polaris.CalloutCard
      title={title}
      illustration={illustrationSRC}
      primaryAction={primaryAction}
      secondaryAction={secondaryAction}
      onDismiss={onDismiss} >
      { typeof content == "string"
        ? <p>{content}</p>
        : content }
    </polaris.CalloutCard>
  )
}

export default CalloutCard
