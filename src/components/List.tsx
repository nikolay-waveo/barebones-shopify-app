import { ResourceList, ResourceItem, EmptySearchResult, Heading, TextContainer, Button, Card } from '@shopify/polaris'
import React from 'react'

type TSubscription = {
  subscription: {
    storeURL: string,
    id: string,
    status: string,
  },
}

interface IList {
  list: TSubscription['subscription'][],
  listSortingFn?: (item: TSubscription['subscription']) => number,
  listText: {
    title: string | React.ReactNode,
    description?: string,
  },
  emptyListText: {
    title: string,
    description?: string,
  },
  renderItem: (
    item: TSubscription['subscription'],
    id: string,
    index: number,
  ) => React.ReactNode,
  primaryAction?: {
    content: string,
    onAction: () => void,
  },
}

const List: React.FC<IList> = ({
  list,
  listSortingFn,
  listText,
  emptyListText,
  renderItem,
  primaryAction,
}) => {

  const resourceName = {
    singular: 'Subscription',
    plural: 'Subscriptions',
  };

  const sortedList = listSortingFn 
    ? list.sort(listSortingFn)
    : list.sort()

  const emptyStateMarkup = (
    <EmptySearchResult
      title={emptyListText.title}
      description={emptyListText.description}
      withIllustration />
  );

  return (
    <Card>
      <Card.Section>
        <div className='grid sm:grid-flow-col auto-cols-auto gap-8'>
          <div className='row-start-3 sm:col-start-2 sm:row-span-2 sm:self-center sm:justify-self-end'>
            { primaryAction && 
              <Button primary onClick={primaryAction.onAction}>
                {primaryAction.content}
              </Button> }
          </div>
          <Heading>{listText.title}</Heading>
          <TextContainer>
            <p>{listText.description}</p>
          </TextContainer>
        </div>
      </Card.Section>

      <Card.Section>
        <ResourceList 
          resourceName={resourceName}
          items={sortedList} 
          emptyState={emptyStateMarkup}
          renderItem={renderItem} />
      </Card.Section>
    </Card>
  )
}

export default List
