import * as polaris from '@shopify/polaris';
import {
  Stack,
  TextContainer,
  Toast
} from '@shopify/polaris';
import React, { useCallback, useState } from 'react';
import useAsyncState from '../hooks/useAsyncState';
import Form from './Form';

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
    actionHandler: (input: {
      url: string,
      id: string,
    }) => Promise<boolean>,
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

const Modal: React.FC<IModal> = ({
  title,
  content,
  isModalOpen,
  modalHandler,
  inputAction,
  primaryAction,
  secondaryActions,
  toast,
}) => {

  const [input, setInput] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [error, setError] = useAsyncState(false)
  const [hasError, setHasError] = useAsyncState(false)
  const [inputID, setInputID] = useState("")

  const toggleShowToast = useCallback(() => setShowToast(false), []);
  const handleChange = useCallback(() => modalHandler(!isModalOpen), [isModalOpen, modalHandler]);
  const handleSubmit = () => {
    const isError = inputAction.errorHandler(input)
    setError(isError)
    if (!isError) {
      primaryAction.actionHandler({url: input, id: inputID})
        .then(err => {
          setHasError(err)
          if(!err) {
            setInput('')
            handleChange()
            setShowToast(true)
            setError(false)
          }
        })
    }
  }

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
          disabled: !input || !inputID
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
                <Form
                  submit={handleSubmit}
                  primary={{
                    id: inputAction.id, 
                    label: inputAction.label,
                    value: input,
                    onChange: (e) => {
                      setInput(e)
                      setError(false)
                    },
                    placeholder: 'Example: store.myshopify.com',
                    type: 'text',
                    errorMessage: hasError 
                      ? "Store hasn't enabled publishing. Please contact the merchant to proceed"
                      : 'Invalid input',
                    required: true,
                  }}
                  secondary={{
                    id: 'secondaryId', 
                    label: 'Store location',
                    value: inputID,
                    onChange: (e) => {setInputID(e)},
                    placeholder: 'Example: 1234567900',
                  }}
                  error={error || hasError}
                  />
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