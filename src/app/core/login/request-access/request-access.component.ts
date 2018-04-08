import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { IUserRequestAccess } from '../../models/user';
import { AuthenticationService } from '../../services/authentication.service';
import { LoggerService } from '../../services/logger.service';

@Component({
  selector: 'app-request-access',
  templateUrl: './request-access.component.html',
  styleUrls: ['./request-access.component.scss']
})
export class RequestAccessComponent implements OnInit {

  form: FormGroup = this.fb.group({
    firstName: ['',
      [
        Validators.required,
        Validators.min(5),
        Validators.maxLength(20)
      ]
    ],
    lastName: ['',
      [
        Validators.required,
        Validators.min(5),
        Validators.maxLength(20)
      ]
    ],
    email: ['', Validators.email],
    organization: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required, this.validatePasswords]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private router: Router,
              private logService: LoggerService) {
  }

  ngOnInit() {
  }

  async validatePasswords(control: FormControl): Promise<null | {}> {
    if (!control.root) {
      return null;
    }
    const exactMatch = control.root.value.password === control.value;
    return exactMatch ? null : {mismatchedPassword: true};
  }

  onRequestAccess() {
    const userObj: IUserRequestAccess = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      email: this.form.value.email,
      password: this.form.value.password,
      organization: this.form.value.organization,
      domain: environment.services['domain']
    };

    this
      .authService
      .requestAccess(userObj)
      .toPromise()
      .then(() => this.router.navigate(['/login']))
      .catch((err) => this.logService.error(err, 'error at request access'));
  }

  onCancel() {
    this.router.navigate(['/login']);
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }


}
