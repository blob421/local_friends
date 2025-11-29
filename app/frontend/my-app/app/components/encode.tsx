export function encodeUrlSafe(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')   // replace + with -
    .replace(/\//g, '_')   // replace / with _
    .replace(/=+$/, '');   // remove trailing =
}

export function decodeUrlSafe(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}
