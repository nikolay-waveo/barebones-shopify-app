import { client } from "../helpers/api-client";


type TSubscribeProps = {
  origin: string;
  subscriberShop: string;
};

type TSETSubscribeProps = TSubscribeProps & {
  accept?: boolean;
  id: string;
}

const host = import.meta.env.VITE_APP_HOST as string;
const name = import.meta.env.VITE_APP_NAME as string;

async function useSETShopSubscribeSettings(props: TSETSubscribeProps) {
  return await client.put(`https://${host}/${name}/subscribe`, {
    headers: {
      "x-shopify-shop-domain": `${props.origin}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accept: props?.accept,
      shop: props.subscriberShop,
      inventoryLocationId: props.id,
    }),
  });
}

async function useDELETEShopSubscribeSettings(props: TSubscribeProps) {
  return await client.delete(`https://${host}/${name}/subscribe`, {
    headers: {
      "x-shopify-shop-domain": `${props.origin}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shop: props.subscriberShop,
    }),
  });
}

export function useSubscribe() {
  return {
    useSETShopSubscribeSettings,
    useDELETEShopSubscribeSettings,
  };
}
