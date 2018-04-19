import { Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'app-project-list-filter',
  templateUrl: './project-list-filter.component.html',
  styleUrls: ['./project-list-filter.component.scss']
})
export class ProjectListFilterComponent {

  languages = [];

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
