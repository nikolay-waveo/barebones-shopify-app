
import { Frame, Page, ResourceItem, TextStyle, Toast } from '@shopify/polaris';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  CancelSmallMinor,
  TickMinor,
  PlayMinor,
  PauseMinor,
} from '@shopify/polaris-icons';
import Item from './components/Item';
import List from './components/List';
import Modal from './components/Modal';
import Section from './components/Section';
import SetUpSection from './components/SetUpSection';
import ModalWithForm from './components/ModalWithForm';
import StorePublishingCard from './components/StorePublishingCard';
import { useSubscribe } from './hooks/useSubscribe';
import { usePublisher } from './hooks/usePublisher';
import { useSubscriber } from './hooks/useSubscriber';

type TSubscription = {
  subscription: {
    storeURL: string,
    id: string,
    status: string,
  },
}

interface IAppProps {
  shopOrigin: string,
  installed: boolean,
}

const App: FC<IAppProps> = ({
  shopOrigin,
  installed,
}) => {

  const [user] = useState(shopOrigin)
  const [postInstall, setPostInstall] = useState(installed)
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
  const [errorMessage, setErrorMessage] = useState("")
  const [hasError, setHasError] = useState(false)

  const renderCount = useRef(0)

  const {
    useDisplayPublisher,
    useUpdatePublishStatus,
    useUpdateSubscriber,
    useRemoveSubscriber,
  } = usePublisher();

  const {
    data,
    isLoading,
    isError
  } = useDisplayPublisher({ origin: user })

  const {
    useRetrieveLocation,
    useUpdateSubscription,
    useRemoveSubscription,
  } = useSubscriber();

  const {
    useSETShopSubscribeSettings: setSubscribe,
    useDELETEShopSubscribeSettings: deleteSubscribe
  } = useSubscribe()

  useEffect(() => {
    // GET incoming and outgoing subscriptions
    if(!isLoading && !isError) {
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
  }, [data, isLoading, user])

  const toggleHasError = useCallback(() => setHasError((hasError) => !hasError),[])

  const errorCodeToMessage = (code: string): string => {
    switch(code) {
      case "not_publishing":  return "Store not publishing"
      case "cyclic_dependency": return "Cannot subscribe to self"
      default: return ""
    }
  }

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
    }) => {
      if(code) {
        setErrorMessage(errorCodeToMessage(code))
        setHasError(true)
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
    useUpdateSubscriber({
      origin: user,
      shop: store.storeURL,
      accept: true,
    })
    .then((_): void => {
      const newList = publishedTo.map((item) => item.storeURL === store.storeURL ? {...item, status: "active"} : item )
      setPublishedTo(newList);
    })
  }

  const onPublishDisconnect = (store: TSubscription['subscription']) => {
    if(store.status === "active") {
      useRemoveSubscriber({
        origin: user, 
        shop: store.storeURL
      })
      .then((_): void => {
        const newList = publishedTo.filter((item) => item.storeURL !== store.storeURL);
        setPublishedTo(newList);
      })
    }
    else {
      useUpdateSubscriber({
        origin: user,
        shop: store.storeURL,
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
      useUpdatePublishStatus({
        origin: user,
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
    useUpdatePublishStatus({
      origin: user,
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
    useUpdatePublishStatus({
      origin: user,
      publish: false
    })
    .then((_): void => {
      setPublishMode(false)
      setIsPublishActive(false)
      closeDisconnectAllModal()
    })
  }, [])
  
  const handlePause = useCallback(() => {
    useUpdatePublishStatus({
      origin: user,
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
      { postInstall
      ? <SetUpSection onFinish={() => setPostInstall(false)} />
      : <Page
          title="Store Product Sync"
          fullWidth={true}>
          <div className="grid grid-cols-1 gap-10 mb-20">
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
                        content: 'Disable',
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
                              displayStatus: isPublishPaused ? "paused" : "active",
                              tooltip: isPublishPaused ? "Publishing is currently paused" : "There is an active subscription",
                              statusStyle: isPublishPaused ? "info" : "success",
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
                  actionHandler: (e) => {
                    setShowCalloutCardModal(false)
                  },
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
                
              <ModalWithForm
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
                    actionHandler: () => setShowAddToListModal(false),
                  },
                ]}
                inputAction={{
                  id: "modalInput",
                  label: "Store Link",
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
                }}
                onFormSubmit={{
                  actionHandler: (store: {
                    url: string,
                    id: string,
                  }) => {
                    const {
                      url,
                      id,
                    } = store
                
                    const storeID = id
                    
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
                    }) => {
                      if(code) {
                        setErrorMessage(errorCodeToMessage(code))
                        setHasError(true)
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
                }} />

            </Section>
          </div>
        </Page>}
    </Frame>
  )
}

export default App
