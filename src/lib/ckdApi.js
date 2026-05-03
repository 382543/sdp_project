const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

async function parseResponse(response) {
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Request failed')
  }

  return response.json()
}

export async function predictRisk(payload, signal) {
  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  })

  return parseResponse(response)
}
