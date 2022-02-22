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

type TStatus = 'active' | 'pending' | 'stopped' | 'declined'

type TSubscription =  {
  storeURL: string,
  id: string,
  status: TStatus,
  updatedAt: string,
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

  const pubTestData = [
    {
      status: 'active' as TStatus,
      storeURL: 'limiteds.myshopify.com',
      id: '0000000',
      updatedAt: ''
    },
    {
      status: 'active' as TStatus,
      storeURL: 'bread.myshopify.com',
      id: '0000001',
      updatedAt: ''
    },
    {
      status: 'pending' as TStatus,
      storeURL: 'store.myshopify.com',
      id: '0000002',
      updatedAt: ''
    },
  ]

  //shop-domain = myshopify.com
  const [user] = useState(shopOrigin)
  const [postInstall, setPostInstall] = useState(installed)
  const [publishedTo, setPublishedTo] = useState<TSubscription[]>([]);
  const [subscribedTo, setSubscribedTo] = useState<TSubscription[]>([]);
  const [publishMode, setPublishMode] = useState(false)
  const [isPublishActive, setIsPublishActive] = useState(publishMode)
  const [showStopModal, setShowStopModal] = useState(false)
  const [showStopAllModal, setShowStopAllModal] = useState(false)
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
        updatedAt,
      }) => {
        return ({
          storeURL: shop,
          id: inventoryLocationId,
          status: status as TStatus,
          updatedAt: updatedAt,
        })
      }) || []
      setPublishedTo(publishedToData)

      const subscribedToData = data
      .subscribed?.map(({
        shop,
        inventoryLocationId,
        status,
        updatedAt
      }) => {
        return ({
          storeURL: shop,
          id: inventoryLocationId,
          status: status as TStatus,
          updatedAt: updatedAt
        })
      }) || []
      setSubscribedTo(subscribedToData) 
      setPublishMode(data.publish)

      if(renderCount.current) {
        setIsPublishActive(data.publish)
        renderCount.current = false;
      }
    }
  }, [data, isLoading, user])

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

  const onItemIsLoading = useCallback((list: TSubscription[]) => {
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
      updatedAt,
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
            updatedAt: updatedAt
          }
        ])
        return false
      } 
    })
  }

  const onPublishConnect = (store: TSubscription) => {
    useUpdateSubscriber({
      origin: user,
      shop: store.storeURL,
      accept: true,
    })
    .then((): void => {
      const newList = publishedTo.map((item) => item.storeURL === store.storeURL ? {...item, status: 'active' as TStatus} : item )
      setPublishedTo(newList);
    })
  }

  const onPublishDisconnect = (store: TSubscription): Promise<any> => {
    if (store.status === 'active') {
      return useRemoveSubscriber({
        origin: user, 
        shop: store.storeURL
      })
    }
    return useUpdateSubscriber({
      origin: user,
      shop: store.storeURL,
      accept: false,
    })
  }

  const onSubscribeDisconnect = (store: TSubscription) => {
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

  const openStopModal = (): void => setShowStopModal(true)
  const closeStopModal = (): void => setShowStopModal(false)

  const openStopAllModal = (): void => setShowStopAllModal(true)
  const closeStopAllModal = (): void => setShowStopAllModal(false)

  const openCalloutCardModal = (): void => setShowCalloutCardModal(true)
  const closeCalloutCardModal = (): void => setShowCalloutCardModal(false)

  const openAddToListModal = (): void => setShowAddToListModal(true)
  const closeAddToListModal = (): void => setShowAddToListModal(false)

  const handleStart = useCallback(() => {
    useUpdatePublishStatus({
      origin: user,
      publish: true,
    })
    .then(({publish}): void => {
      setIsPublishActive(publish)
    })
  }, [])

  const handleStop = useCallback(() => {
    useUpdatePublishStatus({
      origin: user,
      publish: false, 
    })
    .then(({publish}): void => {
      setIsPublishActive(publish)
    })
    .then(() => {
      closeStopModal()
    })
  }, [])

  const handleToggle = useCallback((state: boolean) => {
    if (state) handleStart()
    else handleStop()
  }, [])

  const handleStopAll = useCallback(() => {
    let list = publishedTo

    useUpdatePublishStatus({
      origin: user,
      publish: false,
    })
    .then(({publish}): void => {
      setIsPublishActive(publish)
    })
    .then(() => {
      publishedTo.forEach(store => {
        onPublishDisconnect(store)
          .then(() => {
            list = list.filter((item) => item.storeURL !== store.storeURL)
            setPublishedTo(list)
          })
      })
    })
    .then(() => {
      closeStopAllModal()
    })
  }, [])

  const handlePause = useCallback(() => {
    useUpdatePublishStatus({
      origin: user,
      publish: !isPublishActive,
    })
    .then(({publish}): void => {
      setIsPublishActive(publish)
    })
  }, [user, isPublishActive])

  //? ---------------------------------------------------------------------------------------------------------------

  return (
    <Frame>
      { postInstall
        ? <SetUpSection 
            appName={appName}
            onFinish={() => setPostInstall(false)} 
            actions={[
              {
                actionName: 'publishing',
                actionHandler: handleToggle,
              },
              {
                actionName: 'subscribing',
                actionHandler: addToSubscribedToListHandler,
                assets: locations
              },
            ]} />
        : <Page fullWidth={true}>
            <div className="grid grid-cols-1 gap-10 mb-20">
              <PublishSection
                user={user}
                hasError={hasError}
                errorMessage={errorMessage}
                publishedTo={publishedTo}
                isPublishActive={isPublishActive}

                handlePause={handlePause}
                handleStart={handleStart}
                handleStop={handleStop}
                handleStopAll={handleStopAll}
                toggleHasError={toggleHasError}
                onCopyToClipboard={onCopyToClipboard}
                onPublishConnect={onPublishConnect}
                onPublishDisconnect={onPublishDisconnect}

                showCalloutCardModal={showCalloutCardModal}
                openCalloutCardModal={openCalloutCardModal}
                closeCalloutCardModal={closeCalloutCardModal}
                setShowCalloutCardModal={setShowCalloutCardModal}

                showStopAllModal={showStopAllModal}
                openStopAllModal={openStopAllModal}
                closeStopAllModal={closeStopAllModal}
                setShowStopAllModal={setShowStopAllModal}

                showStopModal={showStopModal}
                openStopModal={openStopModal}
                closeStopModal={closeStopModal}
                setShowStopModal={setShowStopModal}
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
