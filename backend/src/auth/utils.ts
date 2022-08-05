import { decode } from 'jsonwebtoken'
import { createLogger } from '../utils/logger'
import { JwtPayload } from './JwtPayload'

/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
 const logger = createLogger('DecodedJwt');
 
export function parseUserId(jwtToken: string): string {
  logger.info("Income Jwt"+ jwtToken);
  const decodedJwt = decode(jwtToken) as JwtPayload
  logger.info("Decoded Jwt" + decodedJwt);
  return decodedJwt.sub
}
