import { List, Badge } from '@shopify/polaris';
import { FC } from 'react';
import SetUpInstructions from './SetUpInstructions';

interface ISetUpSection {
  onFinish(): void,
}

const SetUpSection: FC<ISetUpSection> = ({
  onFinish
}) => {
  return (
    <SetUpInstructions 
      onFinish={onFinish}
      pages={
        [
          {
            img: {
              src: 'https://via.placeholder.com/720x250.png',
              alt: 'App introduction image',
            },
            title: (
              <div className='flex flex-col items-center space-y-10'>
                <h2 className='text-6xl font-bold text-emerald-700 text-center'>
                  Welcome to the Perkd Product Sync App
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
              src: 'https://via.placeholder.com/720x250.png',
              alt: 'App introduction image',
            },
            title: (
              <div className='flex flex-col items-center space-y-10'>
                <h2 className='text-3xl font-semibold text-amber-600 text-center'>
                  Publishing your store
                </h2>
              </div>
            ),
            content: (
              <div className='flex flex-col space-y-10 text-emerald-800'>
                <p className='font-medium'>
                  Allow others to find and subscribe to your store by enabling the <span className='text-amber-600'>Publishing</span> setting. 
                  This setting can be disabled at any time if you no longer want to publish your store. 
                </p>
                <List type='number'>
                  <List.Item>
                    Navigate to the <span className='font-semibold'>Publish</span> section of the app.
                  </List.Item>
                  <List.Item>
                    Go to the <span className='font-semibold'>Store Publishing</span> card.
                  </List.Item>
                  <List.Item>
                    Click on <span className='font-semibold'>Activate</span>.
                  </List.Item>
                </List>
              </div>
            ),
            nextLabel: 'Continue',
            jump: {
              page: 4,
              label: 'Skip to subscribing'
            }
          },
          {
            img: {
              src: 'https://via.placeholder.com/720x250.png',
              alt: 'App introduction image',
            },
            title: (
              <div className='flex flex-col items-center space-y-10'>
                <h2 className='text-3xl font-semibold text-amber-600 text-center'>
                  Your list of subscribers
                </h2>
              </div>
            ),
            content: (
              <div className='flex flex-col space-y-10 text-emerald-800'>
                <p className='font-medium'>
                  Everyone who is subscribed to your store will appear in your subscriber list. Here you can manage their subscriptions.
                </p>
                <p className='font-medium'>
                  Subscription requests will appear on your list with a <Badge size='small'>Pending</Badge> badge, 
                  from here you can choose to accept or decline their subscription to you. 
                </p>
                <div>
                  <p className='font-medium pb-2'>
                    Accepting a subscription to your store: 
                  </p>
                  <List type='number'>
                    <List.Item>
                      Navigate to the <span className='font-semibold'>Publish</span> section of the app.
                    </List.Item>
                    <List.Item>
                      Go to the <span className='font-semibold'>Subscribers</span> list.
                    </List.Item>
                    <List.Item>
                      Hover over the subscription you want to accept.
                    </List.Item>
                    <List.Item>
                      Click on the options button ( <span className='font-bold text-cyan-500'>⋮</span> ) to open the options popover.
                    </List.Item>
                    <List.Item>
                      Select <span className='font-semibold'>Activate</span>.
                    </List.Item>
                  </List>
                </div>
                <div>
                  <p className='font-medium pb-2'>
                    Declining a subscription to your store: 
                  </p>
                  <List type='number'>
                    <List.Item>
                      Navigate to the <span className='font-semibold'>Publish</span> section of the app.
                    </List.Item>
                    <List.Item>
                      Go to the <span className='font-semibold'>Subscribers</span> list.
                    </List.Item>
                    <List.Item>
                      Hover over the subscription you want to decline.
                    </List.Item>
                    <List.Item>
                      Click on the options button ( <span className='font-bold text-cyan-500'>⋮</span> ) to open the options popover.
                    </List.Item>
                    <List.Item>
                      Select <span className='font-semibold'>Decline</span>.
                    </List.Item>
                  </List>
                </div>
              </div>
            ),
            nextLabel: 'Continue',
            jump: {
              page: 4,
              label: 'Skip to subscribing'
            }
          },
          {
            img: {
              src: 'https://via.placeholder.com/720x250.png',
              alt: 'App introduction image',
            },
            title: (
              <div className='flex flex-col items-center space-y-10'>
                <h2 className='text-3xl font-semibold text-amber-600 text-center'>
                  Pausing publishing on your store
                </h2>
              </div>
            ),
            content: (
              <div className='flex flex-col space-y-10 text-emerald-800'>
                <p className='font-medium'>
                  You can stop incoming subscriptions from coming in while keeping all of your current subscriptions by pausing publishing. 
                </p>
                <p className='font-medium'>
                  Subscriptions that have been paused will have a <Badge status='info' size='small'>Paused</Badge> badge 
                  indicating that they are subscribed to a paused store. 
                </p>
                <p className='font-medium'>
                  Pausing does <span className='text-amber-600'>NOT</span> stop subscribed stores from syncing with your store.
                </p>
                <div>
                  <p className='font-medium pb-2'>
                    Pausing publishing on your store: 
                  </p>
                  <List type='number'>
                    <List.Item>
                      Navigate to the <span className='font-semibold'>Publish</span> section of the app.
                    </List.Item>
                    <List.Item>
                      Go to the <span className='font-semibold'>Store publishing</span> card.
                    </List.Item>
                    <List.Item>
                      Click on the <span className='font-semibold'>options</span> button.
                    </List.Item>
                    <List.Item>
                      Select <span className='font-semibold'>Pause</span>.
                    </List.Item>
                  </List>
                </div>
                <div>
                  <p className='font-medium pb-2'>
                    Resuming publishing on your store: 
                  </p>
                  <List type='number'>
                    <List.Item>
                      Navigate to the <span className='font-semibold'>Publish</span> section of the app.
                    </List.Item>
                    <List.Item>
                      Go to the <span className='font-semibold'>Store publishing</span> card.
                    </List.Item>
                    <List.Item>
                      Click on the <span className='font-semibold'>options</span> button.
                    </List.Item>
                    <List.Item>
                      Select <span className='font-semibold'>Resume</span>.
                    </List.Item>
                  </List>
                </div>
              </div>
            ),
            nextLabel: 'Continue',
            jump: {
              page: 4,
              label: 'Skip to subscribing'
            }
          },
          {
            img: {
              src: 'https://via.placeholder.com/720x250.png',
              alt: 'App introduction image',
            },
            title: 'Test 4',
            content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat, magni! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat, magni!',
            exitLabel: 'Finish'
          },
        ]} />
  )
};

export default SetUpSection;
