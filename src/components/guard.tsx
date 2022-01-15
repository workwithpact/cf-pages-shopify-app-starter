/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

import { getSessionKey, getShop, graphql } from '../utils/session';
const Guard = ({validateSession = false, children = null} : { validateSession?: boolean, children: any}) => {
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    const run = async () => {
      const session = getSessionKey();
      const shop = getShop();
      console.log('asd');
      if (!validateSession && session) {
        setIsValid(true);
        return
      }
      if (session) {
        const query = `query {
          shop {
            name
          }
        }`
        const data = await graphql(query);
        if (data && data.shop && data.shop.name) {
          setIsValid(true);
        }
      }
      window.location.href = shop ? `/oauth/install?shop=${encodeURIComponent(shop)}` : '/install'
    }
    run();
  }, [])
  return isValid ? children : null;
}

export default Guard;