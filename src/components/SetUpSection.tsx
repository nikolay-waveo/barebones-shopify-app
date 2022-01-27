import { Button } from '@shopify/polaris';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import SetUpInstructions from './SetUpInstructions';
import img1 from '../assets/Pubsub-asset-1.png'
import img3 from '../assets/Pubsub-asset-3.png'
import img9 from '../assets/Pubsub-asset-9.png'
import Form from './Form';
import PublishingPage from './PublishingPage';
import SubscribingPage from './SubscribingPage';

type TAction = {
  actionName: string,
  actionHandler: (e?: any) => void,
  state?: boolean,
}

interface ISetUpSection {
  appName?: string,
  onFinish(): void,
  actions?: TAction[]
}

const SetUpSection: FC<ISetUpSection> = ({
  appName,
  onFinish, 
  actions,
}) => {

  const actionFromName = (actionName: string): TAction => {
    const actionObject = actions.find(action => action.actionName === actionName)
    return actionObject
  }

  const locations = [
    {
      name: '1',
      id: '1'
    }
  ]

  return (
    <SetUpInstructions 
      onFinish={onFinish}
      pages={
        [
          {
            img: {
              src: img1,
              alt: 'App introduction image',
            },
            title: (
              <div className='flex flex-col items-center space-y-10'>
                <h2 className='text-6xl font-bold text-emerald-700 text-center'>
                  Welcome to the Perkd {appName} app
                </h2>
                <h3 className='text-2xl font-medium text-emerald-800 text-center'>
                  Set-up shop once, sell anywhere
                </h3>
              </div>
            ),
            content: (
              <div className='flex flex-col space-y-10 text-emerald-800'>
                <p className='font-medium'>
                  Let us help you get to know the app so that you can start subscribing to 
                  the stores you want and publishing to those that want you!
                </p>
                <p className='font-medium'>
                  So, what are we waiting for?
                </p>
              </div>
            ),
            nextLabel: 'Let\'s get started',
          },
          {
            img: {
              src: img3,
              alt: 'Publishing graphic',
            },
            title: (
              <div className='flex flex-col items-center space-y-14'>
                <h2 className='text-3xl font-semibold text-amber-600 text-center'>
                  Publish your store
                </h2>
              </div>
            ),
            content: <PublishingPage action={actionFromName('publishing')}/>,
            prevLabel: 'Back',
            nextLabel: 'Continue without enabling',
          },
          {
            img: {
              src: img9,
              alt: 'Subscription list graphic',
            },
            title: (
              <div className='flex flex-col items-center space-y-10'>
                <h2 className='text-3xl font-semibold text-amber-600 text-center'>
                  Subscribe to your first store
                </h2>
              </div>
            ),
            content: <SubscribingPage action={actionFromName('subscribing')} locations={locations}/>,
            prevLabel: 'Back',
            nextLabel: 'Continue without subscribing',
          },
          {
            title: (
              <div className='flex flex-col items-center space-y-10'>
                <h2 className='text-6xl font-bold text-emerald-700 text-center'>
                  You are all set!
                </h2>
                <h3 className='text-2xl font-medium text-emerald-800 text-center'>
                  Now you are ready to expand your store with the Perkd Product Sync App
                </h3>
              </div>
            ),
          },
        ]} />
  )
};

export default SetUpSection;
