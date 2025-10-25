import { getTranslations } from 'next-intl/server';
import { Header } from '@/components/layout/Header';
import { Hero } from '@/components/home/Hero';
import { FeaturedCategories } from '@/components/home/FeaturedCategories';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { AboutSection } from '@/components/home/AboutSection';
import { Features } from '@/components/home/Features';
import { Newsletter } from '@/components/home/Newsletter';
import { Footer } from '@/components/layout/Footer';

export default async function Home() {
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-background-primary">
      <Header />
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <AboutSection />
      <Features />
      <Newsletter />
      <Footer />
    </div>
  );
}