import { ResourceItem } from '@shopify/polaris';
import { CancelSmallMinor } from '@shopify/polaris-icons';
import { FC, Dispatch, SetStateAction } from 'react';
import Item from './Item';
import List from './List';
import ModalWithForm from './ModalWithForm';
import ModalWithSelect from './ModalWithSelect';
import Section from './Section';

type TLocation = {
  name: string,
  id: string
}

type TStore = {
  url: string;
  id: string;
}

type TSubscription = {
  subscription: {
    storeURL: string,
    id: string,
    status: string,
    updatedAt: string,
  },
}

interface ISubscribeSection {
  subscribedTo: TSubscription['subscription'][],
  locations: TLocation[],

  onSubscribeDisconnect: (item: TSubscription['subscription']) => void,

  showAddToListModal: boolean,
  openAddToListModal: () => void,
  closeAddToListModal: () => void,
  setShowAddToListModal: Dispatch<SetStateAction<boolean>>,

  addToSubscribedToListHandler: (store: TStore) => Promise<boolean>,
}

const SubscribeSection: FC<ISubscribeSection> = ({
  subscribedTo,
  locations,

  onSubscribeDisconnect,
  addToSubscribedToListHandler,

  showAddToListModal,
  openAddToListModal,
  closeAddToListModal,
  setShowAddToListModal,
}) => {
  return (
    <Section
      sectionTitle="Subscribe"
      sectionDescription="Subscribe to a published store and check on pending subscriptions." >

      <List
        list={subscribedTo}
        listText={{
          title: "Your subscriptions",
          description: "A list of all of your product subscriptions to other stores.",
        }}
        emptyListText={{
          title: "No subscriptions yet",
          description: "Track your subscriptions from stores."
        }}
        primaryAction={{
          content: "New Subscription",
          onAction: openAddToListModal,
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
                      tooltip: "Your subscription is active",
                      statusStyle: "success",
                      dateTooltip: 'Active subscription',
                      progress: 'complete',
                    },
                    {
                      status: "stopped",
                      tooltip: "Subscription canceled by publisher",
                      statusStyle: "critical",
                      dateTooltip: 'Subscription stopped',
                      progress: 'partiallyComplete',
                    },
                    {
                      status: "declined",
                      tooltip: "Subscription declined by publisher",
                      statusStyle: "warning",
                      dateTooltip: 'Subscription declined',
                      progress: 'partiallyComplete',
                    },
                  ]}
                  options={[
                    {
                      content: 'Disconnect',
                      helpText: "Disconnect from a store",
                      icon: CancelSmallMinor,
                      onAction: () => onSubscribeDisconnect(item),
                      destructive: true,
                    },
                  ]} />
              </ResourceItem>
            )
        }} />
        
        { locations.length > 0
          ? <ModalWithSelect
              title="Subscribe to a new store"
              content="You can add the store subscription link here to subscribe to that
                store and recieve product updates from them."
              isModalOpen={showAddToListModal}
              modalHandler={setShowAddToListModal}
              primaryAction={{
                actionText: "Subscribe",
                actionHandler: (e) => addToSubscribedToListHandler(e)
              }}
              secondaryActions={[
                {
                  actionText: "Cancel",
                  actionHandler: closeAddToListModal,
                },
              ]}
              inputAction={{
                id: "storeLinkInput",
                label: "Store Link",
                placeholder: "Example: store.myshopify.com",
                errorMessage: "Invalid input",
                errorHandler: (input): boolean => {
                  const storeURLPattern = /^(\w+-)*\w+(.myshopify.com)$/
                  if(!input) return true
                  return !storeURLPattern.test(input) 
                },
                required: true
              }}
              locations={locations}
              toast={{
                content: "Request Sent",
              }} /> 
          : <ModalWithForm 
              title="Subscribe to a new store"
              content="You can add the store subscription link here to subscribe to that
                store and recieve product updates from them."
              isModalOpen={showAddToListModal}
              modalHandler={setShowAddToListModal}
              primaryAction={{
                actionText: "Subscribe",
                actionHandler: (e) => addToSubscribedToListHandler(e)
              }}
              secondaryActions={[
                {
                  actionText: "Cancel",
                  actionHandler: closeAddToListModal,
                },
              ]}
              inputAction={{
                id: "storeLinkInput",
                label: "Store Link",
                placeholder: "Example: store.myshopify.com",
                errorMessage: "Invalid input",
                errorHandler: (input): boolean => {
                  const storeURLPattern = /^(\w+-)*\w+(.myshopify.com)$/
                  if(!input) return true
                  return !storeURLPattern.test(input) 
                },
              }}
              toast={{
                content: "Request Sent",
              }} />
        }
    </Section>
  );
};

export default SubscribeSection;
