'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { FiGlobe } from 'react-icons/fi';
import { FaInstagram, FaFacebook } from 'react-icons/fa';
import OxalLogo from '@/components/OxalLogo';

export default function Linktree() {
  const t = useTranslations('linktree');

  const links = [
    {
      id: 1,
      titleKey: 'website.title',
      descriptionKey: 'website.description',
      href: '/',
      icon: 'globe',
      color: 'bg-oxal-teak text-oxal-cream',
    },
    {
      id: 2,
      titleKey: 'instagram.title',
      descriptionKey: 'instagram.description',
      href: 'https://www.instagram.com/shop.oxal/',
      icon: 'instagram',
      color: 'bg-oxal-verdigris text-oxal-cream',
      external: true,
    },
    {
      id: 3,
      titleKey: 'facebook.title',
      descriptionKey: 'facebook.description',
      href: 'https://www.facebook.com/accesoriosOxal/',
      icon: 'facebook',
      color: 'bg-oxal-desert text-oxal-cream',
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-oxal-cream py-12 px-4">
      <div className="max-w-xl mx-auto overflow-hidden bg-oxal-sandstone rounded-3xl shadow-lg">
        {/* Profile Header */}
        <div className="pt-8 pb-6 px-8 text-center bg-gradient-to-b from-oxal-verdigris to-oxal-desert">
          <div className="mb-6">
            <div className="w-64 h-64 mx-auto flex items-center justify-center overflow-hidden">
              <OxalLogo width={480} height={480} fill="#f4f0ea" />
            </div>
          </div>

          <p className="text-2xl text-oxal-sandstone mb-2">
            {t('tagline')}
          </p>

          {/* Description */}
          <p className="text-oxal-sandstone text-base leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Links Section */}
        <div className="px-8 py-8 bg-oxal-sandstone">
          <div className="space-y-3">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className={`block p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group ${link.color}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl flex-shrink-0">
                    {link.icon === 'instagram' ? (
                      <FaInstagram size={32} />
                    ) : link.icon === 'facebook' ? (
                      <FaFacebook size={32} />
                    ) : link.icon === 'globe' ? (
                      <FiGlobe size={32} />
                    ) : (
                      link.icon
                    )}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-lg mb-1 group-hover:translate-x-1 transition-transform">
                      {t(link.titleKey)}
                    </h3>
                    {/* <p className="text-sm opacity-90">
                      {t(link.descriptionKey)}
                    </p> */}
                  </div>
                  <div className="text-xl flex-shrink-0 group-hover:translate-x-2 transition-transform">
                    →
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          <div className="mt-8">
            <div className="relative h-80 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3746.2451234567!2d-103.7227271!3d19.2520727!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x84255b0011d44dc5%3A0x904cf5eabf521d5d!2sOxal!5e0!3m2!1sen!2smx!4v1730000000000"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Social Icons Footer */}
          <div className="mt-8 pt-6 border-t border-oxal-sandstone flex justify-center gap-6">
            <a
              href="https://instagram.com/accesoriosOxal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-oxal-verdigris hover:text-oxal-desert transition-colors"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://facebook.com/shop.oxal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-oxal-verdigris hover:text-oxal-desert transition-colors"
            >
              <FaFacebook size={24} />
            </a>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-oxal-teak">
            <p>{t('copyright')}</p>
          </div>
        </div>
      </div>

      {/* QR Code - Bottom Right Corner */}
      <div className="hidden lg:flex fixed bottom-6 right-6 flex-col items-center">
        <p className="text-xs text-oxal-verdigris font-semibold mb-2">{t('viewInMobile')}</p>
        <div className="w-40 h-40 bg-oxal-cream rounded-lg p-2 flex items-center justify-center">
          <Image
            src="/linktree-qr-code.png"
            alt="Linktree QR Code"
            width={120}
            height={120}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
