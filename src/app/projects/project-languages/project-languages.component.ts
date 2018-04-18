import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete/typings/autocomplete';
import { Observable } from 'rxjs/Observable';
import { Language } from '../../core/models/language';
import { LanguageService } from '../../core/services/language.service';

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
  @ViewChild('searchInput') set searchInput(el: ElementRef) {
    el.nativeElement.focus();
  }

  constructor(private languageService: LanguageService) {
  }

  ngOnInit() {
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
    this.languages.push(event.option.value);
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

  onDelete(id: string) {
    const index = this.languages.findIndex(language => language.id === id);
    if (index !== -1) {
      this.languages.splice(index, 1);
    }
  }

  trackLanguageById(index: number, language: Language) {
    return language.id;
  }
}
