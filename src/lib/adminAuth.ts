import crypto from 'crypto';

const SEP = '.';

type Payload = { user: string; exp: number };

export function createAdminToken(secret: string, expiresInSeconds = 60 * 60) {
  const payload: Payload = { user: 'admin', exp: Date.now() + expiresInSeconds * 1000 };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');
  return `${payloadStr}${SEP}${sig}`;
}

export function verifyAdminToken(token: string | undefined | null, secret: string): Payload | null {
  if (!token) return null;
  const parts = token.split(SEP);
  if (parts.length !== 2) return null;
  const [payloadStr, sig] = parts;
  const expected = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8')) as Payload;
    if (Date.now() > payload.exp) return null;
    return payload;
  } catch (err) {
    return null;
  }
}
