
import validateHmac from '../../src/utils/validateHmac';
import generateToken from '../../src/utils/generateToken';
import { decrypt, encrypt } from '../../src/utils/crypto'
const localEnv = require('../../env.json');

export async function onRequest(context) {
  // Contents of context object
  const {
    request, // same as existing Worker API
    env, // same as existing Worker API
    params, // if filename includes [id] or [[path]]
    waitUntil, // same as ctx.waitUntil in existing Worker API
    next, // used for middleware or to fetch assets
    data, // arbitrary space for passing data between middlewares
  } = context;
  const url = new URL(request.url);
  const queryParams = url.searchParams;
  const config = {...localEnv, ...env}

  const xx = 'aaaaaadadasdasdasdasdasdasadsd';
  const xxb64 = await encrypt(config.SESSION_CRYPTO_ALGORIGHM || 'AES-CBC', config.SESSION_CRYPTO_KEY || config.SHOPIFY_APP_SECRET.split('shpss_').pop().slice(0, 32), xx);
  console.log(xxb64);
  console.log(await decrypt(config.SESSION_CRYPTO_ALGORIGHM || 'AES-CBC', config.SESSION_CRYPTO_KEY || config.SHOPIFY_APP_SECRET.split('shpss_').pop().slice(0, 32), xxb64))

  if (params.path === 'install') {
    const host = config.SHOPIFY_APP_HOST || `https://${url.host}/`;
    const shop = `${`${queryParams.get('shop')}`.replace('.myshopify.com', '')}.myshopify.com`;
    const scope = queryParams.get('scope') || config.SHOPIFY_APP_SCOPE || 'read_products';
    const redirect_uri = queryParams.get('redirect_uri') || config.SHOPIFY_REDIRECT_URI || `${host}oauth/callback`;
    const state = (Math.random()*10e17).toString(16);
    const redirectUrl = new URL(`https://${shop}/admin/oauth/authorize`);
    const redirectParams = new URLSearchParams({
      scope,
      redirect_uri,
      state,
      client_id: config.SHOPIFY_APP_KEY
    })
    redirectUrl.search = redirectParams.toString();
    console.log(redirectUrl)
    return new Response('Redirecting you to Shopify\'s OAuth flow', {
      status: 302,
      headers: {
        Location: redirectUrl.toString()
      }
    })
  } else if (params.path === 'callback') {
    const authorization_code = queryParams.get('code');
    const hmac = queryParams.get('hmac');
    const shop = queryParams.get('shop') || '';
    const state = queryParams.get('state');
    const matchesShopifyRegex = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9\-]*\.myshopify\.com$/)
    const queryParamsObject = {};
    for(let [key, val] of queryParams.entries()){ 
      queryParamsObject[key] = val;
    }
    if (!shop || !shop.match(matchesShopifyRegex)) {
      return new Response("We could not validate the store you are trying to install our app on.", {
        status: 400
      });
    }
    if (!(await validateHmac(hmac, config.SHOPIFY_APP_SECRET, queryParamsObject))) {
      return new Response("We could not validate the request signature." + shop, {
        status: 400
      });
    }

    const token = await generateToken(shop, authorization_code, config);
    
    const sessionData = {
      ca: Math.floor((new Date()).getTime()/1000),
      tk: token.access_token,
      sc: token.scope,
      sh: shop
    }
    const jsonSession = JSON.stringify(sessionData)
    const algorithm = config.SESSION_CRYPTO_ALGORIGHM || 'AES-CBC';
    const key = config.SESSION_CRYPTO_KEY || config.SHOPIFY_APP_SECRET.split('shpss_').pop().slice(0, 32);
    const sessionB64 = await encrypt(algorithm, key, jsonSession);
    
    return new Response('Redirecting you back to the application', {
      status: 302,
      headers: {
        Location: `/?shop=${encodeURIComponent(shop)}#session=${encodeURIComponent(sessionB64)}`
      }
    })
  }
  return new Response("Oops, wrong turn", {
    status: 404
  });
}