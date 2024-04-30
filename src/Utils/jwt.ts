import jwt, { SignOptions } from 'jsonwebtoken';

export const signJwt = (
  payload: Object,
  token: string,
  options: SignOptions
) => {
  const privateKey = Buffer.from(
    token,
    'base64'
  ).toString('ascii');
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verifyJwt = <T>(
  token: string,
  keyName: string
): T | null => {
  try {
    const publicKey = Buffer.from(
     keyName,
      'base64'
    ).toString('ascii');
    const decoded = jwt.verify(token, publicKey) as T;

    return decoded;
  } catch (error) {
    return null;
  }
};
