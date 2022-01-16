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
  const version = config.SHOPIFY_API_VERSION ? `/${config.SHOPIFY_API_VERSION}/` : '/';
  const path = `/admin/api${version}${params.path}`;
  const sessionData = request.headers.get('x-shopify-session');

  const algorithm = config.SESSION_CRYPTO_ALGORIGHM || 'AES-CBC';
  const key = config.SESSION_CRYPTO_KEY || config.SHOPIFY_APP_SECRET.split('shpss_').pop().slice(0, 32);
  const session = JSON.parse(await decrypt(algorithm, key, sessionData));

  console.log({session})
  const url = `https://${session.sh}${path}`;
  const headers = {};
  for (let [key, val] of request.headers.entries()) {
    if (key === 'host') continue;
    headers[key] = val;
  }
  return fetch(url, {
    method: request.method,
    headers: {
      'X-Shopify-Access-Token': session.tk,
      'Accept': request.headers.get('Accept') || 'application/json',
      'Content-Type': request.headers.get('Content-Type') || 'application/json'
    },
    body: request.body
  })
  // return await fetch()

  return new Response("Hello, world!");
}