import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Language } from '../../core/models/language';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-project-languages',
  templateUrl: './project-languages.component.html',
  styleUrls: ['./project-languages.component.scss']
})
export class ProjectLanguagesComponent implements OnInit {

  languages: Language[];
  listedLanguages: Language[] = [];
  filteredLanguages: Language[];
  addingLanguage = false;

  searchLanguage: FormControl = new FormControl();

  constructor(private languageService: LanguageService) {
  }

  ngOnInit() {
    this.languages = this.languageService.getLanguages();
    this.filteredLanguages = this.languages;
    const newFilter = this.languages;
    this.searchLanguage
      .valueChanges
      .subscribe((searchTerm) => {
        if (searchTerm.length > 0) {
          this.filteredLanguages = this.filteredLanguages.filter((element) => element.name.search(searchTerm) > -1);
        } else {
          newFilter.map((ele, index) => {
            const final = this.listedLanguages.filter(element => element.id === ele.id);
            if (final.length > 0) {
              newFilter.splice(index, 1);
            }
          });
          this.filteredLanguages = newFilter;
        }
      });
  }

  onSelectLanguage() {
    const selectedLang = this.languages.filter((element) => element.id === this.searchLanguage.value)[0];
    this.listedLanguages.push(selectedLang);
    this.filteredLanguages = this.filteredLanguages.filter((element) => element.id !== selectedLang.id);
    this.flipState();
    this.searchLanguage.setValue('');
  }

  onDelete(langId) {
    this.listedLanguages.map((element, index) => {
      if (element.id === langId) {
        this.listedLanguages.splice(index, 1);
        this.filteredLanguages.push(element);
      }
    });
  }

  flipState() {
    this.addingLanguage = !this.addingLanguage;
  }

  trackLanguageById(index: number, language: Language) {
    return language.id;
  }

}
