import React, { useState } from 'react'
import { Page, Card, TextField } from '@shopify/polaris'
import {APP_TITLE} from '../utils/constants'

const Template = () => {
  const [storeUrl, setStoreUrl] = useState('');
  const onChange = (value: string) => {
    setStoreUrl(value)
  }
  return (
    <Page title={APP_TITLE}>
      <Card title="Let's get acquainted" sectioned primaryFooterAction={{content: `Proceed to installation`, disabled: !storeUrl.trim(), onAction: () => window.location.href = `/oauth/install?store=${encodeURIComponent(storeUrl)}`}}>
        <TextField value={storeUrl} suffix=".myshopify.com" label="What is your store's URL? " autoComplete="off" onChange={onChange} />
      </Card>
    </Page>
  );
}

export default Template