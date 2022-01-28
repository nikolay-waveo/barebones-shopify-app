import * as polaris from '@shopify/polaris';
import { Button, FormLayout, InlineError, Select, TextField } from '@shopify/polaris';
import { FC } from 'react';

declare type Type = 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | 'date' | 'datetime-local' | 'month' | 'time' | 'week' | 'currency';

interface IForm {
  select?: boolean,
  submit: () => void,
  submitButton?: {
    content: string,
    fullWidth?: boolean,
    primary?: boolean,
  }
  primary: {
    id: string, 
    label: string,
    value: string,
    onChange: (e?: any) => void,
    placeholder: string,
    type?: Type,
    errorMessage: string,
    required?: boolean,
  }
  secondary: {
    id: string,
    label: string,
    value: string,
    onChange: (e?: any) => void,
    placeholder: string,
    type?: Type,
    options?: {
      label: string;
      value: string;
    }[]
  }
  error: boolean,
}

const Form: FC<IForm> = ({
  select, 
  submit,
  submitButton,
  primary,
  secondary,
  error,
}) => {
  return (
    <polaris.Form onSubmit={submit}>
      <FormLayout>
        <TextField
          id={primary.id}
          label={primary.label}
          value={primary.value}
          onChange={primary.onChange}
          autoComplete="off"
          placeholder={primary.placeholder}
          type={primary.type || 'text'}
          error={error}
          requiredIndicator={primary.required}
          />

        { error && 
          <div className='mt-4'>
            <InlineError message={primary.errorMessage} fieldID={primary.id} />
          </div> 
        }

        { select 
          ? <Select
              id={secondary.id}
              label={secondary.label}
              value={secondary.value}
              onChange={secondary.onChange} 
              options={secondary.options || []}

              />
          : <TextField
              id={secondary.id}
              label={secondary.label}
              value={secondary.value}
              type={secondary.type || 'text'}
              onChange={secondary.onChange}
              placeholder={secondary.placeholder}
              autoComplete="off"
              />
        }
        
        { submitButton && 
          <Button 
            fullWidth={submitButton.fullWidth} 
            primary={submitButton.primary} 
            submit>
              {submitButton.content}
          </Button>
        }
      </FormLayout>
    </polaris.Form>
  );
};

export default Form;
