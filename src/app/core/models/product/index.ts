import { BibleBook } from '@app/core/models/bible-book';
import { ProductApproach } from './approach';
import { ProductMedium } from './medium';
import { ProductMethodology } from './methodology';
import { ProductPurpose } from './purpose';
import { ProductType } from './type';

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
