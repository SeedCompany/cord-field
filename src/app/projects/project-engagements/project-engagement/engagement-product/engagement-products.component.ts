import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { BibleBook } from '@app/core/models/bible-book';
import { Product, ProductMedium, ProductMethodology, ProductPurpose, ProductType } from '@app/core/models/product';
import { generateObjectId, twoWaySync } from '@app/core/util';
import { EngagementViewStateService } from '@app/projects/engagement-view-state.service';
import { SubscriptionComponent } from '@app/shared/components/subscription.component';
import { Observable } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-engagement-products',
  templateUrl: './engagement-products.component.html',
  styleUrls: ['./engagement-products.component.scss'],
})
export class EngagementProductsComponent extends SubscriptionComponent implements OnInit {

  readonly BibleBook = BibleBook;
  readonly ProductType = ProductType;
  readonly ProductPurpose = ProductPurpose;
  readonly ProductMedium = ProductMedium;
  readonly ProductMethodology = ProductMethodology;

  products: FormArray;
  addProduct: (product?: Product) => void;
  deleteProduct: (index: number) => void;

  private opened: number | null;

  constructor(
    private viewState: EngagementViewStateService,
    private fb: FormBuilder,
  ) {
    super();
  }

  ngOnInit() {
    const { control, add, remove } = this.viewState.fb.array({
      field: 'products',
      createControl: this.createControl,
      unsubscribe: this.unsubscribe,
    });
    this.products = control;

    this.addProduct = product => {
      add(product);
      this.opened = this.products.length - 1;
    };

    this.deleteProduct = i => {
      remove(i);
      this.opened = null;
    };

    // No products open by default
    this.opened = null;
  }

  isOpened(index: number): boolean {
    return this.opened === index;
  }

  onOpen(index: number): void {
    this.opened = index;
  }

  onClose(index: number): void {
    // Ensure index has not already changed before clearing.
    // This is because open() can get called right before close().
    if (this.opened === index) {
      this.opened = null;
    }
  }

  private createControl = (product: Product | undefined, remove: Observable<any>) => {
    const fg = this.fb.group({
      id: [product ? product.id : generateObjectId()],
      name: [product ? product.name : null, Validators.required],
      books: [product ? product.books : []],
      mediums: [product ? product.mediums : []],
      purposes: [product ? product.purposes : []],
      methodology: [product ? product.methodology : null],
      approach: [product ? product.approach : null],
    });

    // Link type and books controls, because values are related
    const booksCtl = fg.get('books')!;
    const typeCtl = fg.get('name')!;
    const [booksChangingFromType, rejectChangesFromType] = twoWaySync();
    booksCtl.valueChanges
      .pipe(
        rejectChangesFromType,
        filter(() => !ProductType.SpecialTypes.includes(typeCtl.value)),
        map(ProductType.fromBooks),
        takeUntil(remove),
      )
      .subscribe(type => {
        typeCtl.setValue(type);
      });
    typeCtl.valueChanges
      .pipe(
        map(ProductType.booksFromType),
        filter(books => books !== null),
        takeUntil(remove),
        booksChangingFromType,
      )
      .subscribe(books => {
        booksCtl.setValue(books);
      });

    return fg;
  };
}
