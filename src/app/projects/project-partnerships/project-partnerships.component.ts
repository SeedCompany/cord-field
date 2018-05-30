import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ISubscription } from 'rxjs/Subscription';
import { Organization } from '../../core/models/organization';
import { Partnership, PartnershipAgreementStatus, PartnershipType } from '../../core/models/partnership';
import { Project } from '../../core/models/project';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-partnerships',
  templateUrl: './project-partnerships.component.html',
  styleUrls: ['./project-partnerships.component.scss']
})
export class ProjectPartnershipsComponent implements OnInit, OnDestroy {

  readonly PartnershipType = PartnershipType;
  readonly PartnershipAgreementStatus = PartnershipAgreementStatus;

  form = this.fb.group({
    partnerships: this.fb.array([])
  });
  adding = false;
  private opened: number | null;
  private ngUnsubscribe = new Subject<void>();
  private subscriptions: {[id: string]: ISubscription} = {};

  get partnerships(): FormArray {
    return this.form.get('partnerships') as FormArray;
  }

  constructor(private fb: FormBuilder,
              private projectViewState: ProjectViewStateService) {
  }

  ngOnInit(): void {
    this.projectViewState.project.subscribe((project: Project | boolean) => {
      this.form.setControl('partnerships', this.fb.array([])); // reset form array
      if (project) {
        project = project as Project;
        project.partnerships.forEach(p => this.addPartnership(p));
      }
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  trackById(index: number, object: { id: string }): string {
    return object.id;
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
    const partnership = this.partnerships.at(index).value as Partnership; // Partnership-ish (matches form configuration)
    this.projectViewState.change({partnerships: {remove: partnership}});
    this.subscriptions[partnership.id].unsubscribe();
    this.partnerships.removeAt(index);
    this.opened = null;
  }

  private addPartnership(partnership: Partnership): void {
    // Configure the fields
    const fg = this.fb.group({
      id: '',
      organization: '',
      types: '',
      agreementStatus: '',
      mouStatus: ''
    } as {[key in keyof Partnership]: any});
    // set the values
    fg.reset(partnership);

    // listen for changes to update view state
    this.subscriptions[partnership.id] = fg.valueChanges
      .takeUntil(this.ngUnsubscribe)
      .map(Partnership.fromJson)
      .subscribe(p => this.projectViewState.change({partnerships: {update: p}}));

    this.partnerships.push(fg);
  }
}
