import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { InternshipService } from '@app/core/services/internship.service';
import { TypedFormControl } from '@app/core/util';
import { InternshipViewStateService } from '@app/internships/internship-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';

@Component({
  selector: 'app-internship-name',
  templateUrl: './internship-name.component.html',
  styleUrls: ['./internship-name.component.scss'],
})
export class InternshipNameComponent extends SubscriptionComponent implements OnInit {

  name: TypedFormControl<string>;
  internship = this.viewState.subject;

  constructor(
    private viewState: InternshipViewStateService,
    private internships: InternshipService,
  ) {
    super();
  }

  isTaken = (name: string) => this.internships.isNameTaken(name);

  ngOnInit() {
    this.name = this.viewState.fb.control({
      field: 'name',
      unsubscribe: this.unsubscribe,
      validators: [Validators.required],
    });
  }
}
