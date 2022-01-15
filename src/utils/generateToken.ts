const generateToken = async (shop: string, code: string, config: any) => {
  const url = `https://${shop.split('.').shift()}.myshopify.com/admin/oauth/access_token`
  const postData = {
    client_id: config.SHOPIFY_APP_KEY,
    client_secret: config.SHOPIFY_APP_SECRET,
    code
  }
  const data = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
  })
  return await data.json()
}

export default generateToken;