import { DateTime } from 'luxon';
import { decode as decodeBase64url } from 'urlsafe-base64';
import { User } from './user';

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
      json.key
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

    const decoded = decodeBase64url(jsonParts[1]).toString();
    const json = JSON.parse(decoded);

    const user = User.fromJson({
      id: json.id,
      email: json.email,
      displayFirstName: json.firstName,
      displayLastName: json.lastName
    });

    return new AuthenticationToken(
      user,
      DateTime.fromMillis(json.iat * 1000).toJSDate(),
      DateTime.fromMillis(json.exp * 1000).toJSDate(),
      json.aud,
      json.iss,
      json.jti,
      jwt,
      key
    );
  }

  /**
   * A token map is returned from the authentication authority:
   * {
   *    token: {
   *      "audience-id-1":"jwt_token-1",
   *      "audience-id-2":"jwt_token-2"
   *    }
   * }
   */
  static fromTokenMap(tokenMap: any): AuthenticationToken[] {
    const tokens = (tokenMap || {token: {}}).token;

    return Object.entries(tokens)
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
    readonly key: string
  ) {}
}
