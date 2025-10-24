import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../types/container.types';

// This will be our main DI container
export const container = new Container();

// We'll configure bindings here as we create services and repositories
// Example binding (uncomment when you have actual implementations):
// container.bind<IProductService>(TYPES.ProductService).to(ProductService);

export { TYPES };