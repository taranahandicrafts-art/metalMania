"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SettingsFormProps {
  initialData: Record<string, Record<string, unknown>>;
}

type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "url"
  | "checkbox"
  | "number"
  | "image-upload";

function normalizeGoogleDriveUrl(url: string): string {
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  const idMatch = url.match(
    /drive\.google\.com\/(?:open|uc)\?[^"]*[?&]id=([a-zA-Z0-9_-]+)/,
  );
  if (idMatch) return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
  return url;
}

interface SectionField {
  key: string;
  label: string;
  type: FieldType;
  default?: string | number | boolean;
}

interface Section {
  key: string;
  label: string;
  fields: SectionField[];
}

const SECTIONS: Section[] = [
  {
    key: "promo_banner",
    label: "Promo Banner",
    fields: [
      {
        key: "eyebrow",
        label: "Eyebrow",
        type: "text",
        default: "The atelier event",
      },
      {
        key: "title",
        label: "Title",
        type: "text",
        default: "The living room,",
      },
      {
        key: "title_accent",
        label: "Title Accent",
        type: "text",
        default: "reimagined",
      },
      {
        key: "description",
        label: "Description",
        type: "textarea",
        default:
          "For a limited season, our signature seating and hand-built casegoods are offered with white-glove delivery included — and up to a quarter off the collection.",
      },
      {
        key: "cta_primary_text",
        label: "Primary Button Text",
        type: "text",
        default: "Shop the event",
      },
      {
        key: "cta_primary_href",
        label: "Primary Button Link",
        type: "text",
        default: "/products?is_best_seller=true",
      },
      {
        key: "cta_secondary_text",
        label: "Secondary Button Text",
        type: "text",
        default: "Book a consultation",
      },
      {
        key: "cta_secondary_href",
        label: "Secondary Button Link",
        type: "text",
        default: "/about",
      },
      {
        key: "image",
        label: "Banner Image",
        type: "image-upload",
        default:
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400",
      },
      {
        key: "discount_percent",
        label: "Discount Percent",
        type: "number",
        default: 25,
      },
      {
        key: "from_price",
        label: "From Price",
        type: "text",
        default: "₹38,000",
      },
      {
        key: "footnote",
        label: "Footnote",
        type: "text",
        default: "Ends this season · Terms apply",
      },
    ],
  },
  // {
  //   key: "store_info",
  //   label: "Store Information",
  //   fields: [
  //     { key: "name", label: "Store Name", type: "text" },
  //     { key: "tagline", label: "Tagline", type: "text" },
  //     { key: "description", label: "Description", type: "textarea" },
  //     { key: "phone", label: "Phone", type: "text" },
  //     { key: "email", label: "Email", type: "email" },
  //     { key: "address", label: "Address", type: "textarea" },
  //   ],
  // },
  // {
  //   key: "seo_defaults",
  //   label: "SEO Defaults",
  //   fields: [
  //     { key: "title", label: "Default Meta Title", type: "text" },
  //     {
  //       key: "description",
  //       label: "Default Meta Description",
  //       type: "textarea",
  //     },
  //     {
  //       key: "keywords",
  //       label: "Default Keywords (comma separated)",
  //       type: "text",
  //     },
  //   ],
  // },
  // {
  //   key: "social_links",
  //   label: "Social Links",
  //   fields: [
  //     { key: "facebook", label: "Facebook URL", type: "url" },
  //     { key: "instagram", label: "Instagram URL", type: "url" },
  //     { key: "youtube", label: "YouTube URL", type: "url" },
  //     { key: "pinterest", label: "Pinterest URL", type: "url" },
  //   ],
  // },
  // {
  //   key: "contact_info",
  //   label: "Contact Information",
  //   fields: [
  //     { key: "whatsapp", label: "WhatsApp Number", type: "text" },
  //     {
  //       key: "whatsapp_message",
  //       label: "WhatsApp Default Message",
  //       type: "text",
  //     },
  //     { key: "call_phone", label: "Call Phone", type: "text" },
  //     { key: "business_hours", label: "Business Hours", type: "text" },
  //   ],
  // },
  // {
  //   key: "payment",
  //   label: "Payment Settings",
  //   fields: [
  //     {
  //       key: "accepted_methods",
  //       label: "Accepted Payment Methods (comma separated)",
  //       type: "text",
  //     },
  //     {
  //       key: "cod_available",
  //       label: "Cash on Delivery Available",
  //       type: "checkbox",
  //     },
  //     { key: "upi_id", label: "UPI ID", type: "text" },
  //     { key: "bank_name", label: "Bank Name", type: "text" },
  //     { key: "account_number", label: "Account Number", type: "text" },
  //     { key: "ifsc_code", label: "IFSC Code", type: "text" },
  //     { key: "account_holder", label: "Account Holder Name", type: "text" },
  //   ],
  // },
  // {
  //   key: "footer",
  //   label: "Footer",
  //   fields: [
  //     { key: "copyright", label: "Copyright Text", type: "text" },
  //     { key: "description", label: "Footer Description", type: "textarea" },
  //   ],
  // },
];

export function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<Record<string, Record<string, unknown>>>(
    SECTIONS.reduce(
      (acc, section) => {
        acc[section.key] = section.fields.reduce(
          (facc, f) => {
            const saved = initialData[section.key]?.[f.key];
            const fallback =
              f.default ??
              (f.type === "checkbox" ? false : f.type === "number" ? 0 : "");
            facc[f.key] =
              saved !== undefined && saved !== null ? saved : fallback;
            return facc;
          },
          {} as Record<string, unknown>,
        );
        return acc;
      },
      {} as Record<string, Record<string, unknown>>,
    ),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleLocalUpload = async (
    sectionKey: string,
    fieldKey: string,
    file: File,
  ) => {
    const uid = `${sectionKey}.${fieldKey}`;
    setUploadingField(uid);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "settings");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      updateField(sectionKey, fieldKey, data.secure_url as string);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setUploadingField(null);
    }
  };

  const updateField = (
    section: string,
    key: string,
    value: string | number | boolean,
  ) => {
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
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: form[sectionKey] }),
      });

      if (!res.ok) throw new Error("Failed to save");
      setSavedSection(sectionKey);
      router.refresh();
    } catch {
      setError(`Failed to save ${sectionKey}`);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
  const labelClass = "text-sm font-medium leading-none";

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

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
              <div
                key={field.key}
                className={`space-y-2 ${field.type === "textarea" || field.type === "image-upload" ? "sm:col-span-2" : ""}`}
              >
                <label className={labelClass}>{field.label}</label>
                {field.type === "checkbox" ? (
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={
                        (form[section.key]?.[field.key] as boolean) || false
                      }
                      onChange={(e) =>
                        updateField(section.key, field.key, e.target.checked)
                      }
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Enabled
                  </label>
                ) : field.type === "image-upload" ? (
                  <div className="space-y-3">
                    {!!form[section.key]?.[field.key] && (
                      <div className="relative h-[300px] overflow-hidden rounded-md border bg-muted">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={normalizeGoogleDriveUrl(
                            String(form[section.key][field.key]),
                          )}
                          alt="Preview"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    )}
                    <input
                      type="text"
                      className={inputClass}
                      placeholder="Paste image URL or Google Drive share link…"
                      value={
                        (form[section.key]?.[field.key] as string) || ""
                      }
                      onChange={(e) =>
                        updateField(section.key, field.key, e.target.value)
                      }
                    />
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium hover:bg-accent">
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            handleLocalUpload(section.key, field.key, file);
                          e.target.value = "";
                        }}
                      />
                      {uploadingField === `${section.key}.${field.key}`
                        ? "Uploading…"
                        : "Upload from device"}
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Google Drive share links are automatically converted.
                    </p>
                  </div>
                ) : field.type === "textarea" ? (
                  <textarea
                    className={`${inputClass} h-20 resize-none pt-2`}
                    value={(form[section.key]?.[field.key] as string) || ""}
                    onChange={(e) =>
                      updateField(section.key, field.key, e.target.value)
                    }
                  />
                ) : field.type === "number" ? (
                  <input
                    type="number"
                    className={inputClass}
                    value={
                      form[section.key]?.[field.key] === "" ||
                      form[section.key]?.[field.key] === undefined
                        ? ""
                        : (form[section.key]?.[field.key] as number)
                    }
                    onChange={(e) =>
                      updateField(
                        section.key,
                        field.key,
                        e.target.value === "" ? "" : Number(e.target.value),
                      )
                    }
                  />
                ) : (
                  <input
                    type={field.type || "text"}
                    className={inputClass}
                    value={(form[section.key]?.[field.key] as string) || ""}
                    onChange={(e) =>
                      updateField(section.key, field.key, e.target.value)
                    }
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
              {loading ? "Saving..." : `Save ${section.label}`}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
