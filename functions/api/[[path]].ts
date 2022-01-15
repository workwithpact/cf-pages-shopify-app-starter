import { decrypt } from "../../src/utils/crypto";
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

  const config = {...localEnv, env}
  const version = config.SHOPIFY_API_VERSION ? `/${config.SHOPIFY_API_VERSION}` : '';
  const url = `/admin${version}${params.path}`;
  const sessionData = request.headers.get('x-shopify-session');

  const algorithm = config.SESSION_CRYPTO_ALGORIGHM || 'AES-CBC';
  const key = config.SESSION_CRYPTO_KEY || config.SHOPIFY_APP_SECRET.split('shpss_').pop().slice(0, 32);
  const session = await decrypt(algorithm, key, sessionData);

  console.log({session})
  // return await fetch()

  return new Response("Hello, world!");
}