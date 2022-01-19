import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react'
import { AppProvider } from '@shopify/polaris'
import enTranslations from '@shopify/polaris/locales/en.json';
import React from 'react'
import ReactDOM from 'react-dom'
import { SWRConfig } from 'swr'
import App from './App'
import '@shopify/polaris/build/esm/styles.css';
import './styles/tailwind.css'

const params = new URLSearchParams(window.location.search)

const SHOP_ORIGIN = params.get('shop');
const API_KEY = params.get('apiKey') || 'a9e11c2e82400ef003f1966dadc6332e';
const HOST = params.get('host') || window.btoa(SHOP_ORIGIN + '/admin');

const swrConfig = {
  fetcher: (resource: any, init: any) =>
    fetch(resource, init).then((res) => res.json()),
}

const config = {
  apiKey: API_KEY,
  host: HOST,
}

ReactDOM.render(
  <React.StrictMode>
    <SWRConfig value={swrConfig}>
      {/* <AppBridgeProvider config={config}> */}
        <AppProvider i18n={enTranslations}>
          <App shopOrigin={SHOP_ORIGIN} />
        </AppProvider>
      {/* </AppBridgeProvider> */}
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById('root')
)
