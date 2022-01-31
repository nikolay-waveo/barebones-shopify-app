import * as polaris from '@shopify/polaris';
import { Button, FormLayout, InlineError, Select, TextField } from '@shopify/polaris';
import { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react';
import useAsyncState from '../hooks/useAsyncState';

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

interface IForm {
  submit: {
    onAction: (input: any) => Promise<any>
    button?: {
      content?: string,
      fullWidth?: boolean,
      primary?: boolean,
    }
  }
  primary: {
    id: string, 
    label: string,
    placeholder: string,
    type?: Type,
    required?: boolean,
    error?: {
      content: string | TErrorMessage,
      pattern: RegExp,
    }
    trim?: TTrimPatterns,
  }
  secondary: {
    id: string,
    label: string,
    placeholder: string,
    type?: Type,
    options?: TOptions[]
  }
  inModal?: {
    onDisabled: Dispatch<SetStateAction<boolean>>,
    onSubmit: Dispatch<SetStateAction<() => void>>
  }
}

const Form: FC<IForm> = ({
  submit,
  primary,
  secondary,
  inModal,
}) => {
  const isOptionsEmpty = !secondary.options?.length
  const secondaryInit = isOptionsEmpty ? '' : secondary.options[0].value
  const optionsInit = isOptionsEmpty ? [] : secondary.options
  const [options] = useState<TOptions[]>(optionsInit)

  const [inputError, setInputError] = useAsyncState(false)
  const [submitError, setSubmitError] = useAsyncState(false)
  const [primaryField, setPrimaryField] = useState('')
  const [secondaryField, setSecondaryField] = useState(secondaryInit)

  const [disabled, setDisabled] = useState(!!inModal?.onDisabled)

  useEffect(() => {
    setDisabled(!primaryField || !secondaryField)
    if(inModal) {
      inModal?.onDisabled(disabled)
      inModal?.onSubmit(() => onSubmit)
    }
  }, [primaryField, secondaryField])

  const handlePrimaryField = useCallback((value): void => {
    setPrimaryField(value)
    onResetErrors()
  }, []);
  const handleSecondaryField = useCallback((value): void => { setSecondaryField(value) }, []);

  const onResetFields = (): void => {
    setPrimaryField('')
    setSecondaryField(secondaryInit)
  }

  const onResetErrors = (): void => {
    setInputError(false)
    setSubmitError(false)
  }

  const onPatternMatch = (input: string, pattern: RegExp): boolean => {
    if(input) return pattern.test(input)
    return false
  }

  const onTrim = (input: string, trim?: TTrimPatterns): string => {
    let output = input.trim()
    if(trim?.start) output = output.replace(trim.start, '')
    if(trim?.end) output = output.replace(trim.end, '')
    return output
  }

  const onErrorMessage = (): string => {
    const errorMessage = primary.error.content

    if(typeof errorMessage == 'string') return errorMessage
    return inputError
      ? errorMessage.input
      : errorMessage.submit
  }

  const onSubmit = useCallback((): void => {
    const isError = primary.error
      ? !onPatternMatch(primaryField, primary.error.pattern)
      : false

    const formData = {
      url: onTrim(primaryField, primary.trim), 
      id: secondaryField,
    }

    if(isError) {
      setInputError(isError)
      return
    }

    submit.onAction(formData)
      .then(err => {

        if(err) {
          setSubmitError(err)
          return
        }
        onResetFields()
        onResetErrors()
      })
  }, [primaryField, secondaryField])

  return (
    <polaris.Form onSubmit={onSubmit}>
      <FormLayout>
        <TextField
          id={primary.id}
          label={primary.label}
          value={primaryField}
          onChange={handlePrimaryField}
          autoComplete="off"
          placeholder={primary.placeholder}
          type={primary.type || 'text'}
          error={inputError || submitError}
          requiredIndicator={primary.required}
          />

        { primary.error &&
          ( inputError || submitError ) &&
          <div className='mt-4'>
            <InlineError message={onErrorMessage()} fieldID={primary.id} />
          </div> 
        }

        { !isOptionsEmpty
          ? ( options.length > 1 && 
              <Select
                id={secondary.id}
                label={secondary.label}
                value={secondaryField}
                onChange={handleSecondaryField} 
                options={options}
              />
            )
          : <TextField
              id={secondary.id}
              label={secondary.label}
              value={secondaryField}
              type={secondary.type || 'text'}
              onChange={handleSecondaryField}
              placeholder={secondary.placeholder}
              autoComplete="off"
              />
        }
        
        { submit.button && 
          <Button 
            fullWidth={submit.button.fullWidth} 
            primary={submit.button.primary}
            disabled={disabled}
            submit>
              {submit.button.content}
          </Button>
        }
      </FormLayout>
    </polaris.Form>
  );
};

export default Form;
