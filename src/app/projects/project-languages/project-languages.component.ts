import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/typings/autocomplete';
import { Observable } from 'rxjs/Observable';
import { Language } from '../../core/models/language';
import { LanguageService } from '../../core/services/language.service';
import { ProjectViewStateService } from '../project-view-state.service';

@Component({
  selector: 'app-project-languages',
  templateUrl: './project-languages.component.html',
  styleUrls: ['./project-languages.component.scss']
})
export class ProjectLanguagesComponent implements OnInit {

  languages: Language[] = [];
  addingLanguage = false;
  search = new FormControl();
  filteredLanguages: Observable<Language[]>;

  /** Autofocus search input when it is created */
  @ViewChild('searchInput') set searchInput(el: ElementRef | null) {
    if (el) {
      window.setTimeout(() => el.nativeElement.focus(), 0);
    }
  }

  constructor(private languageService: LanguageService,
              private projectViewState: ProjectViewStateService) {
  }

  ngOnInit() {
    this.projectViewState.project.subscribe(project => {
      this.languages = project.languages;
    });

    this.filteredLanguages = this.search
      .valueChanges
      .filter(term => term.length > 1)
      .debounceTime(300)
      .switchMap(term => this.languageService.search(term))
      .map((languages: Language[]) => {
        const currentIds = this.languages.map(language => language.id);
        return languages.filter(language => !currentIds.includes(language.id));
      });
  }

  onSelectLanguage(event: MatAutocompleteSelectedEvent) {
    const language = event.option.value as Language;
    this.projectViewState.change({languages: {added: language}});
    this.languages.push(language);
    this.addingLanguage = false;
    this.search.setValue('');
  }

  onCancel() {
    if (this.search.value) {
      this.search.setValue('');
    } else {
      this.addingLanguage = false;
    }
  }

  onDelete(language: Language) {
    this.projectViewState.change({languages: {removed: language}});
    this.languages = this.languages.filter(current => current.id !== language.id);
  }

  trackLanguageById(index: number, language: Language) {
    return language.id;
  }
}
