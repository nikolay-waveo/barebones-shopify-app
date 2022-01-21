import { client, fetcher, useSWR } from "../helpers/api-client";

export type TShop = {
  shop?: string;
  status?: string;
  inventoryLocationId?: string;
  enabled?: boolean;
  updatedAt?: string;
}

interface ISubscriberProps {
  origin: string,
  shop?: string,
  id?: string,
  publish?: boolean,
}

interface TShopSettingsResult {
  publish: boolean,
  published?: Array<TShop>;
  subscribed?: Array<TShop>;
}

interface IReturnObject {
  data: TShopSettingsResult,
  isLoading: boolean,
  isError: any,
}

const host = import.meta.env.VITE_APP_HOST as string;
const name = import.meta.env.VITE_APP_NAME as string;

function useGETSubscriberLocation({
  origin,
}: ISubscriberProps
): IReturnObject {
  const options = {
    headers: {
      "x-shopify-shop-domain": `${origin}`,
    },
  }

  const { data, error } = useSWR(
    [ `https://${host}/${name}/locations`, options ],
    fetcher 
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}

async function usePUTSubscriber({
  origin,
  shop,
  id,
}: ISubscriberProps
): Promise<any> {

  const options = {
    headers: {
      "x-shopify-shop-domain": `${origin}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shop: shop,
      inventoryLocationId: id,
    }),
  }

  return await client.put(`https://${host}/${name}/subscribe`, options);
}

async function useDELSubscriber({
  origin,
  shop,
}: ISubscriberProps
): Promise<any> {

  const options = {
    headers: {
      "x-shopify-shop-domain": `${origin}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shop: shop,
    }),
  }

  return await client.delete( `https://${host}/${name}/subscribe?shop=${shop}`, options );
}


export function useSubscriber() {
  return {
    useRetrieveLocation:   useGETSubscriberLocation,
    useUpdateSubscription: usePUTSubscriber,
    useRemoveSubscription: useDELSubscriber,
  };
}
