import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { ProjectType, projectTypeList, projectTypeToString } from '../../core/models/project';
import { ProjectService } from '../../core/services/project.service';

export interface ProjectCreationResult {
  name: string;
  type: ProjectType;
}

@Component({
  selector: 'app-project-create-dialog',
  templateUrl: './project-create-dialog.component.html',
  styleUrls: ['./project-create-dialog.component.scss']
})
export class ProjectCreateDialogComponent implements OnInit, OnDestroy {

  readonly types = projectTypeList;
  readonly typeToString = projectTypeToString;
  form: FormGroup;
  private subscribe = Subscription.EMPTY;

  constructor(public dialogRef: MatDialogRef<ProjectCreateDialogComponent>,
              private formBuilder: FormBuilder,
              private projectService: ProjectService) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      type: ['', Validators.required],
      name: ['', Validators.required]
    });
    this.subscribe = this.name.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((name: string) => {
      name = name.trim();
      if (name.length !== 0) {
        this.projectService.isProjectNameAvailable(name)
          .then(status => {
            if (status) {
              this.name.setErrors({'duplicate': status});
            }
          });
      }
    });
  }

  get type() {
    return this.form.get('type');
  }

  get name() {
    return this.form.get('name');
  }

  onClose() {
    this.dialogRef.close();
  }

  trackByValue(index, value) {
    return value;
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }
}
