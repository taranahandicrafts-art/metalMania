'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQ_ITEMS = [
  {
    question: 'How long does it take to receive my order?',
    answer:
      'Standard delivery takes 2-3 weeks for in-stock items. Custom orders require 4-6 weeks for crafting. We offer complimentary white-glove delivery within 50 km of our showroom.',
  },
  {
    question: 'What wood types do you work with?',
    answer:
      'We primarily work with sheesham (Indian rosewood), teak, mango wood, and acacia. All our wood is sourced from FSC-certified forests and kiln-dried to optimal moisture levels for lasting durability.',
  },
  {
    question: 'Do you offer customization?',
    answer:
      'Yes. Our bespoke service allows you to choose from over 40 wood finishes, 200+ fabrics, and custom dimensions. Contact our design team to discuss your requirements and receive a personalized quote.',
  },
  {
    question: 'What is your warranty policy?',
    answer:
      'Every piece comes with a 10-year structural warranty covering joints, frames, and hardware. Fabric and leather carry a 3-year warranty. We also offer an extended warranty program for additional coverage.',
  },
  {
    question: 'Can I visit your showroom?',
    answer:
      'Our showroom is open Monday through Saturday, 10 AM to 7 PM, and Sunday, 11 AM to 6 PM. Our design consultants are available to help you explore collections and discuss customization options.',
  },
  {
    question: 'How do you ensure quality?',
    answer:
      'Each piece passes through 12 quality checkpoints before delivery. Our quality manager personally inspects every item. We use precision measuring tools, hand-test all moving parts, and verify finish consistency.',
  },
  {
    question: 'Do you provide assembly service?',
    answer:
      'Yes, complimentary assembly is included with all deliveries within 50 km. Our trained team handles everything from unboxing to placement. For locations beyond 50 km, we provide detailed assembly guides and video tutorials.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day satisfaction guarantee. If you are not completely satisfied with your purchase, we will arrange a complimentary pickup and full refund. Custom-made items can only be returned if they arrive damaged or defective.',
  },
];

function FAQItem({ item }: { item: (typeof FAQ_ITEMS)[number] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#E8E2D9]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <span className="pr-4 text-base font-medium text-[#1A1714]">
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 text-[#B8956A]"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-[#7A7570]">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  return (
    <section className="bg-[#FAFAF8] py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-[#9A9590]">
            Common Questions
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1A1714] sm:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 divide-y">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.question} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
