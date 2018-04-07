import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  requestAccessForm: FormGroup = this.fb.group({
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
    confirmPassword: ['',
      [
        Validators.required
      ]
    ]
  });

  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private router: Router,
              private logService: LoggerService) {
  }

  ngOnInit() {
  }

  onRequestAccess() {
    const userObj: IUserRequestAccess = {
      firstName: this.requestAccessForm.value.firstName,
      lastName: this.requestAccessForm.value.lastName,
      email: this.requestAccessForm.value.email,
      password: this.requestAccessForm.value.password,
      organization: this.requestAccessForm.value.organization,
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


}
