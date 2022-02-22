import * as polaris from '@shopify/polaris';
import {
  Stack,
  TextContainer,
  Toast
} from '@shopify/polaris';
import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react';
import Form from './Form';

declare type Type = 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | 'date' | 'datetime-local' | 'month' | 'time' | 'week' | 'currency';

type TOptions = {
  label: string,
  value: string
}

type TErrorMessage = {
  input: string,
  submit: string
}

type TTrimPatterns = {
  start?: RegExp,
  end?: RegExp,
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
        content: string | TErrorMessage,
        pattern: RegExp,
      },
      trim?: boolean | TTrimPatterns,
    },
    secondary: {
      id: string,
      label: string,
      placeholder: string,
      type?: Type,
      required?: boolean,
      options?: TOptions[]
    }
    submit: {
      onAction: (input: any) => Promise<any>,
      button?: {
        content?: string,
        fullWidth?: boolean,
        primary?: boolean,
      }
    },
  }
}

interface IModal extends IFormModal {
  title: string,
  content: React.ReactNode | string,
  isModalOpen: boolean,
  modalHandler: Dispatch<SetStateAction<boolean>>,
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
  toast: {
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
  const initAction = () => {
    console.log('test')
    primaryAction.onAction()
    setToast(true)
  }
  const [toast, setToast] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [submit, setSubmit] = useState(() => initAction)

  
  const handleToast = useCallback(() => setToast(false), []);
  const handleChange = useCallback(() => modalHandler(!isModalOpen), [isModalOpen, modalHandler]);

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
          onAction: submit,
          disabled: form && disabled
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
                  submit={form.submit}
                  primary={{
                    id: form.primary.id,
                    label: form.primary.label,
                    placeholder: form.primary.placeholder,
                    error: form.primary.error,
                    trim: form.primary.trim
                  }}
                  secondary={{
                    id: form.secondary.id,
                    label: form.secondary.label,
                    placeholder: form.secondary.placeholder,
                    options: form.secondary.options
                  }}
                  inModal={{
                    onDisabled: setDisabled,
                    onSubmit: setSubmit,
                    onToast: setToast,
                  }}
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
