import { Card, ResourceItem, TextStyle, Toast } from '@shopify/polaris';
import {
  CancelSmallMinor,
  TickMinor,
  PlayMinor,
  PauseMinor,
} from '@shopify/polaris-icons';
import { FC, Dispatch, SetStateAction, useState, useEffect } from 'react';
import Modal from './Modal';
import Item from './Item';
import List from './List';
import Section from './Section';
import StorePublishingCard from './StorePublishingCard';


type TPublishState = 'active' | 'deactivated' | 'paused'

type TSubscription = {
  subscription: {
    storeURL: string,
    id: string,
    status: string,
    updatedAt: string,
  },
}

interface IPublishSection {
  user: string,
  hasError: boolean,
  errorMessage: string,
  publishedTo: TSubscription['subscription'][],
  isPublishActive: boolean,
  isPublishPaused: boolean,
  
  handlePause: () => void,
  // handleActivate: () => void,
  // handleDeactivate: () => void,
  // handleStopAll: () => void,
  handlePublish: () => void, //!
  toggleHasError: () => void,
  onCopyToClipboard: (id: string) => void,
  onPublishConnect: (item: TSubscription['subscription']) => void,
  onPublishDisconnect: (item: TSubscription['subscription']) => void,
  
  showCalloutCardModal: boolean,
  openCalloutCardModal: () => void,
  closeCalloutCardModal: () => void,
  setShowCalloutCardModal: Dispatch<SetStateAction<boolean>>,
  
  showStopAllModal: boolean,
  openStopAllModal: () => void,
  closeStopAllModal: () => void,
  handleStopAllModal: () => void, //!
  setShowStopAllModal: Dispatch<SetStateAction<boolean>>,

  showStopModal: boolean,
  openStopModal: () => void,
  closeStopModal: () => void,
  handleStopModal: () => void, //!
  setShowStopModal: Dispatch<SetStateAction<boolean>>,
}

const PublishSection: FC<IPublishSection> = ({
  user,
  hasError,
  errorMessage,
  publishedTo,
  isPublishActive: isActive,
  isPublishPaused: isPaused,
  
  handlePause,
  // handleActivate,
  // handleDeactivate,
  // handleStopAll,
  handlePublish, //!
  toggleHasError,
  onCopyToClipboard,
  onPublishConnect,
  onPublishDisconnect,

  showCalloutCardModal,
  openCalloutCardModal,
  closeCalloutCardModal,
  setShowCalloutCardModal,

  showStopAllModal,
  openStopAllModal,
  closeStopAllModal,
  handleStopAllModal, //!
  setShowStopAllModal,

  showStopModal,
  openStopModal,
  closeStopModal,
  handleStopModal, //!
  setShowStopModal,
}) => {

  const [listHasItems, setListHasItems] = useState(publishedTo.length > 0)

  useEffect(() => {
    setListHasItems(publishedTo.length > 0)
  }, [publishedTo])

  const getPublishState = (
    publish: boolean, 
    pause: boolean,
    listHasItems: boolean,
  ): TPublishState => {
    if (publish && pause && listHasItems) return 'paused'
    if (!publish) return 'deactivated'
    return 'active'
  }

  const publishState = getPublishState( isActive, isPaused, listHasItems )

  return (
    <Section
      sectionTitle="Publishing"
      sectionDescription="Publish, pause and manage subscriptions to your store." >

      <Card>
        <StorePublishingCard
          activated={isActive}
          primary={isActive
            ? {
                content: "Get link",
                onAction: openCalloutCardModal, 
                primary: true,
              } 
            : null
          }
          onDeactivated={{
            title: "Publish your products",
            buttonTitle: "Activate",
            content: "Allow others to find and subscribe to the products of your store.",
            defaultButton: {
              content: 'Activate', 
              icon: TickMinor,
              onAction: handlePublish //handleActivate
            }
          }}
          onActivated={{
            title: <>Publish your products {isPaused && 
                <span className={'text-cyan-600 capitalize'}>(paused)</span>}
              </>,
            buttonTitle: "Options...",
            content: isPaused
              ? "Manage subscriptions to your store."
              : "Share your publishing link with subscribers.",
            sections: [{
              items: !listHasItems
                ? [
                    {
                      content: isPaused
                        ? 'Resume' 
                        : 'Pause',
                      active: isPaused,
                      icon: isPaused
                        ? PlayMinor
                        : PauseMinor,
                      onAction: handlePause // handlePause
                    },
                    {
                      destructive: true,
                      content: 'Remove All...',
                      icon: CancelSmallMinor,
                      onAction: openStopAllModal
                    },
                  ]
                : [
                    {
                      destructive: true,
                      content: 'Stop publishing...',
                      icon: CancelSmallMinor,
                      onAction: openStopModal
                    },
                  ]
            }],
          }} />

      { isActive && 
        <List
          list={publishedTo}
          listText={{
            title: "Subscribers",
            description: "View and manage your subscribers.",
          }}
          emptyListText={{
            title: "You don't have any subscribers",
            description: "Share your store link and gain subscribers."
          }} 
          renderItem={(item) => { 
            return (
              <ResourceItem
                id={item.id}
                onClick={() => {}}>
                <Item
                  item={item} 
                  loading={{
                    accessibilityLabel: "Sending request",
                  }}
                  badges={[
                    {
                      status: "pending",
                      tooltip: "Pending publisher approval",
                      statusStyle: "new",
                      dateTooltip: 'Pending approval',
                      progress: 'incomplete',
                    },
                    {
                      status: "active",
                      displayStatus: publishState,
                      tooltip: isPaused ? "Publishing is paused" : "Merchant is subscribed to your store",
                      statusStyle: isPaused ? "info" : "success",
                      dateTooltip: 'Active subscription',
                      progress: 'complete',
                    },
                  ]}
                  options={[
                    item.status !== 'active' 
                    ? {
                      content: 'Accept',
                      helpText: "Accept subscription to your store",
                      icon: TickMinor,
                      onAction: () => onPublishConnect(item),
                      active: true,
                    }
                    : null,
                    {
                      content: item.status !== 'active' ? 'Decline' : 'Disconnect',
                      helpText: "Deny subscription to your store",
                      icon: CancelSmallMinor,
                      onAction: () => onPublishDisconnect(item),
                      destructive: true,
                    },
                  ]} />
                </ResourceItem> 
              )
          }}/> }
      </Card>

      {hasError && <Toast content={errorMessage} error onDismiss={toggleHasError} /> }

        <Modal
          title='Remove All Subscriptions'
          content={<>
              <p>All current subscriptions to your store will be removed and publishing will be stopped.</p>
              <p>Do you wish to continue?</p>
            </>}
          isModalOpen={showStopAllModal}
          modalHandler={setShowStopAllModal} 
          primaryAction={{
            content: 'Remove All',
            onAction: handleStopAllModal, // handleStopAll
            destructive: true
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: closeStopAllModal,
            },
          ]}
          toast={{
            content: 'Subscriptions Disconnected'
          }} />

        <Modal
          title='Stop Publishing'
          content={<>
              <p>Others will no longer be able to subscribe to your store.</p>
              <p>Do you wish to continue?</p>
            </>}
          isModalOpen={showStopModal}
          modalHandler={setShowStopModal}
          primaryAction={{
            content: 'Stop',
            onAction: handleStopModal, // handleDeactivate
            destructive: true
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: closeStopModal,
            },
          ]}
          toast={{
            content: 'Publishing Stopped'
          }} />

        <Modal
          title='Get your publishing link'
          content={
            <>
              <p>
                Your publishing link is <TextStyle variation='code'><span id='copyTarget'>{user}</span></TextStyle>.
              </p>
              <p>
                Share this link with others to let them find and send a subscription request to your store.
              </p>
            </>
          }
          isModalOpen={showCalloutCardModal}
          modalHandler={setShowCalloutCardModal}
          primaryAction={{
            content: 'Copy link',
            onAction: () => {
              onCopyToClipboard('copyTarget')
              closeCalloutCardModal()
            },
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: closeCalloutCardModal,
            },
          ]}
          toast={{
            content: "Link Copied"
          }} />
      
    </Section>
  );
};

export default PublishSection;
