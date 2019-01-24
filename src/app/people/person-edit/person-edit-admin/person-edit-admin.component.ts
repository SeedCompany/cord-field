import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router,
    private route: ActivatedRoute,
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
      if (!user.canEditRoles) {
        this.router.navigate(['..'], {
          replaceUrl: true,
          relativeTo: this.route,
        });
        return;
      }

      this.roles.patchValue(user.roles, { emitEvent: false });
    });
  }
}
