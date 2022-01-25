import { ResourceItem, TextStyle, Toast } from '@shopify/polaris';
import {
  CancelSmallMinor,
  TickMinor,
  PlayMinor,
  PauseMinor,
} from '@shopify/polaris-icons';
import { FC, Dispatch, SetStateAction } from 'react';
import Item from './Item';
import List from './List';
import Modal from './Modal';
import Section from './Section';
import StorePublishingCard from './StorePublishingCard';

type TSubscription = {
  subscription: {
    storeURL: string,
    id: string,
    status: string,
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
  handlePublish: () => void,
  toggleHasError: () => void,
  onPublishConnect: (item: TSubscription['subscription']) => void,
  onPublishDisconnect: (item: TSubscription['subscription']) => void,
  
  showCalloutCardModal: boolean,
  openCalloutCardModal: () => void,
  closeCalloutCardModal: () => void,
  setShowCalloutCardModal: Dispatch<SetStateAction<boolean>>,
  
  showDisconnectAllModal: boolean,
  openDisconnectAllModal: () => void,
  closeDisconnectAllModal: () => void,
  handleDisconnectAllModal: () => void,
  setShowDisconnectAllModal: Dispatch<SetStateAction<boolean>>,

  showDeactivatePublishModal: boolean,
  openDeactivatePublishModal: () => void,
  closeDeactivatePublishModal: () => void,
  handleDeactivatePublishModal: () => void,
  setShowDeactivatePublishModal: Dispatch<SetStateAction<boolean>>,
}

const PublishSection: FC<IPublishSection> = ({
  user,
  hasError,
  errorMessage,
  publishedTo,
  isPublishActive,
  isPublishPaused,
  
  handlePause,
  handlePublish,
  toggleHasError,
  onPublishConnect,
  onPublishDisconnect,

  showCalloutCardModal,
  openCalloutCardModal,
  closeCalloutCardModal,
  setShowCalloutCardModal,

  showDisconnectAllModal,
  openDisconnectAllModal,
  closeDisconnectAllModal,
  handleDisconnectAllModal,
  setShowDisconnectAllModal,

  showDeactivatePublishModal,
  openDeactivatePublishModal,
  closeDeactivatePublishModal,
  handleDeactivatePublishModal,
  setShowDeactivatePublishModal,
}) => {
  return (
    <Section
      sectionTitle="Publish"
      sectionDescription="See which stores are subscribed to you." >

      <StorePublishingCard
        activated={!isPublishActive}
        primary={isPublishActive
          && {
              content: "Link",
              onAction: openCalloutCardModal, 
              primary: true,   
            }}
        onActivate={{
          title: <>Store Publishing <span className="text-red-600">(Disabled)</span></>,
          buttonTitle: "Activate",
          content: "Allow others to find and subscribe to your store.",
          defaultButton: {
            content: 'Activate', 
            icon: TickMinor,
            onAction: handlePublish
          }
        }}
        onDeactivate={
          publishedTo.length > 0
          ? {
            title: <>Store Publishing <span className={isPublishPaused ? 'text-cyan-600': 'text-green-600'}>
              ({isPublishPaused ? 'Paused' : 'Active'})
              </span></>,
            buttonTitle: "Options",
            content: "Share your store with others, pause publishing or disconnect all stores currently subscribed to you.",
            sections: [{
              title: 'Publish options',
              items: [
                {
                  content: isPublishPaused
                    ? 'Resume' 
                    : 'Pause',
                  active: isPublishPaused,
                  icon: isPublishPaused 
                    ? PlayMinor
                    : PauseMinor,
                  onAction: handlePause
                },
                {
                  destructive: true,
                  content: 'Disconnect All',
                  icon: CancelSmallMinor,
                  onAction: openDisconnectAllModal
                },
              ],
            }],
          }
        : {
          title: <>Store Publishing <span className="text-green-600">(Active)</span></>,
          buttonTitle: "Options",
          content: "Share your store with others or disable publishing.",
          sections: [{
            title: 'Publish options',
            items: [
              {
                destructive: true,
                content: 'Deactivate',
                icon: CancelSmallMinor,
                onAction: openDeactivatePublishModal
              },
            ],
          }],
          }} />

      { isPublishActive && 
        <List
          list={publishedTo}
          listText={{
            title: isPublishPaused 
              ? <>Subscribers <span className="text-cyan-600">(Paused)</span></>
              : "Subscribers",
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
                      tooltip: "Awaiting confirmation",
                      statusStyle: "new",
                    },
                    {
                      status: "active",
                      displayStatus: isPublishPaused ? "paused" : "active",
                      tooltip: isPublishPaused ? "Publishing is currently paused" : "An active subscription",
                      statusStyle: isPublishPaused ? "info" : "success",
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

      {hasError && <Toast content={errorMessage} error onDismiss={toggleHasError} /> }

      <Modal
        title="Disconnect All Subscriptions and Disable Publishing"
        content="All current subscriptions to your store will be disconnected 
          and publishing will be disabled. Do you wish to continue?" 
        isModalOpen={showDisconnectAllModal}
        modalHandler={setShowDisconnectAllModal} 
        primaryAction={{
          actionText: "Disconnect All",
          actionHandler: handleDisconnectAllModal,
          destructive: true
        }}
        secondaryActions={[
          {
            actionText: "Cancel",
            actionHandler: closeDisconnectAllModal,
          },
        ]}
        toast={{
          content: "Subscriptions Disconnected"
        }} />

      <Modal
        title="Disable Publishing"
        content="Disabling this setting will stop others from finding your 
          store. Do you wish to continue?" 
        isModalOpen={showDeactivatePublishModal}
        modalHandler={setShowDeactivatePublishModal} 
        primaryAction={{
          actionText: "Disable",
          actionHandler: handleDeactivatePublishModal,
          destructive: true
        }}
        secondaryActions={[
          {
            actionText: "Cancel",
            actionHandler: closeDeactivatePublishModal,
          },
        ]}
        toast={{
          content: "Publishing Disabled"
        }} />

      <Modal
        title="Get your store link"
        content={
          <p>
            Your store link is <TextStyle variation="code">{user}</TextStyle>. 
            Share it with others so that they can find and subscribe to your store.
          </p>
        }
        isModalOpen={showCalloutCardModal}
        modalHandler={setShowCalloutCardModal} 
        primaryAction={{
          actionText: "Continue",
          actionHandler: closeCalloutCardModal,
        }} />
      
    </Section>
  );
};

export default PublishSection;
