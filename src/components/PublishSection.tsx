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


type TPublishState = 'active' | 'disabled' | 'paused'

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
  // handleDisconnectAll: () => void,
  handlePublish: () => void, //!
  toggleHasError: () => void,
  onCopyToClipboard: (id: string) => void,
  onPublishConnect: (item: TSubscription['subscription']) => void,
  onPublishDisconnect: (item: TSubscription['subscription']) => void,
  
  showCalloutCardModal: boolean,
  openCalloutCardModal: () => void,
  closeCalloutCardModal: () => void,
  setShowCalloutCardModal: Dispatch<SetStateAction<boolean>>,
  
  showDisconnectAllModal: boolean,
  openDisconnectAllModal: () => void,
  closeDisconnectAllModal: () => void,
  handleDisconnectAllModal: () => void, //!
  setShowDisconnectAllModal: Dispatch<SetStateAction<boolean>>,

  showDeactivatePublishModal: boolean,
  openDeactivatePublishModal: () => void,
  closeDeactivatePublishModal: () => void,
  handleDeactivatePublishModal: () => void, //!
  setShowDeactivatePublishModal: Dispatch<SetStateAction<boolean>>,
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
  // handleDisconnectAll,
  handlePublish, //!
  toggleHasError,
  onCopyToClipboard,
  onPublishConnect,
  onPublishDisconnect,

  showCalloutCardModal,
  openCalloutCardModal,
  closeCalloutCardModal,
  setShowCalloutCardModal,

  showDisconnectAllModal,
  openDisconnectAllModal,
  closeDisconnectAllModal,
  handleDisconnectAllModal, //!
  setShowDisconnectAllModal,

  showDeactivatePublishModal,
  openDeactivatePublishModal,
  closeDeactivatePublishModal,
  handleDeactivatePublishModal, //!
  setShowDeactivatePublishModal,
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
    if (!publish) return 'disabled'
    return 'active'
  }

  const publishState = getPublishState( isActive, isPaused, listHasItems )

  return (
    <Section
      sectionTitle="Publish"
      sectionDescription="See which stores are subscribed to you." >

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
            title: <>Publish your products <span className="text-red-600 capitalize">({publishState})</span></>,
            buttonTitle: "Activate",
            content: "Allow others to find and subscribe to the products of your store.",
            defaultButton: {
              content: 'Activate', 
              icon: TickMinor,
              onAction: handlePublish //handleActivate
            }
          }}
          onActivated={{
            title: <>Publish your products <span className={(isPaused ? 'text-cyan-600': 'text-green-600') + ' capitalize'}>
              ({publishState})
              </span></>,
            buttonTitle: "Options",
            content: isPaused
              ? "Share your publishing link with subscribers and manage subscriptions to your store."
              : "Share your publishing link with subscribers.",
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
                      onAction: handlePause // handlePause
                    },
                    {
                      destructive: true,
                      content: 'Disconnect All',
                      icon: CancelSmallMinor,
                      onAction: openDisconnectAllModal
                    },
                  ]
                : [
                    {
                      destructive: true,
                      content: 'Deactivate',
                      icon: CancelSmallMinor,
                      onAction: openDeactivatePublishModal
                    },
                  ]
            }],
          }} />

      { isActive && 
        <List
          list={publishedTo}
          listText={{
            title: "Subscribers",
            description: "You can connect, disconnect and track subscriptions to your store.",
          }}
          emptyListText={{
            title: "No subscribers yet",
            description: "Track user subscriptions to your store."
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
          title='Disconnect All Subscriptions and Disable Publishing'
          content='All current subscriptions to your store will be disconnected 
            and publishing will be disabled. Do you wish to continue?' 
          isModalOpen={showDisconnectAllModal}
          modalHandler={setShowDisconnectAllModal} 
          primaryAction={{
            content: 'Disconnect All',
            onAction: handleDisconnectAllModal, // handleDisconnectAll
            destructive: true
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: closeDisconnectAllModal,
            },
          ]}
          toast={{
            content: 'Subscriptions Disconnected'
          }} />

        <Modal
          title='Deactivate Publishing'
          content='Deactivating this setting will stop others from finding your 
            store. Do you wish to continue?' 
          isModalOpen={showDeactivatePublishModal}
          modalHandler={setShowDeactivatePublishModal} 
          primaryAction={{
            content: 'Deactivate',
            onAction: handleDeactivatePublishModal, // handleDeactivate
            destructive: true
          }}
          secondaryActions={[
            {
              content: 'Cancel',
              onAction: closeDeactivatePublishModal,
            },
          ]}
          toast={{
            content: 'Publishing Deactivated'
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
