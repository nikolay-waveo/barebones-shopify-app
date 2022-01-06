import { Frame, Page, ResourceItem, TextStyle } from '@shopify/polaris';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  CancelSmallMinor,
  TickMinor,
  PlayMinor,
  PauseMinor,
} from '@shopify/polaris-icons';
import CalloutCard from './components/CalloutCard';
import Item from './components/Item';
import List from './components/List';
import Modal from './components/Modal';
import Section from './components/Section';
import Toggle from './components/Toggle';
import { usePublish } from './hooks/usePublish';
import { useSettings } from './hooks/useSettings';
import { useSubscribe } from './hooks/useSubscribe';


type TSubscription = {
  subscription: {
    storeURL: string,
    id: string,
    status: string,
  },
}

interface IAppProps {
  shopOrigin: string
}

// const App: FC<IAppProps> = ({
//   shopOrigin
// }) => {
//   return <div className='text-red-600'>{shopOrigin}</div>
// }

const App: FC<IAppProps> = ({
  shopOrigin
}) => {

  const [user, _] = useState(shopOrigin)
  const [publishedTo, setPublishedTo] = useState<TSubscription['subscription'][]>([]);
  const [subscribedTo, setSubscribedTo] = useState<TSubscription['subscription'][]>([]);
  const [publishMode, setPublishMode] = useState(false)
  const [isPublishActive, setIsPublishActive] = useState(publishMode)
  const [isPublishPaused, setIsPublishPaused] = useState(publishMode)
  const [showDeactivatePublishModal, setShowDeactivatePublishModal] = useState(false)
  const [showDisconnectAllModal, setShowDisconnectAllModal] = useState(false)
  const [showCalloutCardModal, setShowCalloutCardModal] = useState(false)
  const [showAddToListModal, setShowAddToListModal] = useState(false)
  const [itemIsLoading, setItemIsLoading] = useState(false)

  const renderCount = useRef(0)

  const {
    useGETShopSettings: getSettings, 
    useSETShopSettings: setSettings
  } = useSettings()

  const {
    useSETShopPublishSettings: setPublish,
    useDELETEShopPublishSettings: deletePublish,
  } = usePublish()

  const {
    useSETShopSubscribeSettings: setSubscribe,
    useDELETEShopSubscribeSettings: deleteSubscribe
  } = useSubscribe()

  //! Fix "[app] missing credentials"
  const {data, isLoading} = getSettings(user)

  useEffect(() => {
    // GET incoming and outgoing subscriptions
    if(!isLoading) {
      const publishedToData = data
      .published?.map(({
        shop,
        inventoryLocationId,
        status,
      }) => {
        return ({
          storeURL: shop,
          id: inventoryLocationId,
          status: status,
        })
      }) || []
      setPublishedTo(publishedToData)

      const subscribedToData = data
      .subscribed?.map(({
        shop,
        inventoryLocationId,
        status,
      }) => {
        return ({
          storeURL: shop,
          id: inventoryLocationId,
          status: status,
        })
      }) || []
      setSubscribedTo(subscribedToData) 
      setPublishMode(data.publish)

      if(renderCount.current <= 0) {
        setIsPublishActive(data.publish)
        renderCount.current = renderCount.current + 1;
      }
    }
  }, [data, isLoading, shopOrigin, user])

  //* ---------------------------------------------------------------------------------------------------------------
  // List

  const onItemIsLoading = useCallback(
    (list: TSubscription['subscription'][]) => {
      const hasData = list
        .every(({
          storeURL,
          id,
          status
        }) => {
          return (
            storeURL === undefined ||
            id === undefined ||
            status === undefined
          )
        })
        setItemIsLoading(!hasData)
    },
    [publishedTo, subscribedTo],
  )

  useEffect(() => {
    onItemIsLoading(publishedTo)
    onItemIsLoading(subscribedTo)
  }, [publishedTo, subscribedTo, itemIsLoading, onItemIsLoading])


  const addToSubscribedToListHandler = (url: string) => {  
    const storeID = "0"
    setSubscribe({
      origin: user,
      subscriberShop: url,
      id: storeID,
    })
    .then(({
      shop,
      inventoryLocationId,
      status,
      code, 
      message,
    }) => {
      if(code === "not_publishing") {
        // setErrorMessage(message)
        // setHasError(true)
        console.log(message)
      } else {
        setSubscribedTo([
          ...subscribedTo,
          {
            storeURL: shop,
            id: inventoryLocationId,
            status: status,
          }
        ])
      } 
    })
  }

  const onPublishConnect = (store: TSubscription['subscription']) => {
    setPublish({
      origin: user,
      publisherShop: store.storeURL,
      accept: true,
    })
    .then((_): void => {
      const newList = publishedTo.map((item) => item.storeURL === store.storeURL ? {...item, status: "active"} : item )
      setPublishedTo(newList);
    })
  }

  const onPublishDisconnect = (store: TSubscription['subscription']) => {
    if(store.status === "active") {
      deletePublish({
        origin: user,
        publisherShop: store.storeURL,
      })
      .then((_): void => {
        const newList = publishedTo.filter((item) => item.storeURL !== store.storeURL);
        setPublishedTo(newList);
      })
    }
    else {
      setPublish({
        origin: user,
        publisherShop: store.storeURL,
        accept: false,
      })
      .then((_): void => {
        const newList = publishedTo.filter((item) => item.storeURL !== store.storeURL);
        setPublishedTo(newList);
      })
    }
  }

  const onSubscribeDisconnect = (store: TSubscription['subscription']) => {
    deleteSubscribe({
      origin: user,
      subscriberShop: store.storeURL
    })
    .then(r => console.log('onSubDis', r))
    .then(_ => {
      const newList = subscribedTo.filter((item) => item.storeURL !== store.storeURL);
      setSubscribedTo(newList);
    })
  }

 
  //* ---------------------------------------------------------------------------------------------------------------
  // Toggle

  useEffect(() => {
    setPublishMode(publishMode)
  }, [publishMode])

  const openDeactivatePublishModal = (): void => setShowDeactivatePublishModal(true)
  const closeDeactivatePublishModal = (): void => setShowDeactivatePublishModal(false)

  const openDisconnectAllModal = (): void => setShowDisconnectAllModal(true)
  const closeDisconnectAllModal = (): void => setShowDisconnectAllModal(false)

  const openCalloutCardModal = (): void => setShowCalloutCardModal(true)
  const closeCalloutCardModal = (): void => setShowCalloutCardModal(false)    

  const handlePublish = useCallback(() => {
    if (isPublishActive) {
      openDeactivatePublishModal()
    } else {
      setSettings(user, {
        publish: !publishMode
      })
      .then(({
        publish
      }): void => {
        setIsPublishActive(publish)
        setIsPublishPaused(!publish)
      })
    }
  }, [isPublishActive, user, publishMode])

  const handleDeactivatePublishModal = useCallback(() => {
    setSettings(user, {
      publish: false
    })
    .then((_): void => {
      setPublishMode(false)
      setIsPublishActive(false)
      closeDeactivatePublishModal()
    })
  }, [])

  const handleDisconnectAllModal = useCallback(() => {
    handleDisconnectAll()
    setSettings(user, {
      publish: false
    })
    .then((_): void => {
      setPublishMode(false)
      setIsPublishActive(false)
      closeDisconnectAllModal()
    })
  }, [])
  
  const handlePause = useCallback(() => {
    setSettings(user, {
      publish: isPublishPaused
    })
    .then(({
      publish
    }): void => setIsPublishPaused(!publish))
  }, [user, isPublishPaused])

  const handleDisconnectAll = useCallback(() => {
    publishedTo.forEach(store => onPublishDisconnect(store))
  }, [])

  return (
    <Frame>
      <Page
        title="Store Product Sync v1"
        fullWidth={true}>
        <div className="grid grid-cols-1 gap-10 mb-20">
          <Section
            sectionTitle="Publish"
            sectionDescription="See which stores are subscribed to you." >

            <Toggle
              activated={isPublishActive}
              onActivate={
                publishedTo.length > 0
                ? {
                    title: isPublishPaused 
                      ? "Start Publishing"
                      : "Pause Publishing",
                    content: isPublishPaused
                      ? "Start publishing to allow others to find and subscribe to your store."
                      : "Pause to stop publishing but keep all current subscriptions to your store.",
                    contentStyle: isPublishPaused && 'positive',
                    primaryAction: {
                      content: isPublishPaused ? "Start" : "Pause",
                      onAction: handlePause,
                      icon: isPublishPaused ? PlayMinor : PauseMinor,
                      primary: isPublishPaused,
                      destructive: !isPublishPaused,
                    },
                    secondaryAction: {
                      content: "Disconnect All",
                      onAction: openDisconnectAllModal,
                      outline: true,
                      destructive: true,
                    },
                  }
                : {
                    title: "Disable Publishing",
                    content: "Stop others from finding your store and suspend all currently subscribed stores.",
                    primaryAction: {
                      content: "Deactivate",
                      onAction: openDeactivatePublishModal, 
                      outline: true,
                    },
                  }
              }
              onDeactivate={{
                title: "Enable Publishing",
                content: "Allow others to find and subscribe to your store.",
                primaryAction: {
                  content: "Activate",
                  onAction: handlePublish, 
                  primary: true,   
                },
              }} />

            { isPublishActive && 
              <>
                <CalloutCard 
                  title="Get your store link"
                  content="Share your store link with other businesses to allow them to subscribe to your store."
                  illustrationSRC="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
                  primaryAction={{
                    content: 'Get store link',
                    onAction: openCalloutCardModal,
                  }} /> 

                <List
                  list={publishedTo}
                  listText={{
                    title: isPublishPaused 
                      ? <>Subscribers <span className="text-red-600">(Paused)</span></>
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
                              isLoading: !isLoading,
                              accessibilityLabel: "Sending request",
                            }}
                            badges={[
                              {
                                status: "pending",
                                tooltip: "Waiting for publisher confirmation",
                                statusStyle: "new",
                              },
                              {
                                status: "active",
                                tooltip: "There is an active subscription",
                                statusStyle: "success",
                              },
                              {
                                status: "stopped",
                                tooltip: "The publisher has stopped the connection",
                                statusStyle: "critical",
                              },
                              {
                                status: "declined",
                                tooltip: "The publisher has declined your subscription request",
                                statusStyle: "warning",
                              },
                              {
                                status: "paused",
                                tooltip: "The subscription is active",
                                statusStyle: "info"
                              }
                            ]}
                            options={[
                              {
                                content: 'Connect',
                                helpText: "Accept subscription to your store",
                                icon: TickMinor,
                                onAction: () => onPublishConnect(item),
                                active: true,
                              },
                              {
                                content: 'Disconnect',
                                helpText: "Deny subscription to your store",
                                icon: CancelSmallMinor,
                                onAction: () => onPublishDisconnect(item),
                                destructive: true,
                              },
                            ]} />
                        </ResourceItem> 
                      )
                  }}/>
              </> }

            <Modal
              title="Disconnect All Subscriptions and Deactivate Publishing"
              content="All current subscriptions to your store will be disconnected 
                and publishing will be deactivated. Do you wish to continue?" 
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
              title="Deactivate Publishing"
              content="Deactivating this setting will stop others from finding your 
                store. Do you wish to continue?" 
              isModalOpen={showDeactivatePublishModal}
              modalHandler={setShowDeactivatePublishModal} 
              primaryAction={{
                actionText: "Deactivate",
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
                  Your store link is <TextStyle variation="strong">{user}</TextStyle>. 
                  Share it with others so that they can find and subscribe to your store.
                </p>
              }
              isModalOpen={showCalloutCardModal}
              modalHandler={setShowCalloutCardModal} 
//! Polaris blocks clipboard actions
              primaryAction={{
                actionText: "Copy Link",
                actionHandler: (e) => {
                  navigator.clipboard.writeText(user)
                  setShowCalloutCardModal(false)
                },
              }}
              secondaryActions={[
                {
                  actionText: "Cancel",
                  actionHandler: closeCalloutCardModal,
                },
              ]}
              toast={{
                content: "Copied to clipboard",
                duration: 3000
              }} />
            
          </Section>

          <Section
            sectionTitle="Subscribe"
            sectionDescription="Subscribe to a published store and check on pending subscriptions." >

            <List
              list={subscribedTo}
              listText={{
                title: "Subscriptions",
                description: "A list of all of your subscriptions to other stores.",
              }}
              emptyListText={{
                title: "No subscriptions yet",
                description: "Track your subscriptions from stores."
              }}
              primaryAction={{
                content: "New Subscription",
                onAction: () => setShowAddToListModal(true),
              }}
              renderItem={(item) => { 
                return (
                  <ResourceItem
                    id={item.id}
                    onClick={() => {}}>
                      <Item
                        item={item} 
                        loading={{
                          isLoading: itemIsLoading,
                          accessibilityLabel: "Sending request",
                        }}
                        badges={[
                          {
                            status: "pending",
                            tooltip: "Waiting for publisher confirmation",
                            statusStyle: "new",
                          },
                          {
                            status: "active",
                            tooltip: "There is an active subscription",
                            statusStyle: "success",
                          },
                          {
                            status: "stopped",
                            tooltip: "The publisher has stopped the connection",
                            statusStyle: "critical",
                          },
                          {
                            status: "declined",
                            tooltip: "The publisher has declined your subscription request",
                            statusStyle: "warning",
                          },
                        ]}
                        options={[
                          {
                            content: 'Disconnect',
                            helpText: "Deny subscription to your store",
                            icon: CancelSmallMinor,
                            onAction: () => onSubscribeDisconnect(item),
                            destructive: true,
                          },
                        ]} />
                    </ResourceItem> 
                  )
              }} />

            <Modal
              title="Subscribe to a new store"
              content="You can add the store subscription link here to subscribe to that
                store and recieve product updates from them."
              isModalOpen={showAddToListModal}
              modalHandler={setShowAddToListModal}
              primaryAction={{
                actionText: "Subscribe",
                actionHandler: (e) => addToSubscribedToListHandler(e)
              }}
              inputAction={{
                id: "modalInput",
                label: "Store Subscription Link",
                placeholder: "Example: store.myshopify.com",
                errorMessage: "Invalid input",
                errorHandler: (input) => {
                  const storeURLPattern = /(\w+-)*\w+(.myshopify.com)/
                  if(!input) return true
                  return !storeURLPattern.test(input)
                }
              }}
              toast={{
                content: "Request Sent",
              }} />

          </Section>         
        </div>
      </Page>
    </Frame>
  )
}

export default App
