export { products } from './products.table';
export { productsMetadata } from './products-metadata.table';
export { productImages } from './product-images.table';
export { productCategories } from './product-categories.table';

import { products } from './products.table';
import { productsMetadata } from './products-metadata.table';
import { productImages } from './product-images.table';
import { productCategories } from './product-categories.table';

export const schemaMap = {
  products,
  productsMetadata,
  productImages,
  productCategories,
} as const;

export type Tables = typeof schemaMap;

export default schemaMap;
