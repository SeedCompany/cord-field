import { Component, OnInit } from '@angular/core';
import { Language } from '@app/core/models/language';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { takeUntil } from 'rxjs/operators';

import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-languages',
  templateUrl: './project-languages.component.html',
  styleUrls: ['./project-languages.component.scss']
})
export class ProjectLanguagesComponent extends SubscriptionComponent implements OnInit {

  languages: Language[] = [];
  addingLanguage = false;

  constructor(private projectViewState: ProjectViewStateService) {
    super();
  }

  ngOnInit() {
    this.projectViewState.project
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(project => {
        this.languages = project.languages;
      });
  }

  onSelect(language: Language) {
    this.projectViewState.change({languages: {add: language}});
    this.addingLanguage = false;
  }

  onCancel() {
    this.addingLanguage = false;
  }

  onDelete(language: Language) {
    this.projectViewState.change({languages: {remove: language}});
    this.languages = this.languages.filter(current => current.id !== language.id);
  }

  trackLanguageById(index: number, language: Language) {
    return language.id;
  }
}
