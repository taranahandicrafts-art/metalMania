import React from 'react';
import HeroCarousel from './HeroCarousel';
import ProductAds from './ProductAds';

const Showcase: React.FC = () => (
  <section className="mx-auto max-w-[1360px] px-5">
    <div className="grid grid-cols-1 gap-5 py-6 lg:grid-cols-[2fr_1fr]">
      <HeroCarousel />
      <ProductAds />
    </div>
  </section>
);

export default Showcase;
