import * as Polaris from '@shopify/polaris';
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
import ModalWithForm from './components/ModalWithForm';
import StorePublishingCard from './components/StorePublishingCard';
import { usePublish } from './hooks/usePublish';
import { useSettings } from './hooks/useSettings';
import { useSubscribe } from './hooks/useSubscribe';
import SetUpInstructions from './components/SetUpInstructions';

type TSubscription = {
  subscription: {
    storeURL: string,
    id: string,
    status: string,
  },
}

interface IAppProps {
  shopOrigin: string,
}

const App: FC<IAppProps> = ({
  shopOrigin,
}) => {

  const [user] = useState(shopOrigin)
  const [postInstall, setPostInstall] = useState(true)
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

  // const {data, isLoading} = getSettings(user)

  // useEffect(() => {
  //   // GET incoming and outgoing subscriptions
  //   if(!isLoading) {
  //     const publishedToData = data
  //     .published?.map(({
  //       shop,
  //       inventoryLocationId,
  //       status,
  //     }) => {
  //       return ({
  //         storeURL: shop,
  //         id: inventoryLocationId,
  //         status: status,
  //       })
  //     }) || []
  //     setPublishedTo(publishedToData)

  //     const subscribedToData = data
  //     .subscribed?.map(({
  //       shop,
  //       inventoryLocationId,
  //       status,
  //     }) => {
  //       return ({
  //         storeURL: shop,
  //         id: inventoryLocationId,
  //         status: status,
  //       })
  //     }) || []
  //     setSubscribedTo(subscribedToData) 
  //     setPublishMode(data.publish)

  //     if(renderCount.current <= 0) {
  //       setIsPublishActive(data.publish)
  //       renderCount.current = renderCount.current + 1;
  //     }
  //   }
  // }, [data, isLoading, user])

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
      console.log('rrrr', code)
      if(code) {
        console.log('test')
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
      { !postInstall
      ? <SetUpInstructions 
          onFinish={() => setPostInstall(false)}
          pages={
            [
              {
                img: {
                  src: 'https://via.placeholder.com/720x250.png',
                  alt: 'App introduction image',
                },
                title: (
                  <div className='flex flex-col items-center space-y-10'>
                    <h2 className='text-6xl font-bold text-emerald-700 text-center'>
                      Welcome to the Perkd Product Sync App
                    </h2>
                    <h3 className='text-2xl font-medium text-emerald-800 text-center'>
                      Set-up shop once, sell anywhere
                    </h3>
                  </div>
                ),
                content: (
                  <div className='flex flex-col space-y-10 text-emerald-800'>
                    <p className='font-medium'>
                      Let us help you get to know the app so that you can start subscribing to 
                      the stores you want and publishing to those that want you!
                    </p>
                    <p className='font-medium'>
                      So, what are we waiting for?
                    </p>
                  </div>
                ),
                nextLabel: 'Let\'s get started',
              },
              {
                img: {
                  src: 'https://via.placeholder.com/720x250.png',
                  alt: 'App introduction image',
                },
                title: (
                  <div className='flex flex-col items-center space-y-10'>
                    <h2 className='text-3xl font-semibold text-amber-600 text-center'>
                      Publishing your store
                    </h2>
                  </div>
                ),
                content: (
                  <div className='flex flex-col space-y-10 text-emerald-800'>
                    <p className='font-medium'>
                      Allow others to find and subscribe to your store by enabling the <span className='text-amber-600'>Publishing</span> setting. 
                      This setting can be disabled at any time if you no longer want to publish your store. 
                    </p>
                    <Polaris.List type='number'>
                      <Polaris.List.Item>
                        Navigate to the <span className='font-semibold'>Publish</span> section of the app.
                      </Polaris.List.Item>
                      <Polaris.List.Item>
                        Go to the <span className='font-semibold'>Store Publishing</span> card.
                      </Polaris.List.Item>
                      <Polaris.List.Item>
                        Click on the <span className='font-semibold'>Options</span> button.
                      </Polaris.List.Item>
                      <Polaris.List.Item>
                        Click on <span className='font-semibold'>Activate</span>.
                      </Polaris.List.Item>
                    </Polaris.List>
                  </div>
                ),
                nextLabel: 'Continue',
                jump: {
                  page: 4,
                  label: 'Skip to subscribing'
                }
              },
              {
                img: {
                  src: 'https://via.placeholder.com/720x250.png',
                  alt: 'App introduction image',
                },
                title: 'Test 3',
                content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat, magni!',
                nextLabel: 'Continue'
              },
              {
                img: {
                  src: 'https://via.placeholder.com/720x250.png',
                  alt: 'App introduction image',
                },
                title: 'Test 4',
                content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat, magni! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Repellat, magni!',
                exitLabel: 'Finish'
              },
            ]} />
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
                            isLoading: false, //!isLoading,
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
