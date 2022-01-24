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
import React, { useCallback, useEffect, useState } from 'react';
import useAsyncState from '../hooks/useAsyncState';

declare type Type = 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | 'date' | 'datetime-local' | 'month' | 'time' | 'week' | 'currency';

type TLocation = {
  name: string,
  id: string
}

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
    required?: boolean
  }
  primaryAction: {
    actionText: string, 
    actionHandler: (input: {
      url: string,
      id: string,
    }) => void,
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
}

interface IModalWithForm extends IModal {
  locations: TLocation[]
}

const Modal: React.FC<IModalWithForm> = ({
  title,
  content,
  isModalOpen,
  modalHandler,
  inputAction,
  primaryAction,
  secondaryActions,
  toast,
  locations
}) => {

  const [locationList] = useState<TLocation[]>(locations)
  const [input, setInput] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useAsyncState(false)
  const [selected, setSelected] = useState(locationList[0].id)

  const toggleShowToast = useCallback(() => setShowToast(false), []);
  const handleChange = useCallback(() => modalHandler(!isModalOpen), [isModalOpen, modalHandler]);
  const handleSelectChange = useCallback((value) => { setSelected(value) }, []);
  const handleSubmit = () => {
    const hasError = errorHandler(input)
    console.log(hasError)
    setError(hasError)
    if (!hasError) {
      primaryAction.actionHandler({url: input, id: selected}) 
      setInput('')
      handleChange()
      setShowToast(true)
      setError(false)
    }
  }

  const {
    id,
    label,
    placeholder,
    type = 'text',
    errorMessage,
    errorHandler,
    required = false,
  } = inputAction

  const toastMarkup = toast
    ? (<Toast 
        error={toast.error}
        content={toast.content} 
        onDismiss={toggleShowToast} 
        duration={toast.duration}/>) 
    : null

  const modalActions = {}

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

  const options = [
    ...locationList.map(location => {
      return {
        label: location.name,
        value: location.id
      }
    })
  ]

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
          disabled: !input
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
                      id={id}
                      label={label}
                      value={input}
                      onChange={(e) => {
                        setError(false)
                        setInput(e)
                      }}
                      autoComplete="off"
                      placeholder={placeholder}
                      type={type}
                      error={error}
                      requiredIndicator={required}
                      />

                    { error && 
                      <div className='mt-4'>
                        <InlineError message={errorMessage} fieldID={id} />
                      </div> 
                    }

                    <Select 
                      label="Store Location" 
                      options={options}
                      onChange={handleSelectChange} 
                      value={selected}
                      />

                  </FormLayout>
                </Form>

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