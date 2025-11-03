// src/lib/adminAuth.ts

const SEP = '.';

type Payload = { user: string; exp: number };

/**
 * ✅ Create token (HMAC SHA-256 based)
 */
export async function createAdminToken(secret: string, expiresInSeconds = 60 * 60) {
  const payload: Payload = {
    user: 'admin',
    exp: Date.now() + expiresInSeconds * 1000,
  };

  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = await hmacSign(payloadStr, secret);
  return `${payloadStr}${SEP}${sig}`;
}

/**
 * ✅ Verify token securely
 */
export async function verifyAdminToken(
  token: string | undefined | null,
  secret: string
): Promise<Payload | null> {
  if (!token) return null;
  const parts = token.split(SEP);
  if (parts.length !== 2) return null;

  const [payloadStr, sig] = parts;
  const expected = await hmacSign(payloadStr, secret);

  if (sig !== expected) return null; // simple compare (Edge safe)

  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8')) as Payload;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

/**
 * ✅ Helper: Generate HMAC SHA-256 signature (Edge-compatible)
 */
async function hmacSign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();

  // Web Crypto (works in Edge + Node)
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Buffer.from(signature).toString('base64url');
}
