import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';
import { getProjectStages, ProjectSensitivities, ProjectStatus, projectTypeList } from '../../../core/models/project';

@Component({
  selector: 'app-project-list-filter',
  templateUrl: './project-list-filter.component.html',
  styleUrls: ['./project-list-filter.component.scss']
})
export class ProjectListFilterComponent implements OnInit {

  languages = [];
  form: FormGroup;
  readonly getProjectStages = getProjectStages;
  readonly ProjectStatus = ProjectStatus;
  readonly projectTypeList = projectTypeList;
  readonly projectSensitivities = ProjectSensitivities;

  constructor() {
  }

  ngOnInit() {
    this.form = new FormGroup({
      stage: new FormControl(),
      type: new FormControl(),
      sensitivity: new FormControl()
    });
    this.form.valueChanges.subscribe(val => {
      console.log(val);
    });
  }
  addLanguage(event: MatChipInputEvent) {
    const {input, value} = event;

    if ((value || '').trim()) {
      this.languages.push({name: value.trim()});
    }
    if (input) {
      input.value = '';
    }
  }

  removeLanguage(language: any) {
    const index = this.languages.indexOf(language);
    if (index >= 0) {
      this.languages.splice(index, 1);
    }
  }
}
