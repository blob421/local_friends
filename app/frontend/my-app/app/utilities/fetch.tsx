// utils/fetchWithAuth.ts
export async function fetchAuth(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    ...options,
    headers : {'Content-Type': 'application/json'},
    credentials: 'include',
  });

  if ([403, 401].includes(response.status)) {
    window.location.href = '/'
  
  }

  return response;
}
