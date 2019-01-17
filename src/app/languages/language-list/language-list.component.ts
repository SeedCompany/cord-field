import { Component } from '@angular/core';
import { TitleAware } from '@app/core/decorators';
import { LanguageListItem } from '@app/core/models/language';
import { LanguageService } from '@app/core/services/language.service';
import { TypedSort } from '@app/core/util';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss'],
})
@TitleAware('Languages')
export class LanguageListComponent {

  readonly displayedColumns: Array<keyof LanguageListItem> = ['displayName', 'locations', 'ethnologueCode', 'activeProjects'];
  readonly defaultSort: TypedSort<keyof LanguageListItem> = {
    active: 'displayName',
    direction: 'asc',
  };

  constructor(private languageService: LanguageService) {
  }

  fetchLanguages = this.languageService.getLanguages;
}
