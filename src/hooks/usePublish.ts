import { client } from "../helpers/api-client";

type TPublishProps = {
  origin: string;
  publisherShop: string;
};

type TSETPublishProps = TPublishProps & {
  accept: boolean;
}

const { API_ENDPOINT } = process.env;

async function useSETShopPublishSettings(props: TSETPublishProps) {
  return await client.put(`https://shopify.perkd.io/products-pubsub-app-dev/publish`, {
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

async function useDELETEShopPublishSettings(props: TPublishProps) {
  return await client.delete(`https://shopify.perkd.io/products-pubsub-app-dev/publish`, {
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
