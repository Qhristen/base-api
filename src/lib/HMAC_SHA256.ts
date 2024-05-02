import { createHmac } from "crypto";

export const HMAC_SHA256 = (key: string | Buffer, secret: string) => {
  return createHmac("sha256", key).update(secret);
};
