import { client } from "../helpers/api-client";

type TPublishProps = {
  origin: string;
  publisherShop: string;
};

type TSETPublishProps = TPublishProps & {
  accept: boolean;
}

const host = import.meta.env.VITE_APP_HOST as string;
const name = import.meta.env.VITE_APP_name as string;

async function useSETShopPublishSettings(props: TSETPublishProps) {
  return await client.put(`https://${host}/${name}/publish`, {
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
  return await client.delete(`https://${host}/${name}/publish`, {
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
