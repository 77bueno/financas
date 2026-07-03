/** Password hashing via WebCrypto PBKDF2-SHA256. Nothing is ever stored in plain text. */

const ITERATIONS = 150_000;

function toHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return toHex(arr.buffer);
}

export async function hashSecret(secret: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const s = salt ?? randomHex(16);
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(s), iterations: ITERATIONS },
    key,
    256,
  );
  return { hash: toHex(bits), salt: s };
}

export async function verifySecret(secret: string, hash: string, salt: string): Promise<boolean> {
  const { hash: h } = await hashSecret(secret, salt);
  return h === hash;
}

/** Human-friendly recovery code, e.g. "K7QM-2WXR-9TBD" (no ambiguous chars). */
export function generateRecoveryCode(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTVWXYZ23456789';
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  const chars = [...arr].map(b => alphabet[b % alphabet.length]);
  return `${chars.slice(0, 4).join('')}-${chars.slice(4, 8).join('')}-${chars.slice(8, 12).join('')}`;
}

export function normalizeRecoveryCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9]/g, '');
}
