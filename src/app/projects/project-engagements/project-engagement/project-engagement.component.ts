import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleAware, TitleProp } from '@app/core/decorators';
import { BibleBook } from '@app/core/models/bible-book';
import { EditableEngagement, Engagement, EngagementStatus } from '@app/core/models/engagement';
import { Product, ProductMedium, ProductMethodology, ProductPurpose, ProductType } from '@app/core/models/product';
import { Project, ProjectType } from '@app/core/models/project';
import { IsDirty } from '@app/core/route-guards/dirty.guard';
import { EngagementService } from '@app/core/services/engagement.service';
import { ProjectService } from '@app/core/services/project.service';
import { enableControl, filterRequired, generateObjectId, Omit, twoWaySync } from '@app/core/util';
import { ProjectViewStateService } from '@app/projects/project-view-state.service';
import { popInOut } from '@app/shared/animations';
import { emptyOptions, StatusOptions } from '@app/shared/components/status-select-workflow/status-select-workflow.component';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { BehaviorSubject, combineLatest, merge, Observable, Unsubscribable } from 'rxjs';
import { filter, map, startWith, takeUntil } from 'rxjs/operators';

interface EngagementForm extends Omit<EditableEngagement, 'tags'> {
  isLukePartnership: boolean;
  isFirstScripture: boolean;
  isCeremonyPlanned: boolean;
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

  project: Project;
  private readonly _engagement = new BehaviorSubject<Engagement | undefined>(undefined);
  readonly engagement$: Observable<Engagement> = this._engagement.pipe(filterRequired());

  form = this.formBuilder.group({
    status: [],
    products: this.formBuilder.array([]),
    isLukePartnership: [false],
    isFirstScripture: [false],
    completeDate: [null],
    disbursementCompleteDate: [null],
    communicationsCompleteDate: [null],
    isCeremonyPlanned: [false],
    ceremonyEstimatedDate: [null],
    ceremonyActualDate: [null],
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

  get ceremonyName() {
    return this.project.type === ProjectType.Translation ? 'dedication' : 'certification';
  }

  get products(): FormArray {
    return this.form.get('products') as FormArray;
  }

  get completeDate(): AbstractControl {
    return this.form.get('completeDate')!;
  }

  get disbursementCompleteDate(): AbstractControl {
    return this.form.get('disbursementCompleteDate')!;
  }

  get communicationsCompleteDate(): AbstractControl {
    return this.form.get('communicationsCompleteDate')!;
  }

  get isCeremonyPlanned(): AbstractControl {
    return this.form.get('isCeremonyPlanned')!;
  }

  get ceremonyEstimatedDate(): AbstractControl {
    return this.form.get('ceremonyEstimatedDate')!;
  }

  get ceremonyActualDate(): AbstractControl {
    return this.form.get('ceremonyActualDate')!;
  }

  ngOnInit(): void {
    const project$ = this.projectViewState.project.pipe(takeUntil(this.unsubscribe));
    project$.subscribe(p => this.project = p);

    const id$ = this.route.params.pipe(map(({ id }) => id));
    combineLatest(project$, id$)
      .pipe(
        map(([project, id]) => project.engagements.find(e => e.id === id)),
      )
      .subscribe(this._engagement);

    this.engagement$.subscribe(engagement => {
      const { id, language, possibleStatuses, updatedAt, tags, initialEndDate, currentEndDate, products, ...editable } = engagement;
      const value: Omit<EngagementForm, 'products'> = {
        ...editable,
        isLukePartnership: engagement.hasTag('luke_partnership'),
        isFirstScripture: engagement.hasTag('first_scripture'),
        isCeremonyPlanned: engagement.hasTag('ceremony_planned'),
      };
      this.form.reset(value, { emitEvent: false });

      // Remove old items in reverse order because FormArray re-indexes on removal
      // which would screw up both our for-loop and the index to remove.
      for (let i = this.products.length - 1; i >= 0; i--) {
        this.deleteProduct(i);
      }
      for (const product of products) {
        this.addProduct(product);
      }
      // No products open by default
      this.productOpened = null;
    });

    merge(
      this.engagement$.pipe(map(e => e.hasTag('ceremony_planned'))),
      this.isCeremonyPlanned.valueChanges,
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(planned => {
        enableControl(this.ceremonyEstimatedDate, planned);
        enableControl(this.ceremonyActualDate, planned);
      });
  }

  findAvailableStatuses = (status: EngagementStatus): StatusOptions<EngagementStatus> => {
    return this.engagement ? this.engagementService.getAvailableStatuses(this.engagement) : emptyOptions;
  };

  async onSave(): Promise<void> {
    const engagement = this.engagement;
    if (!engagement) {
      return;
    }

    const {
      isLukePartnership,
      isFirstScripture,
      isCeremonyPlanned,
      ...other
    } = this.form.value as EngagementForm;
    const value: EditableEngagement = {...other, tags: []};
    if (isLukePartnership) {
      value.tags.push('luke_partnership');
    }
    if (isFirstScripture) {
      value.tags.push('first_scripture');
    }
    if (isCeremonyPlanned) {
      value.tags.push('ceremony_planned');
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

  addProduct(product?: Product) {
    const fg = this.createProductControl(product);

    // Link type and books controls, because values are related
    const booksCtl = fg.get('books')!;
    const typeCtl = fg.get('name')!;
    const [booksChangingFromType, rejectChangesFromType] = twoWaySync();
    const sub = booksCtl.valueChanges
      .pipe(
        rejectChangesFromType,
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
        booksChangingFromType,
      )
      .subscribe(books => {
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
      name: [product ? product.name : null, Validators.required],
      books: product ? product.books : [],
      mediums: [product ? product.mediums : []],
      purposes: [product ? product.purposes : []],
      methodology: [product ? product.methodology : null],
      approach: product ? product.approach : null,
    });
  }
}
