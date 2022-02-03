import { Button } from '@shopify/polaris';
import { FC, useState } from 'react';

type TPubAction = {
  actionHandler: (e?: any) => void,
}

interface IPublishingPage {
  action: TPubAction
}

const PublishingPage: FC<IPublishingPage> = ({
  action
}) => {
  const [ publishing, setPublishing ] = useState(false)

  const {
    actionHandler
  } = action

  return (
    <div className='flex flex-col space-y-10 text-emerald-800'>
      <p className='font-medium text-center'>
        Allow others to find and subscribe to your store by enabling <span className='text-amber-600'>Publishing</span>.
      </p>
      <div>
        <Button 
          fullWidth
          primary={!publishing}
          destructive={publishing}
          onClick={() => {
            actionHandler(!publishing)
            setPublishing(!publishing)
          }} >
            { !publishing
              ? 'Enable Publishing'
              : 'Disable Publishing'
            } 
        </Button>
        <p className='text-center mt-4'>
          You can always change this later.
        </p>
      </div>
    </div>
  );
};

export default PublishingPage;
