import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { AbstractViewState } from '@app/core/abstract-view-state';
import { Internship } from '@app/core/models/internship';
import { Organization } from '@app/core/models/organization';
import { Partnership, PartnershipAgreementStatus, PartnershipType } from '@app/core/models/partnership';
import { Project } from '@app/core/models/project';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';

@Component({
  selector: 'app-partnerships',
  templateUrl: './partnerships.component.html',
  styleUrls: ['./partnerships.component.scss'],
})
export class PartnershipsComponent extends SubscriptionComponent implements OnInit {

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

  constructor(
    private fb: FormBuilder,
    private viewState: AbstractViewState<Project | Internship, unknown>,
  ) {
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
    const result = this.viewState.fb.array({
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

    this.viewState.change({ partnerships: { add: partnership } });
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
