const encrypt = async (algo: 'AES-CBC' | 'AES-CTR' | 'AES-GCM', key: string, data: string ) => {
  const importedKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: algo },
    false,
    ["encrypt"],
  )
  const encryptedData = await crypto.subtle.encrypt({name: algo, iv: crypto.getRandomValues(new Uint8Array(16))}, importedKey, new TextEncoder().encode(data));
  // @ts-ignore
  const b64Data = btoa(String.fromCharCode(...new Uint8Array(encryptedData)))
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
  const decryptedData = await crypto.subtle.decrypt({name: algo, iv: crypto.getRandomValues(new Uint8Array(16))}, importedKey, new TextEncoder().encode(data));
  // @ts-ignore
  const b64Data = btoa(String.fromCharCode(...new Uint8Array(decryptedData)))
  return b64Data;
}

export { encrypt, decrypt }