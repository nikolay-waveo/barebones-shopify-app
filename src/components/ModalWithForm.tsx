import * as polaris from '@shopify/polaris';
import {
  Button,
  Form,
  FormLayout,
  InlineError,
  Select,
  Stack,
  TextContainer,
  TextField,
  Toast
} from '@shopify/polaris';
import React, { useCallback, useState } from 'react';
import useAsyncState from '../hooks/useAsyncState';

declare type Type = 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | 'date' | 'datetime-local' | 'month' | 'time' | 'week' | 'currency';

interface IModal {
  title: string,
  content: React.ReactNode | string,
  isModalOpen: boolean,
  modalHandler: React.Dispatch<React.SetStateAction<boolean>>,
  inputAction?: {
    id: string,
    label: string,
    placeholder: string,
    type?: Type,
    errorMessage?: string,
    errorHandler?: (input: string) => boolean,
  }
  primaryAction: {
    actionText: string, 
    actionHandler: (input: string) => void,
    destructive?: boolean,
  }
  secondaryActions?: {
    actionText: string, 
    actionHandler: (input: string) => void,
    destructive?: boolean,
  }[],
  toast?: {
    content: string,
    duration?: number,
    error?: boolean,
  },
  onFormSubmit: {
    actionHandler: (input: {
      url: string,
      id: string,
    }) => void,
  }
}

const Modal: React.FC<IModal> = ({
  title,
  content,
  isModalOpen,
  modalHandler,
  inputAction,
  primaryAction,
  secondaryActions,
  toast,
  onFormSubmit,
}) => {

  const [input, setInput] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [hasError, setHasError] = useAsyncState(false)
  const [inputID, setInputID] = useState("")

  const toggleShowToast = useCallback(() => setShowToast(false), []);
  const handleChange = useCallback(() => modalHandler(!isModalOpen), [isModalOpen, modalHandler]);
  

  const handleSubmit = () => {
    if(onFormSubmit) {
      onFormSubmit.actionHandler({url: input, id: inputID})
      console.log({url: input, id: inputID})
      setInputID('')
    }
    else { 
      primaryAction.actionHandler(input) 
    }
    setInput('')
    handleChange()
    setShowToast(true)
    setHasError(false)
  }

  const toastMarkup = toast
    ? (<Toast 
        error={toast.error}
        content={toast.content} 
        onDismiss={toggleShowToast} 
        duration={toast.duration}/>) 
    : null

  const modalActions = {}

  if(secondaryActions) {
    modalActions['secondaryActions'] = [
      ...secondaryActions.map(({
        actionText,
        actionHandler,
        destructive,
      }) => ({
          content: actionText,
          onAction: actionHandler,
          destructive: destructive
      }))
    ]
  }

  const [shopifyStore, setShopifyStore] = useState('')
  const [stores, setStores] = useState(false)
  const [selected, setSelected] = useState('');
  const [options, setOptions] = useState([]);
  const handleSelectChange = useCallback((value) => setSelected(value), []);
  const storeExists = useCallback(() => {
    setStores(true)
    setOptions([
      {label: 'Today', value: 'today'},
      {label: 'Yesterday', value: 'yesterday'},
      {label: 'Last 7 days', value: 'lastWeek'},
    ])
    setSelected('today')
  }, [])
  
  const handleGETStore = useCallback(() => {
   fetch('https://305e299ce9f8da250470ba33677e3a79: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@dev-subscriber.myshopify.com/admin/api/2021-10/locations.json')
    .then(r => r.json())
    .then(data => console.log(data))
  }, []);

  return (
    <>
      <polaris.Modal
        open={isModalOpen}
        onClose={handleChange}
        title={title}
        primaryAction={{
          content: primaryAction.actionText,
          onAction: handleSubmit,
          destructive: primaryAction?.destructive,
          disabled: !!!selected,
        }}
        {...modalActions}>
          <polaris.Modal.Section>
            <Stack vertical>
              <Stack.Item>
                <TextContainer>
                { typeof content == "string"
                  ? <p>{content}</p>
                  : content }
                </TextContainer>
              </Stack.Item>
            { inputAction &&
              <Stack.Item fill>
                <Form onSubmit={handleSubmit}>
                  <FormLayout>
                    <TextField
                      label={inputAction.label}
                      value={shopifyStore}
                      onChange={(e) => setShopifyStore(e)}
                      autoComplete="off"
                      connectedRight={
                        <Button onClick={handleGETStore}>Get Store</Button>
                      }/>

                    <Select
                      label="Store Location"
                      options={options}
                      onChange={handleSelectChange}
                      onFocus={() => handleSelectChange(selected)}
                      value={selected}
                      disabled={!stores}
                      />
                  </FormLayout>
                </Form>
                
                  { hasError &&
                    <div className='mt-4'>
                      <InlineError message={inputAction.errorMessage} fieldID={inputAction.id} />
                    </div>
                  }
              </Stack.Item>
            }
            </Stack>
          </polaris.Modal.Section>

      </polaris.Modal>
      {showToast && toastMarkup}
    </>
  )
}

export default Modal
