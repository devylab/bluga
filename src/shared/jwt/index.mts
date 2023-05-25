import jwt from 'jsonwebtoken';

type JWTData = {
  id: string;
  secret: string;
};

/**
 * @description generate jwt token
 * @param jwtData
 * @param expires time in seconds
 * @param secret
 * @returns string
 */
export const generateAuthToken = (jwtData: JWTData, expires: number, secret: string) => {
  return jwt.sign(jwtData, secret, {
    algorithm: 'HS256',
    expiresIn: expires,
  });
};

/**
 * @description verify jwt token
 * @param token
 * @param secret
 * @returns string
 */
export const verifyAuthToken = (token: string, secret: string) => {
  return new Promise<JWTData>((resolve, reject) => {
    jwt.verify(token, secret, (err, value) => {
      if (err) reject(err?.message);

      resolve(value as JWTData);
    });
  });
};
