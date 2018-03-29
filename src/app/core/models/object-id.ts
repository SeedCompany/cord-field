export class ObjectId {
  private id = '';

  public get timeStamp(): Date {
    return new Date(parseInt(this.id.substring(0, 8), 16) * 1000);
  }

  constructor(id: string) {
    this.id = id || '';
  }

  toString() {
    return this.id;
  }
}
