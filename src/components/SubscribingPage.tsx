import { Toast } from '@shopify/polaris';
import { FC, useCallback, useState } from 'react';
import useAsyncState from '../hooks/useAsyncState';
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
  console.log(isLocationsEmpty)
  const initId = isLocationsEmpty ? '' : locations[0].id

  const [ primaryInput, setPrimaryInput ] = useState('')
  const [ secondaryInput, setSecondaryInput ] = useState(initId)
  const [ error, setError ] = useAsyncState(false)
  const [ hasError, setHasError ] = useAsyncState(false)
  const [ showToast, setShowToast ] = useState(false)

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

  const toggleShowToast = useCallback(() => setShowToast(false), []);

  const errorHandler = (input: string): boolean => {
    const storeURLPattern = /^(\w+-)*\w+(.myshopify.com)$/
    if(!input) return true
    return !storeURLPattern.test(input) 
  }

  const handleSubmit = () => {
    const isError = errorHandler(primaryInput)
    setError(isError)
    if (!isError) {
      action.actionHandler({url: primaryInput, id: secondaryInput})
        .then(err => {
          console.log(err)
          setHasError(err)
          if(!err) {
            setPrimaryInput('')
            setShowToast(true)
            setError(false)
          }
        })
    }
  }

  const toastMarkup = (<Toast 
    content="Subscribed"
    onDismiss={toggleShowToast} />) 

  
  return (
    <div className='flex flex-col space-y-10 text-emerald-800'>
      <p className='font-medium text-center'>
        Use a publishers link to subscribe to their store and start syncing with their products.
      </p>
      <div>
        <Form
          select={!isLocationsEmpty}
          submit={handleSubmit}
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
            errorMessage: hasError 
              ? "Store hasn't enabled publishing. Please contact the merchant to proceed"
              : 'Invalid input',
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
          error={error || hasError}
          />
          <p className='text-center mt-4'>
            You can always change this later in the subscribe section.
          </p>
        </div>
        {showToast && toastMarkup}
    </div>
  );
};

export default SubscribingPage;
