import * as moment from 'moment';
import { decode as decodeBase64url } from 'urlsafe-base64';
import { LoggerService } from '../services/logger.service';
import { ObjectId } from './object-id';
import { ServerDate } from './server-date';
import { User } from './user';

export class AuthenticationToken {
  static fromJson(json: any): AuthenticationToken {
    json = json || {};

    return new AuthenticationToken(
      new ObjectId(json.id || (json.userId || {} as any).id),
      json.email,
      json.phone,
      json.domain,
      json.firstName,
      json.lastName,
      ServerDate.fromEpochSeconds(json.iat),
      ServerDate.fromEpochSeconds(json.exp),
      json.aud,
      json.iss,
      json.jti,
      json.token || json.jwtToken,
      json.key
    );
  }

  static fromJsonArray(jsons: any[]): AuthenticationToken[] {
    const results = [];
    if (Array.isArray(jsons)) {
      for (const json of jsons) {
        results.push(AuthenticationToken.fromJson(json));
      }
    }
    return results;
  }

  /**
   * From a Json Web Token
   */
  static fromJwt(key: string, jwt: any): AuthenticationToken {
    jwt = jwt || '';

    let jwtPayload;
    try {
      const jsonParts = jwt.split('.');
      if (jsonParts.length !== 3) {
        throw new Error(`invalid JWT token, should have 3 parts, but had ${jsonParts.length}`);
      }

      const decoded = decodeBase64url(jsonParts[1]).toString();
      jwtPayload = JSON.parse(decoded);

    } catch (err) {
      //  new LoggerService().error(err, 'problem with decoding AuthenticationToken from json');
      // new LoggerService().debugJson(jwt, 'errant auth token');
    }

    jwtPayload.token = jwt;
    jwtPayload.key = key;
    return AuthenticationToken.fromJson(jwtPayload);
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

    const results = [];

    for (const key of Object.keys(tokens)) {
      results.push(AuthenticationToken.fromJwt(key, tokens[key]));
    }

    return results;
  }

  public get userCreated(): Date {
    return (this.userId || {} as any).timeStamp;
  }

  public get expired(): boolean {
    return moment().isAfter(this.expires);
  }

  constructor(public userId: ObjectId,
              public email: string,
              public phone: string,
              public domain: string,
              public firstName: string,
              public lastName: string,
              public issued: Date,
              public expires: Date,
              public audience: string,
              public issuer: string,
              public jwtId: string,
              public jwtToken: string,
              public key: string) {
  }

  toUser(): User {
    return User.fromJson({
      id: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone
    });
  }
}
