import { client } from "../helpers/api-client";

type TPublishProps = {
  origin: string;
  publisherShop: string;
};

type TSETPublishProps = TPublishProps & {
  accept: boolean;
}

type TApp = {
  host: string,
  name: string,
}

async function useSETShopPublishSettings(props: TSETPublishProps, app: TApp) {
  return await client.put(`https://${app.host}/${app.name}/publish`, {
    headers: {
      "x-shopify-shop-domain": `${props.origin}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accept: props?.accept,
      shop: props.publisherShop,
    }),
  });
}

async function useDELETEShopPublishSettings(props: TPublishProps, app: TApp) {
  return await client.delete(`https://${app.host}/${app.name}/publish`, {
    headers: {
      "x-shopify-shop-domain": `${props.origin}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      shop: props.publisherShop,
    }),
  });
}

export function usePublish() {
  return {
    useSETShopPublishSettings,
    useDELETEShopPublishSettings,
  };
}
