'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCartIcon, HeartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/products' },
    { name: 'Categorías', href: '/categories' },
    { name: 'Ofertas', href: '/offers' },
    { name: 'Contacto', href: '/contact' },
  ];

  return (
    <header className="bg-background-primary border-b border-neutral-200">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Oxal
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-text-primary hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* User account */}
            <Link href="/auth/login" className="p-2 rounded-md text-text-secondary hover:text-primary-600">
              <UserIcon className="h-6 w-6" />
            </Link>

            {/* Wishlist */}
            <button className="p-2 rounded-md text-text-secondary hover:text-primary-600 relative">
              <HeartIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Shopping cart */}
            <button className="p-2 rounded-md text-text-secondary hover:text-primary-600 relative">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-text-secondary hover:text-primary-600"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 text-base font-medium text-text-primary hover:text-primary-600 hover:bg-neutral-50 rounded-md"
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