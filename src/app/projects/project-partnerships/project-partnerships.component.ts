import { Component, OnInit } from '@angular/core';
import { Organization } from '../../core/models/organization';
import { Partnership, PartnershipAgreementStatus, PartnershipType } from '../../core/models/partnership';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-partnerships',
  templateUrl: './project-partnerships.component.html',
  styleUrls: ['./project-partnerships.component.scss']
})
export class ProjectPartnershipsComponent implements OnInit {

  readonly PartnershipType = PartnershipType;
  readonly PartnershipAgreementStatus = PartnershipAgreementStatus;

  partnerships: Partnership[] = [];
  adding = false;

  private opened: Partnership | null;

  constructor(private projectViewState: ProjectViewStateService) {
  }

  ngOnInit() {
    this.projectViewState.project.subscribe(project => {
      this.partnerships = project.partnerships;
    });
  }

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

    this.projectViewState.change({partnerships: {added: partnership}});
    this.partnerships = [...this.partnerships, partnership];
    this.adding = false;
  }

  onCancel(): void {
    this.adding = false;
  }

  onDelete(partnership: Partnership): void {
    this.projectViewState.change({partnerships: {removed: partnership}});
    this.partnerships = this.partnerships.filter(current => current.id !== partnership.id);
  }
}
