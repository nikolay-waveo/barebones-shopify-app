import useSWR, { mutate } from "swr";
import { client } from "../helpers/api-client";

interface IShop {
  shop?: string;
  status?: string;
  inventoryLocationId?: string;
  enabled?: boolean;
  updatedAt?: string;
}

type TShopSettings = {
  publish: boolean;
};

interface TShopSettingsResult extends TShopSettings {
  published?: Array<IShop>;
  subscribed?: Array<IShop>;
}

const { API_ENDPOINT } = process.env;

function useGETShopSettings(shop: string): ({
  data: TShopSettingsResult,
  isLoading: boolean,
  isError: any,
}) {

  const { data, error} = useSWR(`https://shopify.perkd.io/products-pubsub-app-dev/settings?shop=${shop}`);

  // Bind this to only work on submit
  mutate(`https://shopify.perkd.io/products-pubsub-app-dev/settings?shop=${shop}`);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}

/**
 * setShopSettings - Enable/Disable Shop publish mode
 *
 * @param {string} shop
 * @param {TShopSettings} settings
 * @returns
 */

async function useSETShopSettings(shop: string, settings: TShopSettings) {
  return await client.post(`https://shopify.perkd.io/products-pubsub-app-dev/settings`, {
    headers: {
      "x-shopify-shop-domain": `${shop}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...settings,
    }),
  });
}

export function useSettings() {
  return {
    useGETShopSettings,
    useSETShopSettings,
  };
}
