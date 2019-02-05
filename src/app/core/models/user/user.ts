import { firstLettersOfWords, maybeRedacted } from '@app/core/util';

export class User {

  id: string;
  realFirstName: string | null;
  realLastName: string | null;
  displayFirstName: string;
  displayLastName: string;
  email: string | null;

  static store(user: User) {
    return {
      id: user.id,
      firstName: user.realFirstName,
      displayFirstName: user.displayFirstName,
      lastName: user.realLastName,
      displayLastName: user.displayLastName,
      email: user.email,
    };
  }

  get firstName(): string {
    return maybeRedacted(this.realFirstName) || this.displayFirstName;
  }

  get lastName(): string {
    return maybeRedacted(this.realLastName) || this.displayLastName;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get avatarLetters() {
    return firstLettersOfWords(this.fullName);
  }

  static fromJson(json: any): User {
    const obj = new User();

    obj.id = json.id || '';
    obj.realFirstName = json.firstName;
    obj.displayFirstName = json.displayFirstName || '';
    obj.realLastName = json.lastName;
    obj.displayLastName = json.displayLastName || '';
    obj.email = json.email;

    return obj;
  }
}
