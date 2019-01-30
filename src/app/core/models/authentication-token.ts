import { DateTime } from 'luxon';
import { User } from './user';

function base64Decode(encoded: string): string {
  // Re-add the removed 0-2 '=' chars at end
  const remainder = encoded.length % 4;
  encoded += remainder === 2 ? '==' : remainder === 3 ? '=' : '';

  encoded = encoded
    .replace(/\-/g, '+') // Convert '-' to '+'
    .replace(/\_/g, '/'); // Convert '_' to '/'

  return atob(encoded);
}

export type AuthAudiences = 'plo.cord.bible';
export type JwtTokenMap = Record<AuthAudiences, string>;

export class AuthenticationToken {
  static fromJson(json: AuthenticationToken): AuthenticationToken {
    return new AuthenticationToken(
      User.fromJson(json.user),
      json.issued,
      json.expires,
      json.audience,
      json.issuer,
      json.jwtId,
      json.jwtToken,
      json.key,
    );
  }

  /**
   * From a Json Web Token
   */
  static fromJwt(key: string, jwt: any): AuthenticationToken {
    const jsonParts = (jwt || '').split('.');
    if (jsonParts.length !== 3) {
      throw new Error(`Invalid JWT token, should have 3 parts, but had ${jsonParts.length}`);
    }

    const decoded = base64Decode(jsonParts[1]);
    const json = JSON.parse(decoded);

    const user = User.fromJson({
      id: json.id,
      email: json.email,
      displayFirstName: json.dfn,
      displayLastName: json.dln,
    });

    return new AuthenticationToken(
      user,
      DateTime.fromMillis(json.iat * 1000).toJSDate(),
      DateTime.fromMillis(json.exp * 1000).toJSDate(),
      json.aud,
      json.iss,
      json.jti,
      jwt,
      key,
    );
  }

  static fromTokenMap(tokenMap: Partial<JwtTokenMap> | undefined): AuthenticationToken[] {
    return Object.entries(tokenMap || {})
      .map(([key, value]) => AuthenticationToken.fromJwt(key, value));
  }

  public get expired(): boolean {
    return new Date() >= this.expires;
  }

  private constructor(
    readonly user: User,
    // These are not Luxon's DateTime objects because IndexDB cannot (un)serialize them correctly.
    readonly issued: Date,
    readonly expires: Date,
    readonly audience: string,
    readonly issuer: string,
    readonly jwtId: string,
    readonly jwtToken: string,
    readonly key: string,
  ) {}
}
