import { by } from 'protractor';

export function byMatIcon(name: string) {
    return by.xpath(`//mat-icon[. = '${name}']`);
}

export function byFormControlName(name: string) {
    return by.css(`input[formControlName="${name}"]`);
}

export function byCardTitle () {
    return by.xpath(`//mat-card-title`);
}

