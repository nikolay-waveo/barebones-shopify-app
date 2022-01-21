import { client, fetcher, useSWR } from "../helpers/api-client";

export type TShop = {
  shop?: string;
  status?: string;
  inventoryLocationId?: string;
  enabled?: boolean;
  updatedAt?: string;
}

interface IPublisherProps {
  origin: string,
  shop?: string,
  accept?: boolean,
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

function useGETPublisher({
  origin
}: IPublisherProps
): IReturnObject {
  const options = {
    headers: {
      "x-shopify-shop-domain": `${origin}`,
    },
  }

  const { data, error } = useSWR(
    [ `https://${host}/${name}/settings`, options ], 
    fetcher 
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
  };
}

async function usePOSTPublisher({
  origin,
  publish
}: IPublisherProps
): Promise<any> {

  const options = {
    headers: {
      "x-shopify-shop-domain": `${origin}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      publish: publish
    })
  }

  return await client.post( `https://${host}/${name}/settings`, options );
}

async function usePUTPublisher({
  origin,
  shop,
  accept
}: IPublisherProps
): Promise<any> {

  const options = {
    headers: {
      "x-shopify-shop-domain": `${origin}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accept: accept,
      shop: shop,
    }),
  }

  return await client.put( `https://${host}/${name}/publish`, options );
}

async function useDELPublisher({
  origin,
  shop,
}: IPublisherProps
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

  return await client.delete( `https://${host}/${name}/publish?shop=${shop}`, options );
}

export function usePublisher() {
  return {
    useDisplayPublisher:    useGETPublisher,
    useUpdatePublishStatus: usePOSTPublisher,
    useUpdateSubscriber:    usePUTPublisher,
    useRemoveSubscriber:    useDELPublisher,
  };
}
