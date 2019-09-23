import { Component, OnInit } from '@angular/core';
import { Language } from '@app/core/models/language';
import { User } from '@app/core/models/user';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { UserService } from '@app/core/services/user.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-languages',
  templateUrl: './project-languages.component.html',
  styleUrls: ['./project-languages.component.scss'],
})
export class ProjectLanguagesComponent extends SubscriptionComponent implements OnInit {

  languages: Language[] = [];
  addingLanguage = false;
  canAdd = false;
  isAdmin = false;

  constructor(private viewStateService: ProjectViewStateService,
              private userService: UserService,
              private authService: AuthenticationService) {
    super();
  }

  ngOnInit() {
    combineLatest([
      this.viewStateService.projectWithChanges,
      this.isUserAdmin(),
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(async ([project]) => {
        this.languages = project.languages;
        if (this.isAdmin && project.status === 'active') {
          this.canAdd = true;
        }
      });
  }

  onSelect(language: Language) {
    this.viewStateService.change({languages: {add: language}});
    this.addingLanguage = false;
  }

  onCancel() {
    this.addingLanguage = false;
  }

  onDelete(language: Language) {
    this.viewStateService.change({languages: {remove: language}});
    this.languages = this.languages.filter(current => current.id !== language.id);
  }

  trackLanguageById(index: number, language: Language) {
    return language.id;
  }

  async isUserAdmin() {
    const currentUser = await this.authService.getCurrentUser();
    if (currentUser !== null) {
      if (await this.userService.isAdmin(currentUser)) {
        this.isAdmin = true;
      }
    }
  }
}
