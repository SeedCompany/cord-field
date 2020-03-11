import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Internship, InternshipFilter, InternshipListItem, InternshipStatus } from '@app/core/models/internship';
import { Role } from '@app/core/models/role';
import { User } from '@app/core/models/user';
import { InternshipService } from '@app/core/services/internship.service';
import { ObservablesWithInitialMapping, parseBoolean, TypedSort } from '@app/core/util';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import {
  defaultParamsFromChanges,
  defaultParseParams,
  PSChanges,
  QueryParams,
  RawQueryParams,
} from '@app/shared/components/table-view/table-view.component';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { TitleAware, TitleProp } from '../../core/decorators';

interface ListOption {
  label: string;
  value: boolean;
}

type Keys = keyof InternshipListItem;

interface InternshipQueryParams extends QueryParams<Keys> {
  all: boolean;
}

interface InternshipViewOptions extends PSChanges<Keys, InternshipFilter> {
  list: ListOption;
}

@Component({
  templateUrl: './internship-list.component.html',
  styleUrls: ['./internship-list.component.scss'],
})
@TitleAware()
export class InternshipListComponent extends SubscriptionComponent implements OnInit, TitleProp {

  readonly InternshipStatus = InternshipStatus;

  readonly displayedColumns: Keys[] = ['name', 'updatedAt', 'status', 'interns'];
  readonly defaultSort: TypedSort<Keys> = {
    active: 'updatedAt',
    direction: 'desc',
  };
  readonly defaultPageSize = 10;

  readonly listSelectorOptions: ListOption[] = [
    { label: 'My Internships', value: true },
    { label: 'All Internships', value: false },
  ];
  listSelection = this.listSelectorOptions[0];
  readonly listChanges = new BehaviorSubject<ListOption>(this.listSelection);

  constructor(
    private internships: InternshipService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  fetchData = this.internships.list;
  extraInputs: ObservablesWithInitialMapping<{ list: ListOption }> = {
    list: {
      stream: this.listChanges.pipe(
        startWith(this.listSelection), // Start with current value
        distinctUntilChanged(), // Don't emit if no change
      ),
      initial: this.listSelection,
    },
  };

  /**
   * Set list selection from query params
   */
  queryParamChanges(params: InternshipQueryParams) {
    if (params.all) {
      this.listSelection = this.listSelectorOptions[1];
      // Emit change to keep distinctUntilChanged happy in extraInputs above
      this.listChanges.next(this.listSelection);
    }
  }

  /**
   * If my internships are empty and user hasn't manually specified my internships list,
   * then show all internships instead.
   */
  dataFetched(total: number) {
    if (total > 0 || this.route.snapshot.queryParamMap.has('all')) {
      return;
    }
    this.router.navigate(['.'], {
      queryParams: { all: true },
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  /**
   * Add `all` to parsing logic
   */
  parseParams = (raw: RawQueryParams<InternshipQueryParams>): InternshipQueryParams => ({
    ...defaultParseParams<Keys>(this.defaultSort, this.defaultPageSize)(raw),
    all: raw.all != null ? parseBoolean(raw.all) : false,
  });

  /**
   * Add `all` to parsing logic
   */
  paramsFromChanges = (changes: InternshipViewOptions): Partial<InternshipQueryParams> => {
    return {
      ...defaultParamsFromChanges<Keys, InternshipFilter>(this.defaultSort, this.defaultPageSize)(changes),
      all: !changes.list.value ? true : this.route.snapshot.queryParamMap.has('all') ? false : undefined,
    };
  };

  ngOnInit(): void {
    // Hook up list clicks
    this.listChanges
      .pipe(
        takeUntil(this.unsubscribe),
      )
      .subscribe(selection => {
        this.listSelection = selection;
      });
  }

  get title() {
    return this.listChanges
      .pipe(
        startWith(this.listSelection),
        map(selection => selection.label),
      );
  }

  onInternClick(user: User) {
    this.router.navigate(['/people', user.id]);
  }

  trackByValue(index: number, value: any) {
    return value;
  }
}
