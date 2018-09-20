import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';
import { TitleAware } from '@app/core/decorators';
import { LanguageListItem } from '@app/core/models/language';
import { LanguageService } from '@app/core/services/language.service';
import { TypedMatSort } from '@app/core/util';
import { LanguageListFilterComponent } from '@app/languages/language-list/language-list-filter/language-list-filter.component';
import { combineLatest, of as observableOf } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss'],
  animations: [
    trigger('slideRight', [
      state('shown', style({transform: 'translateX(0)'})),
      state('hidden', style({transform: 'translateX(200%)'})),
      transition('shown <=> hidden', animate('200ms ease-out'))
    ])
  ]
})
@TitleAware('Languages')
export class LanguageListComponent implements AfterViewInit {

  readonly displayedColumns: Array<keyof LanguageListItem> = ['displayName', 'locations', 'ethnologueCode', 'activeProjects'];
  readonly pageSizeOptions = [10, 25, 50];

  languageSource = new MatTableDataSource<LanguageListItem>();
  totalCount = 0;
  filtersActive = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: TypedMatSort<keyof LanguageListItem>;
  @ViewChild(LanguageListFilterComponent) filtersComponent: LanguageListFilterComponent;

  constructor(private languageService: LanguageService) {
  }

  ngAfterViewInit() {
    combineLatest(
      this.sort.sortChange
        .pipe(
          tap(() => this.paginator.pageIndex = 0),
          startWith({active: this.sort.active, direction: this.sort.direction})
        ),
      this.paginator.page
        .pipe(startWith({pageIndex: 0, pageSize: 10, length: 0} as PageEvent)),
      this.filtersComponent.filters
    )
      .pipe(switchMap(([sort, page, filters]) => {
        const languages = this.languageService.getLanguages(
          sort.active,
          sort.direction,
          page.pageIndex * page.pageSize,
          page.pageSize,
          filters
        );

        return combineLatest(
          languages,
          observableOf(filters)
        );
      }))
      .subscribe(([{languages, total}, filters]) => {
        this.languageSource.data = languages;
        this.totalCount = total;
        this.filtersActive = Object.keys(filters).length > 0;
      });
  }

  onClearFilters() {
    this.filtersComponent.reset();
  }
}
