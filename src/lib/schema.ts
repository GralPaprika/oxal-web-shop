// Structured Data (JSON-LD) schemas for SEO

export const getLocalBusinessSchema = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Oxal",
  "alternateName": "Oxal Artesanías",
  "description": "Boutique artesanal de Colima, México - Joyería y ropa artesanal premium",
  "image": "https://oxal.shop/landing-background.png",
  "url": "https://oxal.shop",
  "telephone": "+52-312-231-3591",
  "email": "contact@oxal.shop",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Constitución 552, Guadalajarita",
    "addressLocality": "Colima",
    "addressRegion": "Colima",
    "postalCode": "28030",
    "addressCountry": "MX"
  },
  "areaServed": {
    "@type": "City",
    "name": "Colima"
  },
  "serviceArea": {
    "@type": "City",
    "name": "Colima, Mexico"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 19.2520727,
    "longitude": -103.7227271
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    "opens": "09:00",
    "closes": "21:00"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "telephone": "+52-312-231-3591",
    "email": "contact@oxal.shop",
    "url": "https://oxal.shop/#contact"
  },
  "founder": {
    "@type": "Organization",
    "name": "Oxal"
  },
  "sameAs": [
    "https://www.instagram.com/shop.oxal/",
    "https://www.facebook.com/accesoriosOxal/"
  ],
  "priceRange": "$$"
});

export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Oxal",
  "url": "https://oxal.shop",
  "logo": {
    "@type": "ImageObject",
    "url": "https://oxal.shop/oxal-logo-default.png",
    "width": "512",
    "height": "512"
  },
  "description": "Boutique artesanal de Colima, México",
  "sameAs": [
    "https://www.instagram.com/shop.oxal/",
    "https://www.facebook.com/accesoriosOxal/"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Customer Service",
    "email": "contact@oxal.shop"
  },
  "location": {
    "@type": "PostalAddress",
    "addressCountry": "MX",
    "addressRegion": "Colima"
  }
});

export const getLogoSchema = () => ({
  "@context": "https://schema.org",
  "@type": "ImageObject",
  "url": "https://oxal.shop/oxal-logo-default.png",
  "width": "512",
  "height": "512",
  "name": "Oxal Logo",
  "description": "Logo de Oxal - Boutique Artesanal"
});

export const getProductSchema = (name: string, description: string, image: string) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": name,
  "description": description,
  "image": image,
  "brand": {
    "@type": "Brand",
    "name": "Oxal"
  },
  "offers": {
    "@type": "AggregateOffer",
    "availability": "https://schema.org/PreOrder",
    "priceCurrency": "MXN"
  }
});
