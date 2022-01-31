import { FC } from 'react';
import SetUpInstructions from './SetUpInstructions';
import PublishingPage from './PublishingPage';
import SubscribingPage from './SubscribingPage';

type TAction = {
  actionName: string,
  actionHandler: (e?: any) => any,
  assets?: any
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

  return (
    <SetUpInstructions 
      onFinish={onFinish}
      pages={
        [
          {
            img: {
              src: 'https://cdn.shopify.com/s/files/1/0626/5343/2026/files/Pubsub-asset-1.763130c6.png?v=1643337866',
              alt: 'App introduction image',
            },
            title: (
              <div className='flex flex-col items-center space-y-10'>
                <h2 className='text-6xl font-bold text-emerald-700 text-center'>
                  Welcome to the Perkd {appName} app
                </h2>
                <h3 className='text-2xl font-medium text-emerald-800 text-center'>
                  Placeholder tag line
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
              src: 'https://cdn.shopify.com/s/files/1/0626/5343/2026/files/Pubsub-asset-2.79b57dee.png?v=1643337866',
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
            nextLabel: 'Continue',
          },
          {
            img: {
              src: 'https://cdn.shopify.com/s/files/1/0626/5343/2026/files/Pubsub-asset-3.65ee6a12.png?v=1643337866',
              alt: 'Subscription list graphic',
            },
            title: (
              <div className='flex flex-col items-center space-y-10'>
                <h2 className='text-3xl font-semibold text-amber-600 text-center'>
                  Subscribe to your first store
                </h2>
              </div>
            ),
            content: <SubscribingPage action={actionFromName('subscribing')} locations={actionFromName('subscribing').assets}/>,
            prevLabel: 'Back',
            nextLabel: 'Continue',
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
