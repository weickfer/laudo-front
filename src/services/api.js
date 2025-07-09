const isDeveloping = import.meta.env.MODE === 'development'

export const API_URL =
  isDeveloping
    ? 'http://localhost:3000' 
    : 'https://apilaudo.inbimplus.app.br'

export async function api(path, method = 'GET', body = null) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if(!response.ok) return null

  const data = await response.json()
  
  return data
}
