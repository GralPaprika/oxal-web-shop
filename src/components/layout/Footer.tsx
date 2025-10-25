import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-primary-600 mb-4">Oxal</h3>
            <p className="text-text-secondary mb-4 max-w-md">
              Descubre nuestra colección de productos únicos y elegantes. 
              Calidad excepcional con un toque bohemio para tu estilo de vida.
            </p>
            <div className="flex space-x-4">
              <Link 
                href="#" 
                className="text-text-secondary hover:text-primary-600 transition-colors"
              >
                Facebook
              </Link>
              <Link 
                href="#" 
                className="text-text-secondary hover:text-primary-600 transition-colors"
              >
                Instagram
              </Link>
              <Link 
                href="#" 
                className="text-text-secondary hover:text-primary-600 transition-colors"
              >
                Twitter
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Enlaces rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  Sobre nosotros
                </Link>
              </li>
              <li>
                <Link 
                  href="/products" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  Contacto
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Atención al cliente</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/shipping" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  Envíos
                </Link>
              </li>
              <li>
                <Link 
                  href="/returns" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  Devoluciones
                </Link>
              </li>
              <li>
                <Link 
                  href="/privacy" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-secondary text-sm">
            © 2024 Oxal. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <span className="text-text-secondary text-sm">Aceptamos:</span>
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