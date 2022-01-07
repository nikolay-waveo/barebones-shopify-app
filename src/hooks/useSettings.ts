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

type TApp = {
  host: string,
  name: string,
}

interface TShopSettingsResult extends TShopSettings {
  published?: Array<IShop>;
  subscribed?: Array<IShop>;
}

function useGETShopSettings(shop: string, app: TApp ): ({
  data: TShopSettingsResult,
  isLoading: boolean,
  isError: any,
}) {

  const { data, error} = useSWR(`https://${app.host}/${app.name}/settings?shop=${shop}`);

  mutate(`https://${app.host}/${app.name}/settings?shop=${shop}`);

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

async function useSETShopSettings(shop: string, settings: TShopSettings, app: TApp ) {
  return await client.post(`https://${app.host}/${app.name}/settings`, {
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
