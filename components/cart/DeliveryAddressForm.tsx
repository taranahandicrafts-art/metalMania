'use client';

import { useCartStore } from '@/store/cart-store';

export function DeliveryAddressForm() {
  const address = useCartStore((s) => s.address);
  const setAddress = useCartStore((s) => s.setAddress);

  const fields: {
    key: string;
    label: string;
    placeholder: string;
    type?: string;
    required?: boolean;
    colSpan?: boolean;
  }[] = [
    { key: 'name', label: 'Full Name', placeholder: 'John Doe', required: true },
    { key: 'phone', label: 'Phone Number', placeholder: '9876543210', type: 'tel', required: true },
    { key: 'email', label: 'Email (optional)', placeholder: 'john@example.com', type: 'email' },
    { key: 'line1', label: 'Address Line 1', placeholder: '123, Main Street', required: true, colSpan: true },
    { key: 'line2', label: 'Address Line 2', placeholder: 'Apartment, Sector', colSpan: true },
    { key: 'city', label: 'City', placeholder: 'Mumbai', required: true },
    { key: 'state', label: 'State', placeholder: 'Maharashtra', required: true },
    { key: 'pincode', label: 'Pincode', placeholder: '400001', required: true },
    { key: 'country', label: 'Country', placeholder: 'India', required: true },
  ];

  const handleChange = (key: string, value: string) => {
    setAddress({ ...(address || {}), [key]: value } as Record<string, string>);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Delivery Address</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map(({ key, label, placeholder, type, required, colSpan }) => (
          <div key={key} className={colSpan ? 'sm:col-span-2' : ''}>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              {label} {required && <span className="text-destructive">*</span>}
            </label>
            <input
              type={type || 'text'}
              value={(address as Record<string, string>)?.[key] || ''}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
