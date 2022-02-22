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

type TSubscription = {
  storeURL: string,
  id: string,
  status: string,
  updatedAt: string,
}

interface IPublishSection {
  user: string,
  hasError: boolean,
  errorMessage: string,
  publishedTo: TSubscription[],
  isPublishActive: boolean,

  handlePause: () => void,
  handleStart: () => void,
  handleStop: () => void,
  handleStopAll: () => void,
  toggleHasError: () => void,
  onCopyToClipboard: (id: string) => void,
  onPublishConnect: (item: TSubscription) => void,
  onPublishDisconnect: (item: TSubscription) => void,

  showCalloutCardModal: boolean,
  openCalloutCardModal: () => void,
  closeCalloutCardModal: () => void,
  setShowCalloutCardModal: Dispatch<SetStateAction<boolean>>,

  showStopAllModal: boolean,
  openStopAllModal: () => void,
  closeStopAllModal: () => void,
  setShowStopAllModal: Dispatch<SetStateAction<boolean>>,

  showStopModal: boolean,
  openStopModal: () => void,
  closeStopModal: () => void,
  setShowStopModal: Dispatch<SetStateAction<boolean>>,
}

const PublishSection: FC<IPublishSection> = ({
  user,
  hasError,
  errorMessage,
  publishedTo,
  isPublishActive: isActive,

  handlePause,
  handleStart,
  handleStop,
  handleStopAll,
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
  setShowStopAllModal,

  showStopModal,
  openStopModal,
  closeStopModal,
  setShowStopModal,
}) => {
  const hasItems = (): boolean => publishedTo.length > 0
  const checkPaused = (active: boolean): boolean => !active && hasItems()
  const checkShowList = (active: boolean): boolean => active || checkPaused(active)
  const checkItemStatus = (item: TSubscription, status: string): boolean => item.status === status

  const [listHasItems, setListHasItems] = useState(hasItems())
  const [isPaused, setIsPaused] = useState(checkPaused(isActive))
  const [showList, setShowList] = useState(checkShowList(isActive))

  useEffect(() => {
    console.log(publishedTo, isActive, checkShowList(isActive))
    setListHasItems(hasItems())
    setIsPaused(checkPaused(isActive))
    setShowList(checkShowList(isActive))
  }, [isActive, publishedTo])

  return (
    <Section
      sectionTitle="Publishing"
      sectionDescription="Publish, pause and manage subscriptions to your store." >

      <Card>
        <StorePublishingCard
          activated={showList}
          primary={showList
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
              onAction: handleStart
            }
          }}
          onActivated={{
            title: <>Publish your products {isPaused && 
                <span className={'text-cyan-600 capitalize'}>(paused)</span>}
              </>,
            buttonTitle: "Options...",
            content: isPaused
              ? "Manage subscriptions to your store."
              : "Get your publishing link and share it with others.",
            sections: [{
              items: listHasItems
                ? [
                    {
                      content: isPaused
                        ? 'Resume' 
                        : 'Pause',
                      active: isPaused,
                      icon: isPaused
                        ? PlayMinor
                        : PauseMinor,
                      onAction: handlePause
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

      { showList && 
        <List
          list={publishedTo}
          listText={{
            title: "Publishing to these stores",
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
                      displayStatus: isPaused ? 'paused' : 'active',
                      tooltip: isPaused ? "Publishing is paused" : "Merchant is subscribed to your store",
                      statusStyle: isPaused ? "info" : "success",
                      dateTooltip: 'Active subscription',
                      progress: 'complete',
                    },
                  ]}
                  options={[
                    checkItemStatus(item, 'active')
                    ? null
                    : {
                      content: 'Accept',
                      helpText: "Accept subscription to your store",
                      icon: TickMinor,
                      onAction: () => onPublishConnect(item),
                      active: true,
                    },
                    {
                      content: checkItemStatus(item, 'active') ? 'Decline' : 'Disconnect',
                      helpText: checkItemStatus(item, 'active') ? "Deny subscription to your store" : "Remove subscription from your store",
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
            onAction: handleStopAll,
            destructive: true
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: closeStopAllModal,
            },
          ]}
          toast={{
            content: 'Subscriptions Removed'
          }} />

        <Modal
          title='Stop Publishing'
          content={<>
              <p>You will no longer be able to recieve subscriptions requests from other Products Pub/Sub users.</p>
              <p>Do you wish to continue?</p>
            </>}
          isModalOpen={showStopModal}
          modalHandler={setShowStopModal}
          primaryAction={{
            content: 'Stop Publishing',
            onAction: handleStop,
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
