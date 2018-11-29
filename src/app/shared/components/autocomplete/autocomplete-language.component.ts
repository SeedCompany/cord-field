import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ValueAccessorProvider } from '@app/core/classes/abstract-value-accessor.class';
import { Language } from '@app/core/models/language';
import { LanguageService } from '@app/core/services/language.service';

import { AutocompleteComponent } from './autocomplete.component';

@Component({
  selector: 'app-autocomplete-language',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  providers: [
    ValueAccessorProvider(AutocompleteLanguageComponent),
  ],
})
export class AutocompleteLanguageComponent extends AutocompleteComponent<Language> {

  @Input() placeholder = 'Languages';
  @Input() requiredMessage = 'Please enter a language';
  @Input() serverErrorMessage = 'Failed to fetch languages';
  @Input() displayItem = (language: Language) => language.nameOrDisplayName;
  @Input() trackBy = (language: Language) => language.nameOrDisplayName;
  @Input() fetcher = (term: string) => this.languageService.search(term);

  constructor(
    private languageService: LanguageService,
    snackBar: MatSnackBar,
  ) {
    super(snackBar);
  }
}
