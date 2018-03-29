export class ServerDate {

  static fromEpochSeconds(seconds: number) {
    const d = new Date(0);
    d.setUTCSeconds(seconds);
    return d;
  }
}
