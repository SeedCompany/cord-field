import { by } from 'protractor';

export class ProtractorLocators {
  byMatIcon = (name: string) => by.xpath(`//mat-icon[. = '${name}']`);

  byCardTitle = () => by.xpath(`//mat-card-title`);

  byFormControlName = (name: string) => by.css(`input[formControlName="${name}"]`);
}
