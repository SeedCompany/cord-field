import { Component } from '@angular/core';
import { Organization } from '../../core/models/organization';
import { Partnership, PartnershipAgreementStatus, PartnershipType } from '../../core/models/partnership';

@Component({
  selector: 'app-project-partnerships',
  templateUrl: './project-partnerships.component.html',
  styleUrls: ['./project-partnerships.component.scss']
})
export class ProjectPartnershipsComponent {

  readonly PartnershipType = PartnershipType;
  readonly PartnershipAgreementStatus = PartnershipAgreementStatus;

  partnerships: Partnership[] = [];
  private opened: Partnership | null;

  adding = false;

  trackById(index: number, object: {id: string}): string {
    return object.id;
  }

  isCardOpened(partnership: Partnership): boolean {
    return this.opened ? this.opened.id === partnership.id : false;
  }

  onCardOpen(partnership: Partnership): void {
    this.opened = partnership;
  }

  onCardClose(): void {
    this.opened = null;
  }

  onSelect(org: Organization): void {
    const partnership = Partnership.fromOrganization(org);

    this.partnerships.push(partnership);
    this.adding = false;
  }

  onCancel(): void {
    this.adding = false;
  }

  onDelete(partnership: Partnership): void {
    this.partnerships = this.partnerships.filter(current => current.id !== partnership.id);
  }
}
