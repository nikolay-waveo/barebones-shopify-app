import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react'
import { AppProvider } from '@shopify/polaris'
import enTranslations from '@shopify/polaris/locales/en.json';
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import '@shopify/polaris/build/esm/styles.css';
import './styles/tailwind.css'

const params = new URLSearchParams(window.location.search)

//* ?apiKey=a9e11c2e82400ef003f1966dadc6332e&shop=dev-subscriber.myshopify.com&host=ZGV2LXN1YnNjcmliZXIubXlzaG9waWZ5LmNvbS9hZG1pbg==&init=true

const SHOP_ORIGIN = params.get('shop')
const API_KEY = params.get('apiKey')
const HOST = params.get('host')
const POST_INSTALL = params.get('init') === 'true' ? true : false

// const swrConfig = {
//   fetcher: (resource: any, init: any) =>
//     fetch(resource, init).then((res) => res.json()),
// }

const config = {
  apiKey: API_KEY,
  host: HOST,
}

ReactDOM.render(
  <React.StrictMode>
    <AppBridgeProvider config={config}>
      <AppProvider i18n={enTranslations}>
        <App shopOrigin={SHOP_ORIGIN} installed={POST_INSTALL}/>
      </AppProvider>
    </AppBridgeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
