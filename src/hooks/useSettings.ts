import useSWR, { mutate } from "swr";
import { client, fetcher } from "../helpers/api-client";

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

const host = import.meta.env.VITE_APP_HOST as string;
const name = import.meta.env.VITE_APP_NAME as string;

interface TShopSettingsResult extends TShopSettings {
  published?: Array<IShop>;
  subscribed?: Array<IShop>;
}

function useGETShopSettings(shop: string): ({
  data: TShopSettingsResult,
  isLoading: boolean,
  isError: any,
}) {
  const { data, error, mutate } = useSWR(
    [
      `https://${host}/${name}/settings`,
      {
        headers: {
          "x-shopify-shop-domain": `${shop}`,
          // Accept: "application/json",
          // "Content-Type": "application/json",
        },
      }
    ],
      fetcher
    );

  // mutate(`https://${host}/${name}/settings?shop=${shop}`);

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
  return await client.post(`https://${host}/${name}/settings`, {
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
