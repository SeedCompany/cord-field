import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';

import { Organization } from '../../core/models/organization';
import { Partnership, PartnershipAgreementStatus, PartnershipType } from '../../core/models/partnership';
import { SubscriptionComponent } from '../../shared/components/subscription.component';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-partnerships',
  templateUrl: './project-partnerships.component.html',
  styleUrls: ['./project-partnerships.component.scss'],
})
export class ProjectPartnershipsComponent extends SubscriptionComponent implements OnInit {

  readonly PartnershipType = PartnershipType;
  readonly PartnershipAgreementStatus = PartnershipAgreementStatus;

  form = this.fb.group({
    partnerships: this.fb.array([]),
  });
  adding = false;
  private opened: number | null;

  get partnerships(): FormArray {
    return this.form.get('partnerships') as FormArray;
  }

  constructor(private fb: FormBuilder,
              private projectViewState: ProjectViewStateService) {
    super();
  }

  ngOnInit(): void {
    const createPartnershipControl = (partnership?: Partnership) => {
      if (!partnership) {
        throw new Error('Partnership expected');
      }
      return this.fb.group({
        id: [partnership.id],
        organization: [partnership.organization],
        types: [partnership.types],
        agreementStatus: [partnership.agreementStatus],
        mouStatus: [partnership.mouStatus],
      });
    };
    const result = this.projectViewState.fb.array({
      field: 'partnerships',
      createControl: createPartnershipControl,
      unsubscribe: this.unsubscribe,
    });
    this.form.setControl('partnerships', result.control);
    this.addPartnership = result.add;
    this.removePartnership = result.remove;
  }

  trackById(index: number, item: Partnership): string {
    return item.name;
  }

  isCardOpened(index: number): boolean {
    return this.opened === index;
  }

  onCardOpen(index: number): void {
    this.opened = index;
  }

  onCardClose(index: number): void {
    // Ensure index has not already changed before clearing.
    // This is because open() can get called right before close().
    if (this.opened === index) {
      this.opened = null;
    }
  }

  onSelect(org: Organization): void {
    const partnership = Partnership.fromOrganization(org);

    this.projectViewState.change({partnerships: {add: partnership}});
    this.addPartnership(partnership);

    this.opened = this.partnerships.length - 1;
    this.adding = false;
  }

  onDelete(index: number): void {
    this.removePartnership(index);
    this.opened = null;
  }

  // Stubbed - real method assigned in ngOnInit
  private addPartnership(partnership: Partnership): void {
  }

  // Stubbed - real method assigned in ngOnInit
  private removePartnership(index: number): void {
  }
}
