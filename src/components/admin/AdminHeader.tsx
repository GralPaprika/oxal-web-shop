import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { ReactNode } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface AdminHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  showBackButton?: boolean;
  backButtonHref?: string;
  rightContent?: ReactNode;
}

export function AdminHeader({ 
  breadcrumbs, 
  showBackButton = false, 
  backButtonHref = '/admin/dashboard',
  rightContent 
}: AdminHeaderProps) {
  return (
    <div className="bg-white border-b border-neutral-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {showBackButton && (
              <Link href={backButtonHref} className="mr-4">
                <ArrowLeftIcon className="h-5 w-5 text-text-secondary hover:text-amber-600 transition-colors" />
              </Link>
            )}
            <h1 className="text-2xl font-bold text-amber-600">Oxal</h1>
            
            {/* Breadcrumbs */}
            <nav className="ml-3 flex items-center text-sm text-text-secondary">
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <span className="mx-2">/</span>}
                  {index === 0 && <span>/</span>}
                  {item.href && !item.current ? (
                    <Link 
                      href={item.href} 
                      className="ml-2 hover:text-amber-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className={`ml-2 ${item.current ? 'text-text-primary font-medium' : ''}`}>
                      {item.label}
                    </span>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          {/* Right side content - flexible area for each page */}
          {rightContent && (
            <div className="flex items-center space-x-4">
              {rightContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}