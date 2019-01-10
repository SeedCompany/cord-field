import { BibleBook } from '@app/core/models/bible-book';
import { ProductApproach } from './product/approach';
import { ProductMedium } from './product/medium';
import { ProductMethodology } from './product/methodology';
import { ProductPurpose } from './product/purpose';
import { ProductType } from './product/type';

export { ProductApproach, ProductMedium, ProductMethodology, ProductPurpose, ProductType };

export class Product {
  id: string;
  name: ProductType;
  books: BibleBook[];
  mediums: ProductMedium[];
  purposes: ProductPurpose[];
  approach: ProductApproach; // TODO Maybe not needed in FE?
  methodology: ProductMethodology;

  static from(product: Product) {
    return Object.assign(new Product(), product);
  }
}
