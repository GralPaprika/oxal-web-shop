import Image from 'next/image';
import { siInstagram, siFacebook } from 'simple-icons';
import { useTranslations } from 'next-intl';
import OxalLogo from '@/components/OxalLogo';
import LocationMap from '@/components/LocationMap';
import { Metadata, Viewport } from 'next';
import { getLocalBusinessSchema, getOrganizationSchema } from '@/lib/schema';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://oxal.shop"),
  title: "Oxal - Artesanías Auténticas",
  description: "Descubre joyas y ropa artesanal premium de Colima, México",
  keywords: ["artesanías", "joyería artesanal", "ropa premium", "Colima", "México", "comercio justo", "productos únicos"],
  robots: "index, follow",
  openGraph: {
    title: "Oxal - Artesanías Auténticas",
    description: "Descubre joyas y ropa artesanal premium de Colima, México",
    type: "website",
    locale: "es_MX",
    url: "https://oxal.shop",
    siteName: "Oxal",
    images: [
      {
        url: "/landing-background.png",
        width: 1200,
        height: 630,
        alt: "Oxal - Artesanías Auténticas",
        type: "image/png"
      }
    ],
    countryName: "Mexico",
    determiner: "the"
  },
  twitter: {
    card: "summary_large_image",
    title: "Oxal - Artesanías Auténticas",
    description: "Descubre joyas y ropa artesanal premium de Colima, México",
    images: ["/landing-background.png"],
    creator: "@shop_oxal"
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Oxal"
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true
  },
  alternates: {
    canonical: "https://oxal.shop"
  }
};

export default function Home() {
  const t = useTranslations('landing');
  
  const structuredData = getLocalBusinessSchema();
  const organizationSchema = getOrganizationSchema();

  return (
    <div className="min-h-screen bg-oxal-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema).replace(/</g, '\\u003c') }}
      />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/landing-background.png"
            alt={t('hero.alt')}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <div className="flex justify-center mb-6">
            <OxalLogo width={400} height={400} className="sm:w-80 sm:h-80 md:w-96 md:h-96 lg:w-128 lg:h-128 xl:w-144 xl:h-144" fill="#f4f0ea"/>
          </div>
          <p className="text-2xl mb-4">{t('subtitle')}</p>
          <p className="text-xl text-gray-100">{t('description')}</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-oxal-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* <span className="inline-block bg-oxal-sandstone text-gray-900 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {t('about.title')}
            </span> */}
            <h3 className="text-4xl font-bold text-gray-900 mb-6">{t('about.title')}</h3>
            <p className="text-xl text-oxal-teak max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h4 className="text-2xl font-bold text-gray-900 mb-6">{t('about.vision')}</h4>
              <p className="text-lg text-gray-700 mb-4">
                {t('about.visionText')}
              </p>
              <p className="text-lg text-gray-700 mb-4">
                {t('about.visionText2')}
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-oxal-verdigris text-2xl mr-4">{t('about.jewelry.icon')}</span>
                  <div>
                    <h5 className="font-semibold text-gray-900">{t('about.jewelry.title')}</h5>
                    <p className="text-gray-600">{t('about.jewelry.description')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-oxal-verdigris text-2xl mr-4">{t('about.clothing.icon')}</span>
                  <div>
                    <h5 className="font-semibold text-gray-900">{t('about.clothing.title')}</h5>
                    <p className="text-gray-600">{t('about.clothing.description')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-oxal-verdigris text-2xl mr-4">{t('about.ethics.icon')}</span>
                  <div>
                    <h5 className="font-semibold text-gray-900">{t('about.ethics.title')}</h5>
                    <p className="text-gray-600">{t('about.ethics.description')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96">
              <Image
                src="/landing-store.jpg"
                alt={t('about.storeAlt')}
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="py-20 bg-oxal-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">{t('collections.title')}</h3>
            <p className="text-xl text-gray-600">{t('collections.subtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Jewelry */}
            <div className="group cursor-pointer relative">
              <div className="relative h-80 overflow-hidden rounded-lg mb-6 shadow-lg">
                <Image
                  src="/landing-jewelry.jpg"
                  alt={t('collections.jewelry.title')}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <span className="absolute top-4 right-4 badge-oxal">{t('collections.comingSoon')}</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">{t('collections.jewelry.title')}</h4>
              <p className="text-gray-600 text-lg">
                {t('collections.jewelry.description')}
              </p>
            </div>

            {/* Clothing */}
            <div className="group cursor-pointer relative">
              <div className="relative h-80 overflow-hidden rounded-lg mb-6 shadow-lg">
                <Image
                  src="/landing-clothes.jpg"
                  alt={t('collections.clothing.title')}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <span className="absolute top-4 right-4 badge-oxal">{t('collections.comingSoon')}</span>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">{t('collections.clothing.title')}</h4>
              <p className="text-gray-600 text-lg">
                {t('collections.clothing.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-20 bg-oxal-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">{t('location.title')}</h3>
            <p className="text-xl text-oxal-teak mb-8 max-w-2xl mx-auto">
              {t('location.description')}
            </p>
            <LocationMap height="h-96" />
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold mb-2 text-oxal-verdigris">📍</p>
                <h4 className="font-semibold text-gray-900 mb-1">{t('location.handcrafted')}</h4>
                <p className="text-oxal-teak text-sm">{t('location.handcraftedDesc')}</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold mb-2 text-oxal-verdigris">🌿</p>
                <h4 className="font-semibold text-gray-900 mb-1">{t('location.sustainable')}</h4>
                <p className="text-oxal-teak text-sm">{t('location.sustainableDesc')}</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold mb-2 text-oxal-verdigris">✨</p>
                <h4 className="font-semibold text-gray-900 mb-1">{t('location.authentic')}</h4>
                <p className="text-oxal-teak text-sm">{t('location.authenticDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-oxal-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">{t('contact.title')}</h3>
            <p className="text-xl text-oxal-teak mb-12 max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('contact.location')}</h4>
                <p className="text-oxal-teak">
                  <a href="https://maps.app.goo.gl/2qAGT62fBnyojRBq9" target="_blank" rel="noopener noreferrer" className="text-oxal-verdigris hover:opacity-80">
                    {t('contact.locationText')}
                  </a>
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('contact.email')}</h4>
                <p className="text-oxal-teak">
                  <a href={`mailto:${t('contact.emailAddress')}`} className="text-oxal-verdigris hover:opacity-80">
                    {t('contact.emailAddress')}
                  </a>
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('contact.followUs')}</h4>
                <div className="flex gap-4 justify-center md:justify-start">
                  <a href="https://www.instagram.com/shop.oxal/" target="_blank" rel="noopener noreferrer" className="text-oxal-teak hover:text-oxal-verdigris transition inline-flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d={siInstagram.path} />
                    </svg>
                    <span>{t('contact.instagram')}</span>
                  </a>
                  <a href="https://www.facebook.com/accesoriosOxal/" target="_blank" rel="noopener noreferrer" className="text-oxal-teak hover:text-oxal-verdigris transition inline-flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d={siFacebook.path} />
                    </svg>
                    <span>{t('contact.facebook')}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-oxal-verdigris text-yellow-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-oxal-verdigris">
            <div>
              <h2 className="text-2xl font-bold mb-2">Oxal</h2>
              <p className="text-yellow-100">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-yellow-100 hover:text-yellow-50 transition">{t('footer.ourVision')}</a></li>
                <li><a href="#collections" className="text-yellow-100 hover:text-yellow-50 transition">{t('footer.collections')}</a></li>
                <li><a href="#contact" className="text-yellow-100 hover:text-yellow-50 transition">{t('footer.contact')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.connect')}</h4>
              <ul className="space-y-2">
                <li><a href="mailto:info@oxal.shop" className="text-yellow-100 hover:text-yellow-50 transition">{t('footer.emailUs')}</a></li>
                <li className="flex gap-4">
                  <a href="https://www.instagram.com/shop.oxal/" target="_blank" rel="noopener noreferrer" className="text-yellow-100 hover:text-yellow-50 transition inline-flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d={siInstagram.path} />
                    </svg>
                    <span>{t('footer.instagram')}</span>
                  </a>
                </li>
                <li className="flex gap-4">
                  <a href="https://www.facebook.com/accesoriosOxal/" target="_blank" rel="noopener noreferrer" className="text-yellow-100 hover:text-yellow-50 transition inline-flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d={siFacebook.path} />
                    </svg>
                    <span>{t('footer.facebook')}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-yellow-100 text-sm pt-8">
            <p>{t('footer.copyright')}</p>
            <p className="mt-2">{t('footer.badge')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}