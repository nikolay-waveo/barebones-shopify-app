import * as polaris from '@shopify/polaris';
import {
  Stack,
  TextContainer,
  Toast
} from '@shopify/polaris';
import { FC, useCallback, useState } from 'react';
import useAsyncState from '../hooks/useAsyncState';
import Form from './Form';

declare type Type = 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | 'date' | 'datetime-local' | 'month' | 'time' | 'week' | 'currency';

type TSelection = {
  label: string,
  value: string
}

interface IFormModal {
  form?: {
    primary: {
      id: string,
      label: string,
      placeholder: string,
      type?: Type,
      required?: boolean,
      error?: {
        content: string,
        onError?: (input: string) => boolean,
      }
    },
    secondary: {
      id: string,
      label: string,
      placeholder: string,
      type?: Type,
      required?: boolean,
      selection?: TSelection[]
    }
    submit: (input: any) => Promise<any>,
  }
}

interface IModal extends IFormModal {
  title: string,
  content: React.ReactNode | string,
  isModalOpen: boolean,
  modalHandler: React.Dispatch<React.SetStateAction<boolean>>,
  primaryAction: {
    content: string, 
    onAction: () => void,
    destructive?: boolean,
  }
  secondaryActions?: {
    content: string, 
    onAction: () => void,
    destructive?: boolean,
  }[],
  toast?: {
    content: string,
    duration?: number,
    error?: boolean,
  },
}

const Modal: FC<IModal> = ({
  title,
  content,
  isModalOpen,
  modalHandler,
  form,
  primaryAction,
  secondaryActions,
  toast: toastObject,
}) => {
  const isSelectionEmpty = !form?.secondary.selection?.length
  const secondaryInit = isSelectionEmpty ? '' : form.secondary.selection[0].value
  const selectionInit = isSelectionEmpty ? [] : form.secondary.selection

  const [toast, setToast] = useState(false)
  const [error, setError] = useAsyncState(false)
  const [hasError, setHasError] = useAsyncState(false)

  const [primary, setPrimary] = useState('')
  const [secondary, setSecondary] = useState(secondaryInit)
  const [selection] = useState<TSelection[]>(selectionInit)

  const handleToast = useCallback(() => setToast(false), []);
  const handleSelect = useCallback((value) => { setSecondary(value) }, []);
  const handleChange = useCallback(() => modalHandler(!isModalOpen), [isModalOpen, modalHandler]);

  const onSubmit = () => {
    const isError = form.primary.error
      ? form.primary.error.onError(primary)
      : false
    const data = {
      url: primary, 
      id: secondary
    }

    if(isError) {
      setError(isError)
      return
    }

    form.submit(data)
      .then(err => {
        if(err) {
          setHasError(err)
          return
        }

        setPrimary('')
        handleChange()
        setToast(true)
        setError(false)
        setHasError(false)
      })
  }

  const onPrimaryAction = () => {
    primaryAction.onAction()
    setToast(true)
  }

  const toastMarkup = toast
    ? (<Toast 
        error={toastObject.error}
        content={toastObject.content}
        duration={toastObject.duration}
        onDismiss={handleToast} />) 
    : null

  return (
    <>
      <polaris.Modal
        open={isModalOpen}
        onClose={handleChange}
        title={title}
        primaryAction={{
          ...primaryAction,
          onAction: form ? onSubmit : onPrimaryAction ,
          disabled: form && !primary
        }}
        secondaryActions={[...secondaryActions]}>
          <polaris.Modal.Section>
            <Stack vertical>
              <Stack.Item>
                <TextContainer>
                  { typeof content == "string"
                    ? <p>{content}</p>
                    : content 
                  }
                </TextContainer>
              </Stack.Item>
            { form &&
              <Stack.Item fill>
                <Form
                  select={!!form.secondary.selection}
                  submit={onSubmit}
                  primary={{
                    id: form.primary.id, 
                    label: form.primary.label,
                    value: primary,
                    onChange: (e) => {
                      setPrimary(e)
                      setError(false)
                      setHasError(false)
                    },
                    placeholder: form.primary.placeholder,
                    type: form.primary.type,
                    errorMessage: form.primary?.error &&
                      (
                        hasError
                        ? "Store hasn't enabled publishing. Please contact the merchant to proceed"
                        : form.primary.error.content
                      ),
                    required: form.primary.required,
                  }}
                  secondary={{
                    id: form.secondary.id, 
                    label: form.secondary.label,
                    value: secondary,
                    onChange: handleSelect,
                    placeholder: form.secondary.placeholder,
                    options: selection,
                  }}
                  error={error || hasError}
                  />
              </Stack.Item> 
            }
            </Stack>
          </polaris.Modal.Section>

      </polaris.Modal>
      {toast && toastMarkup}
    </>
  )
};

export default Modal;
