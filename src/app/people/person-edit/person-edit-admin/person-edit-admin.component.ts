import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { TitleAware } from '@app/core/decorators';
import { enableControl } from '@app/core/util';
import { takeUntil } from 'rxjs/operators';
import { UserViewStateService } from '../../user-view-state.service';
import { AbstractPersonComponent } from '../abstract-person.component';

@Component({
  selector: 'app-person-edit-admin',
  templateUrl: './person-edit-admin.component.html',
  styleUrls: ['./person-edit-admin.component.scss'],
})
@TitleAware('Edit Admin Settings')
export class PersonEditAdminComponent extends AbstractPersonComponent implements OnInit {
  form = this.formBuilder.group({
    roles: [[]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private viewStateService: UserViewStateService,
    public dialog: MatDialog,
    userViewState: UserViewStateService,
  ) {
    super(userViewState);
  }

  get roles(): AbstractControl {
    return this.form.get('roles')!;
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.viewStateService.isSubmitting
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(submitting => {
        enableControl(this.form, !submitting);
      });

    this.user$.subscribe(user => {
      this.roles.patchValue(user.roles, { emitEvent: false });
    });
  }
}
