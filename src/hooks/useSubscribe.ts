import { client } from "../helpers/api-client";


type TSubscribeProps = {
  origin: string;
  subscriberShop: string;
};

type TSETSubscribeProps = TSubscribeProps & {
  accept?: boolean;
  id: string;
}

type TApp = {
  host: string,
  name: string,
}

async function useSETShopSubscribeSettings(props: TSETSubscribeProps, app: TApp) {
  return await client.put(`https://${app.host}/${app.name}/subscribe`, {
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

async function useDELETEShopSubscribeSettings(props: TSubscribeProps, app: TApp) {
  return await client.delete(`https://${app.host}/${app.name}/subscribe`, {
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
