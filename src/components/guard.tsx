/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { getSessionKey, getShop, graphql } from '../utils/session';
const Guard = ({validateSession = false, children = null} : { validateSession?: boolean, children: any}) => {
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    const run = async () => {
      const shop = getShop();
      try {
        const session = getSessionKey();
        if (!validateSession && session) {
          setIsValid(true);
          return
        }
        if (session) {
          const query = `{
            shop {
              name
            }
          }`
          const data = await graphql(query);
          if (data && data.data && data.data.shop && data.data.shop.name) {
            setIsValid(true);
            return;
          }
        }
      } catch (e) {
        console.error(e);
      }
      if (window.top) {
        window.top.location.href = shop ? `/oauth/install?shop=${encodeURIComponent(shop)}&${window.location.search}` : '/install'
        return
      } 
      window.location.href = shop ? `/oauth/install?shop=${encodeURIComponent(shop)}&${window.location.search}` : '/install'
    }
    run();
  }, [])
  return isValid ? children : null;
}

export default Guard;