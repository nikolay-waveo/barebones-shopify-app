import { Toast } from '@shopify/polaris';
import { FC, useCallback, useState } from 'react';
import Form from './Form';

type TSubAction = {
  actionHandler: (e?: any) => Promise<boolean>,
}

type TLocation = {
  name: string,
  id: string
}

interface ISubscribingPage {
  action: TSubAction,
  locations: TLocation[]
}

const SubscribingPage: FC<ISubscribingPage> = ({
  action,
  locations = []
}) => {
  const isLocationsEmpty = !(locations.length)
  const options = isLocationsEmpty
  ? []
  : [
      ...locations.map(location => {
        return {
          label: location.name,
          value: location.id
        }
      })
    ]

  return (
    <div className='flex flex-col space-y-10 text-emerald-800'>
      <p className='font-medium text-center'>
        Use a publishers link to subscribe to their store and start syncing with their products.
      </p>
      <div>
        <Form
          submit={{
            onAction: action.actionHandler,
            button: {
              content: 'Subscribe',
              primary: true,
              fullWidth: true,
            }
          }} 
          primary={{
            id: 'primary',
            label: 'Link',
            placeholder: 'Example: store.myshopify.com',
            type: 'text',
            error: {
              content: {
                input: 'Invalid input',
                submit: 'Store hasn\'t enabled publishing. Please contact the merchant to proceed'
              },
              pattern: /^((https?:|)\/\/)*(\w+-)*\w+(.myshopify.com)\/*$/
            }
          }}
          secondary={{
            id: 'secondary',
            label: 'Location',
            placeholder: 'Example: 12345678900',
            options: options
          }} />
          <p className='text-center mt-4'>
            You can always manage this later.
          </p>
        </div>
    </div>
  );
};

export default SubscribingPage;
