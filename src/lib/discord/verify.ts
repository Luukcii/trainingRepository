// Proves a request really came from Discord. Discord signs every command it sends with its private key;
// we check the signature with the app's public key. Without this, anyone who found the URL could post fake
// commands and rewrite the war. Built into Node's crypto, so no extra package.
import { createPublicKey, verify } from "node:crypto";

const MAX_AGE_SECONDS = 5 * 60; // older than this = someone replaying a captured request

export function verifyDiscordRequest(body: string, signature: string | null, timestamp: string | null, publicKeyHex: string): boolean {
  if (!signature || !timestamp || !/^[0-9a-f]{128}$/i.test(signature) || !/^\d+$/.test(timestamp)) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_AGE_SECONDS) return false;
  try {
    const key = createPublicKey({
      key: { kty: "OKP", crv: "Ed25519", x: Buffer.from(publicKeyHex, "hex").toString("base64url") },
      format: "jwk",
    });
    return verify(null, Buffer.from(timestamp + body), key, Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}
