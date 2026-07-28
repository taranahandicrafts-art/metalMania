import React from 'react';
import { ADS } from '../data/showcase';
import { ProductAd } from '../types';

const AdCard: React.FC<{ ad: ProductAd }> = ({ ad }) => (
  <div className="group relative min-h-[200px] cursor-pointer overflow-hidden rounded-2xl shadow-xl">
    <img
      src={ad.image}
      alt={ad.title}
      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
    />
    {/* Light scrim: horizontal on desktop, vertical on mobile */}
    <div className="absolute inset-0 bg-gradient-to-b from-[#f5f0e9]/90 via-[#f5f0e9]/40 to-transparent sm:bg-gradient-to-r sm:from-[#f5f0e9]/90 sm:via-[#f5f0e9]/35 sm:to-transparent" />

    <div className="absolute inset-0 p-5 text-[#3a3128] sm:p-7">
      <h3
        className={[
          'leading-[1.05]',
          ad.serifTitle
            ? 'font-serif text-[clamp(20px,2.4vw,30px)] font-semibold tracking-wide'
            : 'text-[clamp(20px,2.4vw,30px)] font-bold',
        ].join(' ')}
      >
        {ad.serifTitle ? ad.title.split(' ').reduce<React.ReactNode[]>((acc, w, i) => {
          // render "MASSIVE PRICE DROP" on two lines
          if (i === 1) acc.push(<br key="br" />);
          acc.push(<React.Fragment key={i}>{i === 0 || i === 1 ? w : ' ' + w}</React.Fragment>);
          return acc;
        }, []) : ad.title}
      </h3>

      {ad.subtitle && (
        <p className={['mt-2 max-w-[60%] text-sm text-[#5a5044]', ad.italicSubtitle ? 'italic' : ''].join(' ')}>
          {ad.subtitle}
        </p>
      )}

      {ad.label && <div className="mt-4 text-sm font-semibold text-[#3a3128]">{ad.label}</div>}
      {ad.priceCaption && <div className="text-sm text-[#6b6154]">{ad.priceCaption}</div>}
      {ad.price && <div className="text-[clamp(20px,2.6vw,30px)] font-bold">{ad.price}</div>}

      {ad.oldPrice && (
        <div className="text-sm text-[#6b6154]">
          Old Price <span className="font-semibold text-[#8a7f70] line-through">{ad.oldPrice}</span>
        </div>
      )}
      {ad.nowPrice && (
        <div className="mt-2.5 inline-flex items-baseline gap-1.5 rounded bg-neutral-800 px-3 py-1.5 text-[clamp(16px,2vw,24px)] font-bold text-white">
          <span className="text-[0.55em] font-semibold tracking-wide">Now AT</span> {ad.nowPrice}
        </div>
      )}
    </div>

    {ad.terms && <span className="absolute bottom-4 left-5 text-xs text-[#6b6154]">{ad.terms}</span>}
  </div>
);

interface ProductAdsProps {
  ads?: ProductAd[];
}

const ProductAds: React.FC<ProductAdsProps> = ({ ads = ADS }) => (
  <div className="grid h-full grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-1">
    {ads.map((ad) => (
      <AdCard key={ad.id} ad={ad} />
    ))}
  </div>
);

export default ProductAds;
