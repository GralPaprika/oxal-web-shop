import 'reflect-metadata';
// Re-export server container - this file should only be used on the server
export { serverContainer as container, TYPES } from './container.server';
