import { by } from 'protractor';

export class ProtractorLocators {
  byMatIcon = (name: string) => by.xpath(`//mat-icon[. = '${name}']`);
}
