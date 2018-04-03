import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-request-access',
  templateUrl: './request-access.component.html',
  styleUrls: ['./request-access.component.scss']
})
export class RequestAccessComponent implements OnInit {

  requestAccessForm: FormGroup = this.fb.group({
    firstName: ['',
      [Validators.compose([
        Validators.required,
        Validators.min(5),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z ]{2,30}$/)
      ])]],
    lastName: ['', [Validators.compose([
      Validators.required,
      Validators.min(5),
      Validators.maxLength(20),
      Validators.pattern(/^[a-zA-Z ]{2,30}$/)
    ])]],
    email: ['', Validators.compose([
      Validators.required,
      Validators.pattern(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)])],
    organization: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  });

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
  }

}
