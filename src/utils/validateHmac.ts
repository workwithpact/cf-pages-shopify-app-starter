const validateHmac = async (hmac: string, secret: string, query: any) => {
  const encoder = new TextEncoder()
  const secretKeyData = encoder.encode(secret)

  const {hmac: _hmac, signature: _signature, ...map} = query;

  const orderedMap = Object.keys(map)
    .sort((value1, value2) => value1.localeCompare(value2))
    .reduce((accum: any, key) => {
      accum[key] = map[key];
      return accum;
    }, {});

  const message = unescape((new URLSearchParams(orderedMap)).toString());
  console.log('message', message);

  const key = await crypto.subtle.importKey(
    "raw",
    secretKeyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )

  const mac = (await crypto.subtle.sign("HMAC", key, encoder.encode(message)))
  const signature = Array.from(new Uint8Array(mac)).map(b => b.toString(16).padStart(2, '0')).join('')
  return signature === hmac;
}

export default validateHmac;