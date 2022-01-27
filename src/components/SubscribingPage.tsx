import { FC, useState } from 'react';
import Form from './Form';

type TAction = {
  actionHandler: (e?: any) => void,
}

type TLocation = {
  name: string,
  id: string
}

interface ISubscribingPage {
  action: TAction,
  locations: TLocation[]
}

const SubscribingPage: FC<ISubscribingPage> = ({
  action,
  locations
}) => {

  const [ primaryInput, setPrimaryInput ] = useState('')
  const [ secondaryInput, setSecondaryInput ] = useState('')

  const options = [
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
          select
          submit={action.actionHandler}
          submitButton={{
            content: 'Subscribe',
            primary: true,
            fullWidth: true,
          }}
          primary={{
            id: 'primary',
            label: 'Link',
            value: primaryInput,
            onChange: (e) => {
              setPrimaryInput(e)
            },
            placeholder: 'Example: store.myshopify.com',
            type: 'text',
            errorMessage: '',
            required: true,
          }}
          secondary={{
            id: 'secondary',
            label: 'Location',
            value: secondaryInput,
            onChange: (e) => {
              setSecondaryInput(e)
            },
            placeholder: 'Example: 12345678900',
            options: options
          }}
          error={false}
          />
          <p className='text-center mt-4'>
            You can always change this later in the subscribe section.
          </p>
        </div>
    </div>
  );
};

export default SubscribingPage;
