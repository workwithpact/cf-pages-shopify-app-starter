let hasNotifiefOfLocalURL = false;
const getShop = () => {
  let shop = null;
  const url = new URL(window.location.href)
  const params = url.searchParams;
  const hashtagParams = new URLSearchParams(url.hash)
  shop = params.get('shop') || hashtagParams.get('shop')
  return shop
}
const getSessionKey = () => {
  let session = null;
  let shop = getShop();
  try {
    const url = new URL(window.location.href)
    // const params = url.searchParams;
    const hashtagParams = new URLSearchParams(url.hash.slice(1, url.hash.length))
    session = shop ? /*params.get('session') || */ hashtagParams.get('session') || ((window as any)._pactSessions && (window as any).pactSessions[shop]) || localStorage.getItem(`pactSession_${shop}`) : null;
  } catch(e) {
    return;
  }
  if (session && shop) {
    (window as any)._pactSessions = (window as any)._pactSessions || {};
    (window as any)._pactSessions[shop] = session;
    try {
      window.localStorage.setItem(`pactSession_${shop}`, session);
    } catch (e) {}
  }
  if (!hasNotifiefOfLocalURL) {
    console.log(`Looking to work locally? ?shop=${encodeURIComponent(shop || '')}#session=${encodeURIComponent(session)}`)
    hasNotifiefOfLocalURL = true;
  }
  return session
}

const graphql = async (query: string, variables:any = null) => {
  return restApi('/graphql.json', { query, variables}, 'POST', 'application/json')
}

const restApi = async (path: string, body?:any, method?:any, contentType:any = 'application/json') => {
  const data = await expandedRestApi(path, body, method, contentType);
  return data.data;
}
const expandedRestApi = async (path: string, body?:any, method?:any, contentType:any = 'application/json') => {
  const session = getSessionKey();
  if (!session) {
    throw new Error('Session cannot be found');
  }
  const response = await fetch(`/api${path}`, {
    headers: {
      'content-type': contentType,
      'x-shopify-session': session
    },
    method: method ? method : body ? 'POST' : 'GET',
    body: body ? JSON.stringify(body) : null
  });
  const data = await response.json();
  const returnData = {
    data,
    headers: response.headers,
    page_info: {}
  } as {data: any, headers: Headers, page_info: Record<string, string>}

  const linkHeader = response.headers.get('link');

  if (linkHeader) {
    const parts = linkHeader.split(',');
    parts.forEach(part => {
      const section = part.split(';');
      const url = new URL(section[0].replace(/<(.*)>/, '$1').trim());
      const params = new URLSearchParams(url.search);
      const name = section[1].replace(/rel="(.*)"/, '$1').trim();
      const pageInfo = params.get('page_info');
      if (pageInfo) {
        returnData.page_info[name] = pageInfo;
      }
    });
  }
  return returnData;
}
export {getSessionKey, graphql, restApi, getShop, expandedRestApi}