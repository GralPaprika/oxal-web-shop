import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['es'], // Starting with Spanish only
  
  // Used when no locale matches
  defaultLocale: 'es',
  
  // The prefix for the default locale
  localePrefix: 'never' // Don't show /es in URLs since it's the only locale
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);