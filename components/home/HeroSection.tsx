import React from "react";
import CategoryNav from "./herosection/CategoryNav";
import Showcase from "./herosection/Showcase";
import SaleBar, { SaleBarSettings } from "./herosection/SaleBar";
import { CarouselSlide, ProductAd } from "./types";

export interface HeroSectionProps {
  categories?: string[];
  carouselSlides?: CarouselSlide[];
  productAds?: ProductAd[];
  saleBarSettings?: SaleBarSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  categories,
  carouselSlides,
  productAds,
  saleBarSettings,
}) => (
  <div className="pt-50 md:pt-44 bg-white font-sans text-neutral-900 antialiased">
    <CategoryNav categories={categories} />
    <Showcase slides={carouselSlides} ads={productAds} />
    <SaleBar settings={saleBarSettings} />
  </div>
);
