import React from "react";
import AnnouncementBar from "./herosection/AnnouncementBar";
import CategoryNav from "./herosection/CategoryNav";
import CountdownTimer from "./herosection/CountdownTimer";
import HeroCarousel from "./herosection/HeroCarousel";
import SaleBar from "./herosection/SaleBar";
import Showcase from "./herosection/Showcase";
import TopContactBar from "./herosection/TopContactBar";

export const HeroSection: React.FC = () => (
  <div className="mt-[166px] bg-white font-sans text-neutral-900 antialiased">
    <CategoryNav />
    <Showcase />
    <SaleBar />
  </div>
);
