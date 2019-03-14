import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { InternshipService } from '@app/core/services/internship.service';

@Component({
  templateUrl: './internship-create-dialog.component.html',
  styleUrls: ['./internship-create-dialog.component.scss'],
})
export class InternshipCreateDialogComponent {

  form = this.formBuilder.group({
    name: ['', Validators.required],
  });

  static open(dialog: MatDialog): MatDialogRef<InternshipCreateDialogComponent, any> {
    return dialog.open(InternshipCreateDialogComponent, {
      width: '400px',
    });
  }

  constructor(
    private formBuilder: FormBuilder,
    private internships: InternshipService,
    private router: Router,
  ) {
  }

  isNameTaken = (name: string) => this.internships.isNameTaken(name);

  onCreate = async ({ name }: { name: string }) => {
    const id = await this.internships.create(name);
    this.router.navigate(['/internships', id]);
  }
}
