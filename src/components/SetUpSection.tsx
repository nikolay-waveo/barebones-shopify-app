import { List, Badge } from '@shopify/polaris';
import { FC } from 'react';
import SetUpInstructions from './SetUpInstructions';
import img1 from '../assets/Pubsub-asset-1.png'

interface ISetUpSection {
  onFinish(): void,
}

const SetUpSection: FC<ISetUpSection> = ({
  onFinish
}) => {

  const SUBSCRIBING_PAGE = 8

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
                <div>
                  <p className='font-medium pb-2'>
                    Enabling publishing: 
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
              </div>
            ),
            nextLabel: 'Continue',
            skipTo: {
              page: SUBSCRIBING_PAGE,
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
                  Getting your store link
                </h2>
              </div>
            ),
            content: (
              <div className='flex flex-col space-y-10 text-emerald-800'>
                <p className='font-medium'>
                  Sharing your store link with others is how you get others to subscribe to your store. 
                </p>
                <div>
                  <p className='font-medium pb-2'>
                    Getting your store link: 
                  </p>
                  <List type='number'>
                    <List.Item>
                      Navigate to the <span className='font-semibold'>Publish</span> section of the app.
                    </List.Item>
                    <List.Item>
                      Go to the <span className='font-semibold'>Store Publishing</span> card.
                    </List.Item>
                    <List.Item>
                      Click on <span className='font-semibold'>Link</span>.
                    </List.Item>
                    <List.Item>
                      Copy your store link and share it with others.
                    </List.Item>
                  </List>
                </div>
              </div>
            ),
            nextLabel: 'Continue',
            skipTo: {
              page: SUBSCRIBING_PAGE,
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
                  Once you enable publishing you can access your <span className='text-amber-600'>Subscribers</span> list.
                </p>
                <p className='font-medium'>
                  Here you can manage the subscriptions of everyone who is subscribed to your store.
                </p>
                <p className='font-medium'>
                  Subscription requests will appear on your list with a <Badge status='new' size='small'>Pending</Badge> badge, 
                  from here you can choose to accept or decline their subscription to your store. 
                </p>
                <div>
                  <p className='font-medium pb-2'>
                    Accepting a subscription: 
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
                      Select <span className='font-semibold'>Accept</span>.
                    </List.Item>
                  </List>
                </div>
                <div>
                  <p className='font-medium pb-2'>
                    Declining a subscription: 
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
            skipTo: {
              page: SUBSCRIBING_PAGE,
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
                  Deactivating publishing
                </h2>
              </div>
            ),
            content: (
              <div className='flex flex-col space-y-10 text-emerald-800'>
                <p className='font-medium'>
                  If at any time you no longer wish to allow others to subscribe to your store, you can deactivate publishing.
                  This feature is only available when you have not <Badge status='success' size='small'>Active
                  </Badge> or <Badge status='new' size='small'>Pending</Badge> subscriptions to your store. 
                </p>
                <p className='font-medium'>
                  In the case you have <Badge status='success' size='small'>Active</Badge> or <Badge status='new' size='small'>
                  Pending</Badge> subscriptions, you can instead choose to either <span className='text-amber-600'>Pause
                  </span> publishing or <span className='text-amber-600'>Disconnect all</span> stores.
                </p>
                <div>
                  <p className='font-medium pb-2'>
                    Deactivating publishing: 
                  </p>
                  <List type='number'>
                    <List.Item>
                      Navigate to the <span className='font-semibold'>Publish</span> section of the app.
                    </List.Item>
                    <List.Item>
                      Go to the <span className='font-semibold'>Store publishing</span> card.
                    </List.Item>
                    <List.Item>
                      Click on the <span className='font-semibold'>Options</span> button.
                    </List.Item>
                    <List.Item>
                      Select <span className='font-semibold'>Deactivate</span>.
                    </List.Item>
                  </List>
                </div>
              </div>
            ),
            nextLabel: 'Continue',
            skipTo: {
              page: SUBSCRIBING_PAGE,
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
                  You can stop receiving incoming subscriptions while keeping all of your current subscriptions by pausing publishing
                  on your store. 
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
                    Pausing publishing: 
                  </p>
                  <List type='number'>
                    <List.Item>
                      Navigate to the <span className='font-semibold'>Publish</span> section of the app.
                    </List.Item>
                    <List.Item>
                      Go to the <span className='font-semibold'>Store publishing</span> card.
                    </List.Item>
                    <List.Item>
                      Click on the <span className='font-semibold'>Options</span> button.
                    </List.Item>
                    <List.Item>
                      Select <span className='font-semibold'>Pause</span>.
                    </List.Item>
                  </List>
                </div>
                <div>
                  <p className='font-medium pb-2'>
                    Resuming publishing: 
                  </p>
                  <List type='number'>
                    <List.Item>
                      Navigate to the <span className='font-semibold'>Publish</span> section of the app.
                    </List.Item>
                    <List.Item>
                      Go to the <span className='font-semibold'>Store publishing</span> card.
                    </List.Item>
                    <List.Item>
                      Click on the <span className='font-semibold'>Options</span> button.
                    </List.Item>
                    <List.Item>
                      Select <span className='font-semibold'>Resume</span>.
                    </List.Item>
                  </List>
                </div>
              </div>
            ),
            nextLabel: 'Continue',
            skipTo: {
              page: SUBSCRIBING_PAGE,
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
                  Disconnecting all subscriptions and deactivating publishing
                </h2>
              </div>
            ),
            content: (
              <div className='flex flex-col space-y-10 text-emerald-800'>
                <p className='font-medium'>
                  This option allows you to disconnect all <Badge status='success' size='small'>Active</Badge> and <Badge status='new' 
                  size='small'>Pending</Badge> subscriptions before deactivating publishing on your store.
                </p>
                <div>
                  <p className='font-medium pb-2'>
                    Disconnecting all subscriptions and deactivating publishing on your store: 
                  </p>
                  <List type='number'>
                    <List.Item>
                      Navigate to the <span className='font-semibold'>Publish</span> section of the app.
                    </List.Item>
                    <List.Item>
                      Go to the <span className='font-semibold'>Store publishing</span> card.
                    </List.Item>
                    <List.Item>
                      Click on the <span className='font-semibold'>Options</span> button.
                    </List.Item>
                    <List.Item>
                      Select <span className='font-semibold'>Disconnect all</span>.
                    </List.Item>
                  </List>
                </div>
                <p className='font-medium'>
                  When you enable publishing again, subscribers will need to send another subscription request before they
                  can be added to your subscription list.
                </p>
              </div>
            ),
            nextLabel: 'Continue',
            skipTo: {
              page: SUBSCRIBING_PAGE,
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
                  Subscribing to other stores
                </h2>
              </div>
            ),
            content: (
              <div className='flex flex-col space-y-10 text-emerald-800'>
                <p className='font-medium'>
                  You can subscribe to other stores by adding them to your subscriptions list. 
                </p>
                <p className='font-medium'>
                  In order to subscribe to a store, you will need a <span className='text-amber-600'>Store Link</span>. 
                  This will be provided by the publisher.
                </p>
                <div>
                  <p className='font-medium pb-2'>
                    Subscribing to a store: 
                  </p>
                  <List type='number'>
                    <List.Item>
                      Navigate to the <span className='font-semibold'>Subscribe</span> section of the app.
                    </List.Item>
                    <List.Item>
                      Click on the <span className='font-semibold'>New subscription</span> button.
                    </List.Item>
                    <List.Item>
                      Enter the <span className='font-semibold'>Store Link</span> in the input field.
                    </List.Item>
                    <List.Item>
                      Click on <span className='font-semibold'>Subscribe</span> to send a subscription request.
                    </List.Item>
                  </List>
                </div>
                <p className='font-medium'>
                  Subscriptions only become <Badge status='success' size='small'>Active</Badge> after being accepted 
                  by the store publisher.
                </p>
              </div>
            ),
            nextLabel: 'Continue',
          },
          {
            img: {
              src: 'https://via.placeholder.com/720x250.png',
              alt: 'App introduction image',
            },
            title: (
              <div className='flex flex-col items-center space-y-10'>
                <h2 className='text-3xl font-semibold text-amber-600 text-center'>
                  Your Subscription list
                </h2>
              </div>
            ),
            content: (
              <div className='flex flex-col space-y-10 text-emerald-800'>
                <p className='font-medium'>
                  All of your subscriptions are displayed on your subscription list.
                </p>
                <p className='font-medium'>
                  The status badge on your subscription will tell you the current status of your subscription.
                </p>
                <div>
                  <p className='font-medium pb-2'>
                    Subscription status badges: 
                  </p>
                  <List type='bullet'>
                    <List.Item>
                      <Badge status='new' size='small'>Pending</Badge> Awaiting confirmation from the publisher.
                    </List.Item>
                    <List.Item>
                      <Badge status='success' size='small'>Active</Badge> An active subscription.
                    </List.Item>
                    <List.Item>
                      <Badge status='warning' size='small'>Denied</Badge> Subscription request has been declined.
                    </List.Item>
                    <List.Item>
                      <Badge status='critical' size='small'>Stopped</Badge> Your subscription has been canceled by the publisher.
                    </List.Item>
                  </List>
                </div>
                <p className='font-medium'>
                  If you are trying to subscribe to a store that has recently <Badge status='warning' size='small'>Denied
                  </Badge> or <Badge status='critical' size='small'>Stopped</Badge> your subscription, you will have to cancel the 
                  subscription before sending another request.
                </p>
              </div>
            ),
            nextLabel: 'Continue',
          },
          {
            img: {
              src: 'https://via.placeholder.com/720x250.png',
              alt: 'App introduction image',
            },
            title: (
              <div className='flex flex-col items-center space-y-10'>
                <h2 className='text-3xl font-semibold text-amber-600 text-center'>
                  Managing your subscriptions
                </h2>
              </div>
            ),
            content: (
              <div className='flex flex-col space-y-10 text-emerald-800'>
                <p className='font-medium'>
                  If you no longer wish to subscribe to a store, you can <span className="text-amber-600">deactivate</span> your subscription in your subscription list.
                </p>
                <div>
                  <p className='font-medium pb-2'>
                    Deactivating a subscription: 
                  </p>
                  <List type='number'>
                    <List.Item>
                      Navigate to the <span className='font-semibold'>Subscribe</span> section of the app.
                    </List.Item>
                    <List.Item>
                      Go to the <span className='font-semibold'>Subscriptions</span> list.
                    </List.Item>
                    <List.Item>
                      Hover over the subscription you want to deactivate.
                    </List.Item>
                    <List.Item>
                      Click on the options button ( <span className='font-bold text-cyan-500'>⋮</span> ) to open the options popover.
                    </List.Item>
                    <List.Item>
                      Select <span className='font-semibold'>Deactivate</span>.
                    </List.Item>
                  </List>
                </div>
              </div>
            ),
            nextLabel: 'Continue',
          },
          {
            img: {
              src: 'https://via.placeholder.com/720x250.png',
              alt: 'App introduction image',
            },
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
