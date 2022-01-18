import { CalloutCard, Card, Frame, Layout, Loading, Page } from '@shopify/polaris';
import React, { useState, useEffect} from 'react';
import { graphql } from '../utils/session';

const Home = () => {
  const [graphqlData, setGraphqlData] = useState(null as any);
  useEffect(() => {
    graphql(`{
      shop {
        name
      }
      app {
        title
        installation {
          accessScopes {
            description
            handle
          }
        }
      }
    }`).then(data => setGraphqlData(data));
  }, [])
  return (
    {graphqlData} ? (
      <Page>
        <Layout>
          <Layout.Section>
            <CalloutCard
              title="Get started developing your app"
              illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
              primaryAction={{
                content: 'Read our documentation',
                url: 'https://github.com/workwithpact/cf-pages-shopify-app-starter',
              }}
              secondaryAction={{
                content: 'Learn more about Polaris',
                url: 'https://polaris.shopify.com/',
              }}
            >
              <p>
                You did it!
              </p> 
              <p>
                If you're seeing this message, it means you properly authenticated a Shopify store to your app, and are now in a logged-in state. You're all set, get coding!
              </p>
            </CalloutCard>
          </Layout.Section>
          <Layout.Section secondary>
            <Card title="Installation details" sectioned>
              <p><strong>App title:</strong> {graphqlData && graphqlData?.data?.app?.title}</p>
              <p><strong>Shop name:</strong> {graphqlData && graphqlData?.data?.shop?.name}</p>
              <p><strong>Scopes:</strong> {(graphqlData && graphqlData?.data?.app?.installation?.accessScopes || []).map((v: any) => v.handle).join(', ')}</p>
            </Card>
          </Layout.Section>

        </Layout>
      </Page>
    ): (
      <div style={{height: '100px'}}>
        <Frame>
          <Loading />
        </Frame>
      </div>
    )
  )
  return  <CalloutCard
  title="Customize the style of your checkout"
  illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
  primaryAction={{
    content: 'Customize checkout',
    url: 'https://www.shopify.com',
  }}
>
  <p>Upload your store’s logo, change colors and fonts, and more.</p>
</CalloutCard>
}

export default Home;