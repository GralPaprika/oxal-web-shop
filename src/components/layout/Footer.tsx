'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-background-secondary border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary-600 mb-4">Oxal</h3>
            <p className="text-text-secondary mb-4 max-w-md">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              <Link 
                href="#" 
                className="text-text-secondary hover:text-primary-600 transition-colors"
              >
                {t('social.facebook')}
              </Link>
              <Link 
                href="#" 
                className="text-text-secondary hover:text-primary-600 transition-colors"
              >
                {t('social.instagram')}
              </Link>
              <Link 
                href="#" 
                className="text-text-secondary hover:text-primary-600 transition-colors"
              >
                {t('social.twitter')}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t('quickLinks.title')}</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  {t('quickLinks.about')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  {t('quickLinks.products')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  {t('quickLinks.contact')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  {t('quickLinks.faq')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-text-primary mb-4">{t('customerService.title')}</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/shipping" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  {t('customerService.shipping')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/returns" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  {t('customerService.returns')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  {t('customerService.privacy')}
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  {t('customerService.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-secondary text-sm">
            {t('copyright')}
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="text-text-secondary text-sm">{t('payment.accept')}</span>
            <div className="flex space-x-2">
              <span className="text-xs bg-neutral-100 px-2 py-1 rounded">Visa</span>
              <span className="text-xs bg-neutral-100 px-2 py-1 rounded">MC</span>
              <span className="text-xs bg-neutral-100 px-2 py-1 rounded">PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}