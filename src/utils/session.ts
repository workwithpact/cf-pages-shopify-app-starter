const getSessionKey = () => {
  let session = null;
  let shop = null;
  try {
    const url = new URL(window.location.href)
    const params = url.searchParams;
    const hashtagParams = new URLSearchParams(url.hash)
    shop = params.get('shop') || hashtagParams.get('shop')
    session = shop ? params.get('session') || hashtagParams.get('session') || ((window as any)._pactSessions && (window as any).pactSessions[shop]) || localStorage.getItem(`pactSession_${shop}`) : null;
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
  return session
}
export {getSessionKey}