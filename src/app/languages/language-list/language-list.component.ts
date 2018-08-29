import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent, Sort } from '@angular/material';
import { TitleAware } from '@app/core/decorators';
import { LanguageListItem } from '@app/core/models/language';
import { LanguageService } from '@app/core/services/language.service';
import { LanguageListFilterComponent } from '@app/languages/language-list/language-list-filter/language-list-filter.component';
import { combineLatest } from 'rxjs';
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

  readonly displayedColumns: Array<keyof LanguageListItem> = ['name', 'locations', 'ethnologueCode', 'activeProjects'];
  readonly pageSizeOptions = [10, 25, 50];

  languageSource = new MatTableDataSource<LanguageListItem>();
  totalCount = 0;
  filtersActive = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(LanguageListFilterComponent) filtersComponent: LanguageListFilterComponent;

  constructor(private languageService: LanguageService) {
  }

  ngAfterViewInit() {

    combineLatest(
      this.sort.sortChange
        .pipe(
          tap(() => this.paginator.pageIndex = 0),
          startWith({active: 'updated', direction: 'desc'} as Sort)
        ),
      this.paginator.page
        .pipe(startWith({pageIndex: 0, pageSize: 10, length: 0} as PageEvent)),
      this.filtersComponent.filters
        .pipe(startWith({}))
    )
      .pipe(switchMap(([sort, page, filters]) => {
        this.filtersActive = Object.keys(filters).length > 0;


        return this.languageService.getLanguages(
          sort.active as keyof LanguageListItem,
          sort.direction,
          page.pageIndex * page.pageSize,
          page.pageSize,
          filters
        );
      }))
      .subscribe((data) => {
        this.languageSource.data = data.languages;
        this.totalCount = data.total;
      });
  }

  onClearFilters() {
    this.filtersComponent.reset();
  }
}
