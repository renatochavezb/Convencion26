const COOKIE_NAME = 'comev_interno_auth';

function authSecret(): string {
  return process.env.INTERNAL_AUTH_SECRET || process.env.INTERNAL_CONTENT_PASSWORD || 'comev-interno-fallback';
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return toHex(signature);
}

export function getInternoAuthCookieName(): string {
  return COOKIE_NAME;
}

export async function createInternoAuthToken(password: string): Promise<string> {
  return hmacSha256Hex(authSecret(), password);
}

export function isValidInternoPassword(password: string): boolean {
  const expected = process.env.INTERNAL_CONTENT_PASSWORD;
  if (!expected) return false;
  return timingSafeEqualStrings(password, expected);
}

export async function isValidInternoToken(token: string | undefined): Promise<boolean> {
  const expectedPassword = process.env.INTERNAL_CONTENT_PASSWORD;
  if (!expectedPassword || !token) return false;
  const expected = await createInternoAuthToken(expectedPassword);
  return timingSafeEqualStrings(token, expected);
}
