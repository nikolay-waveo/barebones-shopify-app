import { client } from "../helpers/api-client";


type TSubscribeProps = {
  origin: string;
  subscriberShop: string;
};

type TSETSubscribeProps = TSubscribeProps & {
  accept?: boolean;
  id: string;
}

async function useSETShopSubscribeSettings(props: TSETSubscribeProps) {
  return await client.put(`https://shopify.perkd.io/perkd-pubsub-app/subscribe`, {
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
  return await client.delete(`https://shopify.perkd.io/perkd-pubsub-app/subscribe`, {
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
