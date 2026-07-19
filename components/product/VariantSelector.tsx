'use client';

import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  variants: {
    _id?: string;
    name: string;
    sku: string;
    attributes: { name: string; value: string }[];
    is_active: boolean;
  }[];
  selectedSku: string;
  onSelect: (sku: string) => void;
}

export function VariantSelector({ variants, selectedSku, onSelect }: VariantSelectorProps) {
  const activeVariants = variants.filter((v) => v.is_active);
  if (activeVariants.length <= 1) return null;

  const attributeNames = [...new Set(activeVariants.flatMap((v) => v.attributes.map((a) => a.name)))];

  return (
    <div className="space-y-4">
      {attributeNames.map((attrName) => {
        const values = [...new Set(activeVariants.map((v) => v.attributes.find((a) => a.name === attrName)?.value).filter(Boolean))] as string[];
        const selectedVariant = activeVariants.find((v) => v.sku === selectedSku);
        const selectedValue = selectedVariant?.attributes.find((a) => a.name === attrName)?.value;

        return (
          <div key={attrName}>
            <p className="mb-2 text-sm font-medium">
              {attrName}: <span className="text-muted-foreground">{selectedValue || 'Select'}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {values.map((value) => {
                const variantWithValue = activeVariants.find((v) =>
                  v.attributes.some((a) => a.name === attrName && a.value === value),
                );
                const isSelected = selectedValue === value;
                return (
                  <button
                    key={value}
                    onClick={() => variantWithValue && onSelect(variantWithValue.sku)}
                    className={cn(
                      'rounded-md border px-4 py-2 text-sm transition-colors',
                      isSelected
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-input hover:border-primary hover:text-primary',
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
