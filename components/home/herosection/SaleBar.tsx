import React from 'react';
import { BANKS } from '../data/showcase';
import { Benefit } from '../types';
import CountdownTimer from './CountdownTimer';
import { PercentIcon, CustomersIcon, DeliveryIcon, WarrantyIcon, ManufacturingIcon } from './icons';

const BENEFITS: Benefit[] = [
  { id: 'b1', icon: <CustomersIcon className="h-6 w-6" />, line1: '20 Lakh+', line2: 'Customers' },
  { id: 'b2', icon: <DeliveryIcon className="h-6 w-6" />, line1: 'Free', line2: 'Delivery' },
  { id: 'b3', icon: <WarrantyIcon className="h-6 w-6" />, line1: 'Best', line2: 'Warranty*' },
  { id: 'b4', icon: <ManufacturingIcon className="h-6 w-6" />, line1: 'In House', line2: 'Mfg.' },
];

const SaleBar: React.FC = () => (
  <section className="bg-lux-ivory py-6 pb-9">
    <div className="mx-auto max-w-[1360px] px-5">
      <div className="grid grid-cols-1 items-center gap-2.5 rounded-2xl bg-white p-6 shadow-sm lg:grid-cols-[auto_auto_1fr]">

        {/* Sale + timer */}
        <div className="flex items-center justify-between gap-6 border-b border-neutral-200 pb-4 lg:justify-start lg:border-b-0 lg:border-none lg:pb-0 lg:pr-6">
          <div className="text-[22px] font-extrabold leading-tight text-[#d1362f]">
            SALE<small className="block text-[13px] font-semibold">Ends In</small>
          </div>
          <CountdownTimer />
        </div>

        {/* No Cost EMI */}
        <div className="flex items-center justify-center gap-3.5 border-b border-neutral-200 py-4 lg:border-b-0 lg:border-l lg:border-r lg:border-neutral-200 lg:px-6 lg:py-0">
          <div className="grid h-11 w-11 flex-none place-items-center rounded-full border border-neutral-300 text-neutral-500">
            <PercentIcon className="h-[22px] w-[22px]" />
          </div>
          <div>
            <div className="text-[15px] font-bold leading-tight">
              NO COST EMI<small className="block text-[13px] font-medium text-neutral-500">on leading banks</small>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
              {BANKS.map((b) => (
                <span key={b.name} className={`rounded px-1.5 py-[3px] text-[10px] font-extrabold tracking-wide ${b.className}`}>
                  {b.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="flex flex-wrap items-center gap-5 pt-4 lg:justify-around lg:gap-3 lg:pl-6 lg:pt-0">
          {BENEFITS.map((b) => (
            <div key={b.id} className="flex flex-[0_0_calc(50%-1.25rem)] items-center gap-3 lg:flex-none">
              <div className="grid h-12 w-12 flex-none place-items-center rounded-full bg-amber-100 text-amber-600">
                {b.icon}
              </div>
              <div className="text-[15px] font-bold leading-tight">
                {b.line1}<br />{b.line2}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  </section>
);

export default SaleBar;
