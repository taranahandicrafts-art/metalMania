import React from "react";
import { PromoAd } from "./types";

const PromoCard: React.FC<{ ad: PromoAd }> = ({ ad }) => (
  <a
    href={ad.href}
    className={`group relative flex h-56 w-full overflow-hidden rounded-2xl sm:h-60 lg:h-64 ${
      ad.bgClassName ?? "bg-[#efe9df]"
    } shadow-sm ring-1 ring-black/5 transition hover:shadow-md`}
  >
    <div className="relative z-10 flex w-[58%] flex-col justify-center gap-1.5 p-4 sm:p-5">
      <span
        className={`w-fit rounded-full px-3 py-1 text-[10px] font-bold uppercase leading-tight tracking-wide sm:text-xs ${ad.badgeClassName ?? "bg-[#8a4a29] text-white"}`}
      >
        {ad.badge}
      </span>
      <h3 className="mt-0.5 font-serif text-xl font-semibold leading-tight text-neutral-900 sm:text-2xl">
        {ad.title}
      </h3>
      <p className="text-xs text-neutral-600 sm:text-sm">{ad.tagline}</p>
      <div className="mt-1">
        {ad.priceCaption && (
          <p className="text-[11px] text-neutral-500 sm:text-xs">
            {ad.priceCaption}
          </p>
        )}
        <p className="font-serif text-2xl font-bold text-neutral-900 sm:text-3xl">
          {ad.price}
        </p>
      </div>
      {ad.footnote && (
        <p className="mt-0.5 text-[11px] font-medium text-neutral-500">
          {ad.footnote}
        </p>
      )}
    </div>

    <div className="absolute inset-y-0 right-0 w-[46%]">
      <img
        src={ad.image}
        alt={ad.title}
        loading="lazy"
        className="h-full w-full object-cover object-center"
      />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#efe9df] to-transparent" />
    </div>
  </a>
);

export default PromoCard;
