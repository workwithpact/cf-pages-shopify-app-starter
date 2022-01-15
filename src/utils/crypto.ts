const encrypt = async (algo: 'AES-CBC' | 'AES-CTR' | 'AES-GCM', key: string, data: string ) => {
  const importedKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: algo },
    false,
    ["encrypt"],
  )
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const encryptedData = await crypto.subtle.encrypt({name: algo, iv}, importedKey, new TextEncoder().encode(data));
  // @ts-ignore
  const dataArray = new Uint8Array(encryptedData)
  const finalArray = new Uint8Array(iv.length + dataArray.length)
  finalArray.set(iv, 0);
  finalArray.set(dataArray, iv.length);
  const b64Data = btoa(String.fromCharCode.apply(null, finalArray as any));
  return b64Data;
}

const decrypt = async (algo: 'AES-CBC' | 'AES-CTR' | 'AES-GCM', key: string, data: string ) => {
  const importedKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: algo },
    false,
    ["decrypt"],
  )
  const byteArray = Uint8Array.from(atob(data), c => c.charCodeAt(0))
  const iv = byteArray.slice(0, 16);
  const message = byteArray.slice(16, byteArray.length);
  const decryptedData = await crypto.subtle.decrypt({name: algo, iv}, importedKey, message);
  const decryptedMessage = new TextDecoder().decode(decryptedData)
  return decryptedMessage
}

export { encrypt, decrypt }