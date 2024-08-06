import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  DataTable,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";




export async function loader({ request }) {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      products(first : 50) {
        edges{
          node{
            title
            onlineStoreUrl
            onlineStorePreviewUrl
            featuredImage {
              id
              url
              width
              height
            }
            category{
              name
              fullName
            }
            priceRangeV2{
              maxVariantPrice{
                amount
                currencyCode            
              }
            }
          }
        }
      }
    }`,
  );


  const data = await response.json();

  const products = data.data.products.edges.map(item => ({ ...item.node }))
  console.log(products);

  return products;
}


export default function AdditionalPage() {
  const products = useLoaderData();



  const rows = products.map(item => ([
    <Link removeUnderline url={item.onlineStorePreviewUrl} alt={item.title} >{item.title}</Link>,
    item.category?.name,
    item.priceRangeV2?.maxVariantPrice?.amount,
    item.priceRangeV2?.maxVariantPrice?.currencyCode
  ]));
  console.log(rows);

  return (
    <Page fullWidth>
      <TitleBar title="Additional page" />
      <Layout >
        <Layout.Section >
          <Card>
            <DataTable
              columnContentTypes={["text", "text", "numeric", "text"]}
              headings={["Product", "Category", "Price", "Currency"]}
              rows={rows}
            >

            </DataTable>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function Code({ children }) {
  return (
    <Box
      as="span"
      padding="025"
      paddingInlineStart="100"
      paddingInlineEnd="100"
      background="bg-surface-active"
      borderWidth="025"
      borderColor="border"
      borderRadius="100"
    >
      <code>{children}</code>
    </Box>
  );
}
