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
import ModalWithSelect from './components/ModalWithSelect';
import StorePublishingCard from './components/StorePublishingCard';
import { usePublisher } from './hooks/usePublisher';
import { useSubscriber } from './hooks/useSubscriber';
import ModalWithForm from './components/ModalWithForm';
import PublishSection from './components/PublishSection';


type TLocation = {
  name: string,
  id: string
}

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
  const [locations, setLocations] = useState<TLocation[]>([])

  const renderCount = useRef(true)

  const {
    useDisplayPublisher,
    useUpdatePublishStatus,
    useUpdateSubscriber,
    useRemoveSubscriber,
  } = usePublisher();

  const {
    useRetrieveLocation,
    useUpdateSubscription,
    useRemoveSubscription,
  } = useSubscriber();

  const {
    data,
    isLoading,
    isError
  } = useDisplayPublisher({ origin: user })

  const locationData = useRetrieveLocation({ origin: user })

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

      if(renderCount.current) {
        setIsPublishActive(data.publish)
        renderCount.current = false;
      }
    }
  }, [data, isLoading, user, ])

  useEffect(() => {
    if(!locationData.isError && !locationData.isLoading) {
      setLocations([...locationData.data])
    }
  }, [locationData.data, locationData.isLoading])


  useEffect(() => {}, [locations])

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

  const onItemIsLoading = useCallback((list: TSubscription['subscription'][]) => {
      const hasData = list
        .every((item) => isItemLoading(item))
        setItemIsLoading(!hasData)
    },
    [publishedTo, subscribedTo],
  )

  useEffect(() => {
    onItemIsLoading(publishedTo)
    onItemIsLoading(subscribedTo)
  }, [publishedTo, subscribedTo, itemIsLoading, onItemIsLoading])

  const isItemLoading = (item: {
    storeURL: string,
    id: string,
    status: string,
  }): boolean => {
    return !(item.id && item.status && item.storeURL)
  }

  const addToSubscribedToListHandler = (store: {
    url: string,
    id: string,
  }) => {

    const {
      url,
      id,
    } = store

    useUpdateSubscription({
      origin: user,
      shop: url,
      id: id,
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
    .then((): void => {
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
      .then((): void => {
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
      .then((): void => {
        const newList = publishedTo.filter((item) => item.storeURL !== store.storeURL);
        setPublishedTo(newList);
      })
    }
  }

  const onSubscribeDisconnect = (store: TSubscription['subscription']) => {
    useRemoveSubscription({
      origin: user,
      shop: store.storeURL
    })
    .then(() => {
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

  const openAddToListModal = (): void => setShowAddToListModal(true)
  const closeAddToListModal = (): void => setShowAddToListModal(false)

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
    .then((): void => {
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
    .then((): void => {
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
            <PublishSection 
              user={user}
              hasError={hasError}
              errorMessage={errorMessage}
              publishedTo={publishedTo}
              isPublishActive={isPublishActive}
              isPublishPaused={isPublishPaused}

              handlePause={handlePause}
              handlePublish={handlePublish}
              toggleHasError={toggleHasError}
              onPublishConnect={onPublishConnect}
              onPublishDisconnect={onPublishConnect}

              showCalloutCardModal={showCalloutCardModal}
              openCalloutCardModal={openCalloutCardModal}
              closeCalloutCardModal={closeCalloutCardModal}
              setShowCalloutCardModal={setShowCalloutCardModal}

              showDisconnectAllModal={showDisconnectAllModal}
              openDisconnectAllModal={openDisconnectAllModal}
              closeDisconnectAllModal={closeDisconnectAllModal}
              handleDisconnectAllModal={handleDisconnectAllModal}
              setShowDisconnectAllModal={setShowDisconnectAllModal}

              showDeactivatePublishModal={showDeactivatePublishModal}
              openDeactivatePublishModal={openDeactivatePublishModal}
              closeDeactivatePublishModal={closeDeactivatePublishModal}
              handleDeactivatePublishModal={handleDisconnectAllModal}
              setShowDeactivatePublishModal={setShowDeactivatePublishModal}
              />

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
                        const storeURLPattern = /(\w+-)*\w+(.myshopify.com)/
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
                          const storeURLPattern = /(\w+-)*\w+(.myshopify.com)/
                          if(!input) return true
                          return !storeURLPattern.test(input) 
                        },
                      }}
                      toast={{
                        content: "Request Sent",
                      }}/>
                }
            </Section>
          </div>
        </Page>}
    </Frame>
  )
}

export default App
