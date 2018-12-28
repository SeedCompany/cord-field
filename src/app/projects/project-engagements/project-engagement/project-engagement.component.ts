import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleAware, TitleProp } from '@app/core/decorators';
import { BibleBook } from '@app/core/models/bible-book';
import { Engagement, EngagementStatus, ModifiedEngagement } from '@app/core/models/engagement';
import { Product, ProductMedium, ProductMethodology, ProductPurpose, ProductType } from '@app/core/models/product';
import { IsDirty } from '@app/core/route-guards/dirty.guard';
import { EngagementService } from '@app/core/services/engagement.service';
import { ProjectService } from '@app/core/services/project.service';
import { enableControl, filterRequired, generateObjectId } from '@app/core/util';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { popInOut } from '@app/shared/animations';
import { StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { DateTime } from 'luxon';
import { BehaviorSubject, combineLatest, Observable, Unsubscribable } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

interface EngagementForm {
  status: EngagementStatus;
  products: Product[];
  isLukePartnership: boolean;
  isFirstScripture: boolean;
  isDedicationPlanned: boolean;
  dedicationDate: DateTime | null;
}

@Component({
  selector: 'app-project-engagement',
  templateUrl: './project-engagement.component.html',
  styleUrls: ['./project-engagement.component.scss'],
  animations: [popInOut],
})
@TitleAware()
export class ProjectEngagementComponent extends SubscriptionComponent implements OnInit, TitleProp, IsDirty {

  readonly EngagementStatus = EngagementStatus;
  readonly BibleBook = BibleBook;
  readonly ProductType = ProductType;
  readonly ProductPurpose = ProductPurpose;
  readonly ProductMedium = ProductMedium;
  readonly ProductMethodology = ProductMethodology;

  private readonly _engagement = new BehaviorSubject<Engagement | undefined>(undefined);
  readonly engagement$: Observable<Engagement> = this._engagement.pipe(filterRequired());

  form = this.formBuilder.group({
    status: [],
    products: this.formBuilder.array([]),
    isLukePartnership: [false],
    isFirstScripture: [false],
    isDedicationPlanned: [false],
    dedicationDate: [null],
  });

  private productOpened: number | null;
  private productBooksChangeSubs: { [id: string]: Unsubscribable } = {};

  constructor(private route: ActivatedRoute,
              private engagementService: EngagementService,
              private formBuilder: FormBuilder,
              private projectViewState: ProjectViewStateService,
              private projectService: ProjectService,
              private router: Router,
              private snackBar: MatSnackBar) {
    super();
  }

  get engagement() {
    return this._engagement.value;
  }

  get title() {
    return this.engagement$.pipe(
      map(e => e.language.displayName),
      startWith(''),
    );
  }

  get isDirty() {
    return this.form.dirty;
  }

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  get isDedicationPlanned(): AbstractControl {
    return this.form.get('isDedicationPlanned')!;
  }

  get dedicationDate(): AbstractControl {
    return this.form.get('dedicationDate')!;
  }

  ngOnInit(): void {
    const project$ = this.projectViewState.project.pipe(takeUntil(this.unsubscribe));
    const id$ = this.route.params.pipe(map(({ id }) => id));
    combineLatest(project$, id$)
      .pipe(
        map(([project, id]) => project.engagements.find(e => e.id === id)),
      )
      .subscribe(this._engagement);

    this.engagement$.subscribe(engagement => {
      const { status, products, isDedicationPlanned, dedicationDate } = engagement;
      const value: EngagementForm = {
        status,
        products,
        isLukePartnership: engagement.tags.some(tag => tag === 'luke_partnership'),
        isFirstScripture: engagement.tags.some(tag => tag === 'first_scripture'),
        isDedicationPlanned,
        dedicationDate,
      };

      this.form.reset(value, { emitEvent: false });
    });

    this.isDedicationPlanned.valueChanges
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(value => {
        enableControl(this.dedicationDate, value);
      });
  }

  findAvailableStatuses = (status: EngagementStatus): StatusOptions<EngagementStatus> => {
    return this.engagement ? this.projectService.getAvailableEngagementStatuses(this.engagement) : [];
  };

  async onSave(): Promise<void> {
    const engagement = this.engagement;
    if (!engagement) {
      return;
    }

    const {isLukePartnership, isFirstScripture, ...other} = this.form.value as EngagementForm;
    const value: ModifiedEngagement = {...other, tags: []};
    if (isLukePartnership) {
      value.tags.push('luke_partnership');
    }
    if (isFirstScripture) {
      value.tags.push('first_scripture');
    }

    this.form.disable();
    try {
      await this.engagementService.save(engagement.id, value);
    } catch (err) {
      this.snackBar.open('Failed to save engagement', undefined, { duration: 3000 });
      return;
    } finally {
      this.form.enable();
    }
    this.projectViewState.updateEngagement(engagement.withChanges(value));
  }

  onDiscard() {
    this.form.reset({});
  }

  addProduct() {
    const fg = this.createProductControl();

    // Link type and books controls, because values are related
    const booksCtl = fg.get('books')!;
    const typeCtl = fg.get('type')!;
    let booksChangingFromType = false;
    const sub = booksCtl.valueChanges
      .pipe(
        // Avoid infinite loop.
        // If books is changing because type change, then don't try to change type.
        filter(() => {
          if (booksChangingFromType) {
            booksChangingFromType = false;
            return false;
          }
          return true;
        }),
        filter(() => !ProductType.SpecialTypes.includes(typeCtl.value)),
        map(ProductType.fromBooks),
        takeUntil(this.unsubscribe),
      )
      .subscribe(type => {
        typeCtl.setValue(type);
      });
    const sub2 = typeCtl.valueChanges
      .pipe(
        map(ProductType.booksFromType),
        filter(books => books !== null),
        takeUntil(this.unsubscribe),
      )
      .subscribe(books => {
        booksChangingFromType = true;
        booksCtl.setValue(books);
      });
    sub.add(sub2);

    this.products.push(fg);
    this.productBooksChangeSubs[fg.value.id] = sub;
    this.productOpened = this.products.length - 1;
  }

  deleteProduct(index: number) {
    const product = this.products.at(index).value as Product;
    this.productBooksChangeSubs[product.id].unsubscribe();
    this.products.removeAt(index);
    this.productOpened = null;
  }

  isProductOpened(index: number): boolean {
    return this.productOpened === index;
  }

  onProductOpen(index: number): void {
    this.productOpened = index;
  }

  onProductClose(index: number): void {
    // Ensure index has not already changed before clearing.
    // This is because open() can get called right before close().
    if (this.productOpened === index) {
      this.productOpened = null;
    }
  }

  private createProductControl(product?: Product) {
    return this.formBuilder.group({
      id: product ? product.id : generateObjectId(),
      type: [product ? product.type : null, Validators.required],
      books: product ? product.books : [],
      mediums: [product ? product.mediums : [], Validators.required],
      purposes: [product ? product.purposes : [], Validators.required],
      methodology: [product ? product.methodology : null, Validators.required],
      approach: product ? product.approach : null,
    });
  }
}
