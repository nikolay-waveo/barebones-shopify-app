import { ActionList, Icon, Popover } from '@shopify/polaris';
import {
  MobileVerticalDotsMajor
} from '@shopify/polaris-icons';
import React, { FC, SVGProps, useCallback, useState } from 'react';

interface IOptions {
  options: {
    content: string,
    helpText: string,
    icon?: FC<SVGProps<SVGSVGElement>>,
    onAction: () => void,
    active?: boolean,
    destructive?: boolean,
  }[],
}

const Options: React.FC<IOptions> = ({
  options,
}) => {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(() => setPopoverActive(popoverActive => !popoverActive), []);

  const activator = <button 
    className="border-none bg-transparent hover:cursor-pointer"
    onClick={togglePopoverActive}> 
      <Icon
        source={MobileVerticalDotsMajor}
        color="highlight" />
    </button>;

  const actionListItems = [
    ...options
  ];

  return (
    <Popover 
      active={popoverActive} 
      activator={activator} 
      onClose={togglePopoverActive}>
      <ActionList 
        items={actionListItems} 
        onActionAnyItem={() => {
          setPopoverActive(false)
        }}/>
    </Popover>
  )
}

export default Options
