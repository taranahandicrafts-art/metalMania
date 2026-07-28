'use client';
import React, { useState } from 'react';
import { CATEGORIES } from '../data/showcase';

interface CategoryNavProps {
  categories?: string[];
  initialActive?: string;
  onSelect?: (category: string) => void;
}

const CategoryNav: React.FC<CategoryNavProps> = ({
  categories = CATEGORIES,
  initialActive = 'New Arrivals',
  onSelect,
}) => {
  const [active, setActive] = useState(initialActive);

  const handleClick = (cat: string) => {
    setActive(cat);
    onSelect?.(cat);
  };

  return (
    <nav className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-[1360px] items-center gap-1 overflow-x-auto px-5 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              onClick={() => handleClick(cat)}
              className={[
                'flex-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-center text-[15px] tracking-wide transition-colors',
                isActive
                  ? 'font-semibold text-amber-600'
                  : 'font-medium text-neutral-800 hover:text-amber-600',
              ].join(' ')}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryNav;
