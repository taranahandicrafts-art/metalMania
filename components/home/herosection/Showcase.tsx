import React from 'react';
import HeroCarousel from './HeroCarousel';
import ProductAds from './ProductAds';
import { CarouselSlide, ProductAd } from '../types';

interface ShowcaseProps {
  slides?: CarouselSlide[];
  ads?: ProductAd[];
}

const Showcase: React.FC<ShowcaseProps> = ({ slides, ads }) => (
  <section className="mx-auto max-w-340 px-5">
    <div className="grid grid-cols-1 gap-5 py-6 lg:grid-cols-[2fr_1fr]">
      <HeroCarousel slides={slides} />
      <ProductAds ads={ads} />
    </div>
  </section>
);

export default Showcase;
