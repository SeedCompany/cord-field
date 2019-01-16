import { Component } from '@angular/core';
import { TitleAware } from '@app/core/decorators';
import { LanguageListFilter, LanguageListItem } from '@app/core/models/language';
import { LanguageService } from '@app/core/services/language.service';
import { TypedSort } from '@app/core/util';
import { QueryParams } from '@app/shared/components/table-view/table-view.component';
import { map } from 'rxjs/operators';

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

  fetchLanguages = ({ sort, dir, page, size }: QueryParams<keyof LanguageListItem>, filters: LanguageListFilter) => {
    return this.languageService
      .getLanguages(sort, dir, (page - 1) * size, size, filters)
      .pipe(
        map(({ languages, total }) => ({ data: languages, total })),
      );
  };
}
