import { Provider as AppBridgeProvider } from '@shopify/app-bridge-react'
import { AppProvider } from '@shopify/polaris'
import enTranslations from '@shopify/polaris/locales/en.json';
import React from 'react'
import ReactDOM from 'react-dom'
import { SWRConfig } from 'swr'
import App from './App'
import '@shopify/polaris/build/esm/styles.css';
import './styles/tailwind.css'

// Pull apiKey from path shopify:domain/admin/apps/[apiKey]
const apiKeyGet = () => {
  const currentURL = window.location.href;
  const pathnameTrim = currentURL.split('apps/').pop();
  const apiTrim = pathnameTrim.split('/').shift();
  return apiTrim;
}

// Pull query and parse params
const querySearch = (string: string) => {
  const query = window.location.search;
  const queryTrim = query.split("?").pop();
  const queryArray = queryTrim.split("&");
  const [_, res] = queryArray
    ?.map(item => item.split("="))
    .find(item => item[0] === string ) || ['', '']

  return res;
}

const API_KEY = apiKeyGet();
const SHOP_ORIGIN = querySearch("shop");
//* Return in Base64 for decodeConfig() in Provider component to work
// https://github.com/Shopify/shopify-app-bridge/issues/48#issuecomment-840665716
const HOST = btoa(SHOP_ORIGIN + '/admin');

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
      <AppBridgeProvider config={config}>
        <AppProvider i18n={enTranslations}>
          <App shopOrigin={SHOP_ORIGIN} />
        </AppProvider>
      </AppBridgeProvider>
    </SWRConfig>
  </React.StrictMode>,
  document.getElementById('root')
)
