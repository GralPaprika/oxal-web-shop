import Image from 'next/image';
import { siInstagram, siFacebook } from 'simple-icons';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('landing');
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=1200&h=600&fit=crop"
            alt="Handcrafted jewelry and textiles"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-3xl">
          <div className="mb-4 inline-block">
            <span className="bg-amber-500/90 text-white px-4 py-2 rounded-full text-sm font-semibold">
              {t('comingSoon')}
            </span>
          </div>
          <h2 className="text-6xl font-bold mb-6">{t('title')}</h2>
          <p className="text-2xl mb-4">{t('subtitle')}</p>
          <p className="text-xl text-gray-100">{t('description')}</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              {t('about.title')}
            </span>
            <h3 className="text-4xl font-bold text-gray-900 mb-6">{t('about.title')}</h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
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
                  <span className="text-amber-600 text-2xl mr-4">{t('about.jewelry.icon')}</span>
                  <div>
                    <h5 className="font-semibold text-gray-900">{t('about.jewelry.title')}</h5>
                    <p className="text-gray-600">{t('about.jewelry.description')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-amber-600 text-2xl mr-4">{t('about.clothing.icon')}</span>
                  <div>
                    <h5 className="font-semibold text-gray-900">{t('about.clothing.title')}</h5>
                    <p className="text-gray-600">{t('about.clothing.description')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-amber-600 text-2xl mr-4">{t('about.ethics.icon')}</span>
                  <div>
                    <h5 className="font-semibold text-gray-900">{t('about.ethics.title')}</h5>
                    <p className="text-gray-600">{t('about.ethics.description')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-96">
              <Image
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop"
                alt="Mexican artisan crafts"
                fill
                className="object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section id="collections" className="py-20 bg-white">
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
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop"
                  alt={t('collections.jewelry.title')}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <span className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">{t('collections.comingSoon')}</span>
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
                  src="https://images.unsplash.com/photo-1595777712802-d2a8de308a85?w=600&h=600&fit=crop"
                  alt={t('collections.clothing.title')}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                <span className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">{t('collections.comingSoon')}</span>
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
      <section className="py-20 bg-gradient-to-br from-orange-50 to-amber-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">{t('location.title')}</h3>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {t('location.description')}
            </p>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-lg">
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
            <div className="mt-12 grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-600 mb-2">📍</p>
                <h4 className="font-semibold text-gray-900 mb-1">{t('location.handcrafted')}</h4>
                <p className="text-gray-600 text-sm">{t('location.handcraftedDesc')}</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-600 mb-2">🌿</p>
                <h4 className="font-semibold text-gray-900 mb-1">{t('location.sustainable')}</h4>
                <p className="text-gray-600 text-sm">{t('location.sustainableDesc')}</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-amber-600 mb-2">✨</p>
                <h4 className="font-semibold text-gray-900 mb-1">{t('location.authentic')}</h4>
                <p className="text-gray-600 text-sm">{t('location.authenticDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-gray-900 mb-6">{t('contact.title')}</h3>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              {t('contact.subtitle')}
            </p>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('contact.location')}</h4>
                <p className="text-gray-600">Colima, Colima, Mexico</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('contact.email')}</h4>
                <p className="text-gray-600">
                  <a href="mailto:info@oxal.shop" className="text-amber-600 hover:text-amber-700">
                    info@oxal.shop
                  </a>
                </p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{t('contact.followUs')}</h4>
                <div className="flex gap-4 justify-center md:justify-start">
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition inline-flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d={siInstagram.path} />
                    </svg>
                    <span>{t('contact.instagram')}</span>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-amber-600 transition inline-flex items-center gap-2">
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-800">
            <div>
              <h2 className="text-2xl font-bold mb-2">Oxal</h2>
              <p className="text-gray-400">
                {t('footer.description')}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
              <ul className="space-y-2">
                <li><a href="#about" className="text-gray-400 hover:text-white transition">{t('footer.ourVision')}</a></li>
                <li><a href="#collections" className="text-gray-400 hover:text-white transition">{t('footer.collections')}</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition">{t('footer.contact')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">{t('footer.connect')}</h4>
              <ul className="space-y-2">
                <li><a href="mailto:info@oxal.shop" className="text-gray-400 hover:text-white transition">{t('footer.emailUs')}</a></li>
                <li className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-white transition inline-flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d={siInstagram.path} />
                    </svg>
                    <span>Instagram</span>
                  </a>
                </li>
                <li className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-white transition inline-flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d={siFacebook.path} />
                    </svg>
                    <span>Facebook</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm">
            <p>{t('footer.copyright')}</p>
            <p className="mt-2">{t('footer.badge')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}