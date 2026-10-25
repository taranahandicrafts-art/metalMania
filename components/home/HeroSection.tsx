import React from "react";
import CategoryNav from "./herosection/CategoryNav";
import Showcase from "./herosection/Showcase";
import { CarouselSlide, ProductAd } from "./types";

export interface HeroSectionProps {
  categories?: string[];
  carouselSlides?: CarouselSlide[];
  productAds?: ProductAd[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  categories,
  carouselSlides,
  productAds,
}) => (
  <div className="pt-50 md:pt-44 bg-white font-sans text-neutral-900 antialiased">
    <CategoryNav categories={categories} />
    <Showcase slides={carouselSlides} ads={productAds} />
  </div>
);
