import { Provider, TitleBar } from '@shopify/app-bridge-react';
import { FC } from 'react';

const App: FC = () => {

  const querySearch = (query: string, string: string) => {
    const queryArray = query.split("&");
    const [_, res] = queryArray
      ?.map(item => item.split("="))
      .find(item => item[0] === string ) || ['', '']

    // Return in Base64 for decodeConfig() in Provider component to work
    // https://github.com/Shopify/shopify-app-bridge/issues/48#issuecomment-840665716
    return btoa(res + '/admin')
  }

  const API_KEY = 'c134a5893790b1df33fc2206d8416eab';
  const HOST = querySearch(window.location.search, "shop");

  const config = {
    apiKey: `${API_KEY}`,
    host: `${HOST}`,
  }

  return (
    <Provider config={config}>
      <TitleBar 
        title='Hello World!'
      />
    </Provider>
  )
}

export default App
