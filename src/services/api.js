export const API_URL = 'https://relatorio-tgkc.onrender.com' //'http://localhost:3000'

export async function api(path, method = 'GET', body = null) {
  const response = await fetch(`${API_URL}${path}`, {
    method,
    body: body ? JSON.stringify(body) : null,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  const data = await response.json()
  
  return data
}
