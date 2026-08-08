"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { WHATSAPP_NUMBER, PHONE_NUMBER } from "@/lib/constants";

const CONTACT_CARDS = [
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    label: "Phone",
    value: PHONE_NUMBER || "+91 98765 43210",
    href: `tel:${PHONE_NUMBER || "+919876543210"}`,
    description: "Mon-Sat, 10 AM - 7 PM",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    label: "Email",
    value: "Jangidvikas5524@gmail.com",
    href: "mailto:Jangidvikas5524@gmail.com",
    description: "We respond within 24 hours",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    label: "Address",
    value: "3 Mohan nagar behind Balaji paradise Sikar road haramara",
    href: "https://maps.google.com",
    description: "Jaipur, Rajasthan 302013",
  },
  {
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    label: "Working Hours",
    value: "Mon - Sat: 10 AM - 7 PM",
    href: null,
    description: "Sunday: 11 AM - 6 PM",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
    label: "WhatsApp",
    value: WHATSAPP_NUMBER || "+91 98765 43210",
    href: WHATSAPP_NUMBER
      ? `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`
      : "#",
    description: "Quick response guaranteed",
  },
];

export function ContactCards() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative -mt-16 z-10 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div ref={ref} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {CONTACT_CARDS.map((card, i) => {
            const Wrapper = card.href ? "a" : "div";
            const wrapperProps = card.href
              ? {
                  href: card.href,
                  target: card.href.startsWith("http") ? "_blank" : undefined,
                  rel: card.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined,
                }
              : {};

            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Wrapper
                  {...wrapperProps}
                  className="group flex flex-col items-center border border-[#E8E2D9] bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#B8956A] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] block"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center bg-[#F5F3EF] text-[#B8956A] transition-colors duration-300 group-hover:bg-[#B8956A] group-hover:text-white">
                    {card.icon}
                  </div>
                  <p className="text-xs font-medium tracking-wider uppercase text-[#9A9590]">
                    {card.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#1A1714]">
                    {card.value}
                  </p>
                  <p className="mt-1 text-xs text-[#7A7570]">
                    {card.description}
                  </p>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
