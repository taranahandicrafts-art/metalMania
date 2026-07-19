'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SettingsFormProps {
  initialData: Record<string, Record<string, unknown>>;
}

const SECTIONS = [
  {
    key: 'store_info',
    label: 'Store Information',
    fields: [
      { key: 'name', label: 'Store Name', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'email', label: 'Email', type: 'email' },
      { key: 'address', label: 'Address', type: 'textarea' },
    ],
  },
  {
    key: 'seo_defaults',
    label: 'SEO Defaults',
    fields: [
      { key: 'title', label: 'Default Meta Title', type: 'text' },
      { key: 'description', label: 'Default Meta Description', type: 'textarea' },
      { key: 'keywords', label: 'Default Keywords (comma separated)', type: 'text' },
    ],
  },
  {
    key: 'social_links',
    label: 'Social Links',
    fields: [
      { key: 'facebook', label: 'Facebook URL', type: 'url' },
      { key: 'instagram', label: 'Instagram URL', type: 'url' },
      { key: 'youtube', label: 'YouTube URL', type: 'url' },
      { key: 'pinterest', label: 'Pinterest URL', type: 'url' },
    ],
  },
  {
    key: 'contact_info',
    label: 'Contact Information',
    fields: [
      { key: 'whatsapp', label: 'WhatsApp Number', type: 'text' },
      { key: 'whatsapp_message', label: 'WhatsApp Default Message', type: 'text' },
      { key: 'call_phone', label: 'Call Phone', type: 'text' },
      { key: 'business_hours', label: 'Business Hours', type: 'text' },
    ],
  },
  {
    key: 'payment',
    label: 'Payment Settings',
    fields: [
      { key: 'accepted_methods', label: 'Accepted Payment Methods (comma separated)', type: 'text' },
      { key: 'cod_available', label: 'Cash on Delivery Available', type: 'checkbox' },
      { key: 'upi_id', label: 'UPI ID', type: 'text' },
      { key: 'bank_name', label: 'Bank Name', type: 'text' },
      { key: 'account_number', label: 'Account Number', type: 'text' },
      { key: 'ifsc_code', label: 'IFSC Code', type: 'text' },
      { key: 'account_holder', label: 'Account Holder Name', type: 'text' },
    ],
  },
  {
    key: 'footer',
    label: 'Footer',
    fields: [
      { key: 'copyright', label: 'Copyright Text', type: 'text' },
      { key: 'description', label: 'Footer Description', type: 'textarea' },
    ],
  },
];

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, Record<string, unknown>>>(
    SECTIONS.reduce(
      (acc, section) => {
        acc[section.key] = { ...section.fields.reduce((facc, f) => {
          (facc as Record<string, unknown>)[f.key] = (initialData[section.key]?.[f.key] as string | boolean) || (f.type === 'checkbox' ? false : '');
          return facc;
        }, {} as Record<string, unknown>) };
        return acc;
      },
      {} as Record<string, Record<string, unknown>>,
    ),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const updateField = (section: string, key: string, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: value },
    }));
  };

  const handleSaveSection = async (sectionKey: string) => {
    setLoading(true);
    setError(null);
    setSavedSection(null);

    try {
      const res = await fetch(`/api/settings/${sectionKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: form[sectionKey] }),
      });

      if (!res.ok) throw new Error('Failed to save');
      setSavedSection(sectionKey);
      router.refresh();
    } catch {
      setError(`Failed to save ${sectionKey}`);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';
  const labelClass = 'text-sm font-medium leading-none';

  return (
    <div className="space-y-8">
      {error && <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

      {SECTIONS.map((section) => (
        <div key={section.key} className="rounded-lg border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">{section.label}</h3>
            {savedSection === section.key && (
              <span className="text-sm text-green-600">Saved</span>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {section.fields.map((field) => (
              <div key={field.key} className={`space-y-2 ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                <label className={labelClass}>{field.label}</label>
                {field.type === 'checkbox' ? (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={(form[section.key]?.[field.key] as boolean) || false}
                      onChange={(e) => updateField(section.key, field.key, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Enabled
                  </label>
                ) : field.type === 'textarea' ? (
                  <textarea
                    className={`${inputClass} h-20 resize-none pt-2`}
                    value={(form[section.key]?.[field.key] as string) || ''}
                    onChange={(e) => updateField(section.key, field.key, e.target.value)}
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    className={inputClass}
                    value={(form[section.key]?.[field.key] as string) || ''}
                    onChange={(e) => updateField(section.key, field.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={() => handleSaveSection(section.key)}
              disabled={loading}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Saving...' : `Save ${section.label}`}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
