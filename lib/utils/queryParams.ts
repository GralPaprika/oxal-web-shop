/**
 * API query parameter parsing and validation utilities
 * Provides type-safe parameter extraction and validation for API routes
 */

import { NextRequest } from 'next/server';

/**
 * Parameter definition for query parsing
 */
export interface QueryParamDef<T = unknown> {
  type: 'string' | 'number' | 'boolean' | 'enum';
  required?: boolean;
  defaultValue?: T;
  enumValues?: readonly T[];
  min?: number;
  max?: number;
  transform?: (value: unknown) => T;
}

/**
 * Parsed query parameters result
 */
export interface ParsedQueryParams<T extends Record<string, unknown>> {
  success: true;
  data: T;
  errors?: never;
}

export interface QueryParseError {
  success: false;
  errors: string[];
  data?: never;
}

export type QueryParseResult<T extends Record<string, unknown>> =
  | ParsedQueryParams<T>
  | QueryParseError;

/**
 * Parse and validate query parameters from a NextRequest
 *
 * @example
 * const result = parseQueryParams(request, {
 *   page: { type: 'number', defaultValue: 1, min: 1 },
 *   pageSize: { type: 'number', defaultValue: 10, min: 1, max: 100 },
 *   search: { type: 'string' },
 *   status: { type: 'enum', enumValues: ['active', 'inactive', 'discontinued'] as const }
 * });
 *
 * if (result.success) {
 *   // result.data has type-safe parameters
 * } else {
 *   return NextResponse.json(ApiResponse.error(result.errors.join(', ')), { status: 400 });
 * }
 */
export function parseQueryParams<T extends Record<string, unknown>>(
  request: NextRequest,
  paramDefs: { [K in keyof T]: QueryParamDef<T[K]> }
): QueryParseResult<T> {
  const { searchParams } = new URL(request.url);
  const errors: string[] = [];
  const result = {} as T;

  for (const [paramName, def] of Object.entries(paramDefs) as [keyof T, QueryParamDef][]) {
    const stringValue = searchParams.get(paramName as string);
    const hasValue = stringValue !== null && stringValue !== '';

    // Check required parameters
    if (def.required && !hasValue) {
      errors.push(`Missing required parameter: ${String(paramName)}`);
      continue;
    }

    // Use default value if no value provided and not required
    if (!hasValue && def.defaultValue !== undefined) {
      result[paramName] = def.defaultValue as T[keyof T];
      continue;
    }

    // Skip optional parameters with no value
    if (!hasValue && !def.required) {
      continue;
    }

    try {
      let parsedValue: unknown = stringValue;

      // Parse based on type
      switch (def.type) {
        case 'number':
          const numValue = parseFloat(stringValue!);
          if (isNaN(numValue)) {
            errors.push(`Invalid number for parameter: ${String(paramName)}`);
            continue;
          }
          if (def.min !== undefined && numValue < def.min) {
            errors.push(`Parameter ${String(paramName)} must be >= ${def.min}`);
            continue;
          }
          if (def.max !== undefined && numValue > def.max) {
            errors.push(`Parameter ${String(paramName)} must be <= ${def.max}`);
            continue;
          }
          parsedValue = numValue;
          break;

        case 'boolean':
          if (stringValue === 'true') parsedValue = true;
          else if (stringValue === 'false') parsedValue = false;
          else {
            errors.push(`Invalid boolean for parameter: ${String(paramName)}`);
            continue;
          }
          break;

        case 'enum':
          if (def.enumValues && !def.enumValues.includes(parsedValue)) {
            errors.push(`Invalid value for parameter ${String(paramName)}: ${parsedValue}. Must be one of: ${def.enumValues.join(', ')}`);
            continue;
          }
          break;

        case 'string':
          // String values are already parsed
          break;

        default:
          errors.push(`Unknown parameter type for ${String(paramName)}`);
          continue;
      }

      // Apply custom transform if provided
      if (def.transform) {
        parsedValue = def.transform(parsedValue);
      }

      result[paramName] = parsedValue as T[keyof T];

    } catch (error) {
      errors.push(`Error parsing parameter ${String(paramName)}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: result };
}

/**
 * Common parameter definitions for reuse
 */
export const commonParamDefs = {
  pagination: {
    page: { type: 'number' as const, defaultValue: 1, min: 1 },
    pageSize: { type: 'number' as const, defaultValue: 10, min: 1, max: 100 }
  },

  sorting: {
    sortField: { type: 'enum' as const, enumValues: ['name', 'price', 'stock', 'createdAt', 'updatedAt'] as const },
    sortOrder: { type: 'enum' as const, enumValues: ['asc', 'desc'] as const, defaultValue: 'asc' as const }
  },

  productFilters: {
    search: { type: 'string' as const },
    category: { type: 'string' as const },
    status: { type: 'enum' as const, enumValues: ['active', 'inactive', 'discontinued'] as const },
    minPrice: { type: 'number' as const, min: 0 },
    maxPrice: { type: 'number' as const, min: 0 },
    inStock: { type: 'boolean' as const }
  }
} as const;