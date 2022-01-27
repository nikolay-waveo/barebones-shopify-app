import { Frame, Page } from '@shopify/polaris';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import SetUpSection from './components/SetUpSection';
import PublishSection from './components/PublishSection';
import SubscribeSection from './components/SubscribeSection';
import { usePublisher } from './hooks/usePublisher';
import { useSubscriber } from './hooks/useSubscriber';

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

  const appName = 'Products Pub/Sub'

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
    if(locationData.isError || locationData.isLoading || locationData.data['message']) return 
    setLocations([...locationData.data])
  }, [locationData.data, locationData.isLoading])


  useEffect(() => {}, [locations])

  const toggleHasError = useCallback(() => setHasError((hasError) => !hasError),[])


  const errorCodeToMessage = (code: string): string => {
    switch(code) {
      case "not_publishing":      return "Store not publishing"
      case "cyclic_dependency":   return "Cannot subscribe to self"
      case "shop_required":       return "'shop' required"
      case "locationId_required": return "'inventoryLocationId' required"
      case "enabled_is_boolean":  return "'enabled' must be boolean"
      case "not_subscribed":      return "Not subscribed"
      case "accept_is_boolean":   return "'accept' must be boolean"
      case "stop_is_boolean":     return "'stop' must be boolean"
      case "publish_is_boolean":  return "'publish' must be boolean"
      case "already_declined":    return "Already declined"
      case "indirect_subscribed": return "Indirect subscribed"
      default:                    return "Unexpected Error"
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

    return useUpdateSubscription({
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
        return true
      } else {
        setSubscribedTo([
          ...subscribedTo,
          {
            storeURL: shop,
            id: inventoryLocationId,
            status: status,
          }
        ])
        return false
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

  const onCopyToClipboard = (id: string): void => {
    const range = document.createRange();
    range.selectNode(document.getElementById(id));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
  }
 
  //* ---------------------------------------------------------------------------------------------------------------
  // Toggle

  const openDeactivatePublishModal = (): void => setShowDeactivatePublishModal(true)
  const closeDeactivatePublishModal = (): void => setShowDeactivatePublishModal(false)

  const openDisconnectAllModal = (): void => setShowDisconnectAllModal(true)
  const closeDisconnectAllModal = (): void => setShowDisconnectAllModal(false)

  const openCalloutCardModal = (): void => setShowCalloutCardModal(true)
  const closeCalloutCardModal = (): void => setShowCalloutCardModal(false)    

  const openAddToListModal = (): void => setShowAddToListModal(true)
  const closeAddToListModal = (): void => setShowAddToListModal(false)
  
  // useEffect(() => {
  //   setPublishMode(publishMode)
  // }, [publishMode])

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

  //? ---------------------------------------------------------------------------------------------------------------

  //! swap out publishMode

  const __handleActivate = useCallback(() => {
    useUpdatePublishStatus({
      origin: user,
      publish: true,
      // pause: false,
    })
    .then(({publish, pause}): void => {
        setIsPublishActive(publish)
        setIsPublishPaused(pause || !publish)
      })
      .then(() => console.log('pub'))
  }, [])

  const __handleDeactivate = useCallback(() => {
    useUpdatePublishStatus({
      origin: user,
      publish: false, 
      // pause: false
    })
    .then(({publish, pause}): void => {
      setIsPublishActive(publish)
      setIsPublishPaused(pause)
    })
    .then(() => {
      closeDeactivatePublishModal()
    })
  }, [])

  const __handleDisconnectAll = useCallback(() => {
    publishedTo.forEach(store => onPublishDisconnect(store))
    useUpdatePublishStatus({
      origin: user,
      publish: false,
      // pause: false,
    })
    .then(({publish, pause}): void => {
      setIsPublishActive(publish)
      setIsPublishPaused(pause)
    })
    .then(() => {
      closeDisconnectAllModal()
    })
  }, [])

  const __handlePause = useCallback(() => {
    useUpdatePublishStatus({
      origin: user,
      publish: isPublishPaused,
      // pause, !isPublishPaused,
    })
    .then(({publish, pause}): void => {
      setIsPublishActive(publish)
      setIsPublishPaused(pause)
    })
  }, [user, isPublishPaused])

  //? ---------------------------------------------------------------------------------------------------------------

  const a = () => console.log('clicker click')

  return (
    <Frame>
      { postInstall
        ? <SetUpSection 
            appName={appName}
            onFinish={() => setPostInstall(false)} 
            actions={[
              {
                actionName: 'publishing',
                actionHandler: __handleActivate,
              },
              {
                actionName: 'subscribing',
                actionHandler: a,
                state: true,
              },
            ]} />
        : <Page
            title={appName}
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
                onCopyToClipboard={onCopyToClipboard}
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
                handleDeactivatePublishModal={handleDeactivatePublishModal}
                setShowDeactivatePublishModal={setShowDeactivatePublishModal}
                />

              <SubscribeSection
                subscribedTo={subscribedTo}
                locations={locations}
              
                onSubscribeDisconnect={onSubscribeDisconnect}
                addToSubscribedToListHandler={addToSubscribedToListHandler}
              
                showAddToListModal={showAddToListModal}
                openAddToListModal={openAddToListModal}
                closeAddToListModal={closeAddToListModal}
                setShowAddToListModal={setShowAddToListModal}
                />
            </div>
          </Page>
        }
    </Frame>
  )
}

export default App
