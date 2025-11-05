'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ShoppingCartIcon, HeartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations('navigation');

  const navigation = [
    { name: t('products'), href: '/products' },
    { name: t('categories'), href: '/categories' },
    { name: t('offers'), href: '/offers' },
    { name: t('contact'), href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-oxal-verdigris border-b border-oxal-desert shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-white">
              Oxal
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-white hover:text-oxal-sandstone hover:bg-secondary-600 px-3 py-2 text-sm font-medium transition-all rounded-md"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="p-2 rounded-md text-white hover:text-oxal-sandstone hover:bg-secondary-600 transition-all">
              <UserIcon className="h-6 w-6" />
            </Link>

            <button className="p-2 rounded-md text-white hover:text-oxal-sandstone hover:bg-secondary-600 transition-all relative">
              <HeartIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-secondary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>

            <button className="p-2 rounded-md text-white hover:text-oxal-sandstone hover:bg-secondary-600 transition-all relative">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-secondary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-white hover:text-oxal-sandstone"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-oxal-desert py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-white hover:text-oxal-sandstone hover:bg-secondary-600 rounded-md transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}