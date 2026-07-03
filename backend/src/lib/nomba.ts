const BASE_URL = process.env.NOMBA_BASE_URL?.replace(/\/$/, '') ?? 'https://api.nomba.com'
const ACCOUNT_ID = process.env.NOMBA_ACCOUNT_ID?.trim()

// Exported so individual services can place it in exactly the right field per endpoint.
// Checkout uses the parent or sub-account ID in the request body/headers depending on the flow.
// Virtual accounts may target a sub-account through a URL path rather than the shared header.
export const SUB_ACCOUNT_ID = process.env.NOMBA_SUB_ACCOUNT_ID?.trim() || ''
const CLIENT_ID = process.env.NOMBA_CLIENT_ID?.trim()
const CLIENT_SECRET = process.env.NOMBA_CLIENT_SECRET?.trim()

interface CachedToken {
  accessToken: string
  expiresAt: number
}

let cachedToken: CachedToken | null = null

async function issueToken(): Promise<string> {
  const now = Date.now()

  // Re-use if the token has more than 60 s of life left
  if (cachedToken && cachedToken.expiresAt - 60_000 > now) {
    return cachedToken.accessToken
  }

  if (!ACCOUNT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Missing Nomba credentials. Set NOMBA_ACCOUNT_ID, NOMBA_CLIENT_ID, and NOMBA_CLIENT_SECRET.')
  }

  const res = await fetch(`${BASE_URL}/v1/auth/token/issue`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      accountId: ACCOUNT_ID,
    },
    body: JSON.stringify({
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      accountId: ACCOUNT_ID,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Nomba token issue failed (${res.status}): ${body}`)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json = (await res.json()) as any
  const accessToken: string = json.data?.access_token ?? json.access_token
  const expiresIn: number = json.data?.expires_in ?? json.expires_in ?? 3600

  cachedToken = { accessToken, expiresAt: now + expiresIn * 1000 }
  return cachedToken.accessToken
}

export async function nombaRequest<T>(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: Record<string, unknown>
): Promise<T> {
  const token = await issueToken()
  const payload = body

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  if (ACCOUNT_ID) {
    headers.accountId = ACCOUNT_ID
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: payload ? JSON.stringify(payload) : undefined,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Nomba API error ${res.status} on ${path}: ${text}`)
  }

  return res.json() as Promise<T>
}
