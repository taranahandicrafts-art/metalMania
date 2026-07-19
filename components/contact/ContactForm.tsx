'use client';

import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

interface FormData {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const INITIAL_DATA: FormData = {
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
};

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = 'Name is required';
  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^[6-9]\d{9}$/.test(data.phone.replace(/[\s\-+]/g, '').slice(-10))) {
    errors.phone = 'Enter a valid 10-digit Indian phone number';
  }
  if (!data.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!data.subject.trim()) errors.subject = 'Subject is required';
  if (!data.message.trim()) {
    errors.message = 'Message is required';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }
  return errors;
}

export function ContactForm() {
  const [data, setData] = useState<FormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('success');
        setData(INITIAL_DATA);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center border border-[#E8E2D9] bg-white p-12 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center bg-[#7A9A7E]/10 text-[#7A9A7E]">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-[#1A1714]">
          Message sent successfully
        </h3>
        <p className="mt-2 text-sm text-[#7A7570]">
          Thank you for reaching out. We will get back to you within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-6 text-sm font-medium text-[#B8956A] hover:text-[#A07D52]"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-medium text-[#4A4540]"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={data.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          className={`h-12 w-full border bg-white px-4 text-sm text-[#1A1714] placeholder-[#9A9590] outline-none transition-all duration-200 ${
            errors.name
              ? 'border-[#C4705A] focus:border-[#C4705A] focus:shadow-[0_0_0_3px_rgba(196,112,90,0.1)]'
              : 'border-[#D4C8B8] focus:border-[#B8956A] focus:shadow-[0_0_0_3px_rgba(184,149,106,0.1)]'
          }`}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-[#C4705A]">{errors.name}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-[#4A4540]"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className={`h-12 w-full border bg-white px-4 text-sm text-[#1A1714] placeholder-[#9A9590] outline-none transition-all duration-200 ${
              errors.phone
                ? 'border-[#C4705A] focus:border-[#C4705A] focus:shadow-[0_0_0_3px_rgba(196,112,90,0.1)]'
                : 'border-[#D4C8B8] focus:border-[#B8956A] focus:shadow-[0_0_0_3px_rgba(184,149,106,0.1)]'
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-[#C4705A]">{errors.phone}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-[#4A4540]"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`h-12 w-full border bg-white px-4 text-sm text-[#1A1714] placeholder-[#9A9590] outline-none transition-all duration-200 ${
              errors.email
                ? 'border-[#C4705A] focus:border-[#C4705A] focus:shadow-[0_0_0_3px_rgba(196,112,90,0.1)]'
                : 'border-[#D4C8B8] focus:border-[#B8956A] focus:shadow-[0_0_0_3px_rgba(184,149,106,0.1)]'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-[#C4705A]">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="mb-1.5 block text-sm font-medium text-[#4A4540]"
        >
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={data.subject}
          onChange={handleChange}
          className={`h-12 w-full border bg-white px-4 text-sm text-[#1A1714] outline-none transition-all duration-200 ${
            errors.subject
              ? 'border-[#C4705A] focus:border-[#C4705A]'
              : 'border-[#D4C8B8] focus:border-[#B8956A] focus:shadow-[0_0_0_3px_rgba(184,149,106,0.1)]'
          }`}
        >
          <option value="">Select a subject</option>
          <option value="general">General Inquiry</option>
          <option value="order">Order Status</option>
          <option value="custom">Custom Furniture</option>
          <option value="warranty">Warranty Claim</option>
          <option value="visit">Schedule a Visit</option>
          <option value="bulk">Bulk / Corporate Order</option>
        </select>
        {errors.subject && (
          <p className="mt-1 text-xs text-[#C4705A]">{errors.subject}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-[#4A4540]"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={data.message}
          onChange={handleChange}
          rows={5}
          placeholder="Tell us about your requirements..."
          className={`w-full resize-y border bg-white px-4 py-3 text-sm text-[#1A1714] placeholder-[#9A9590] outline-none transition-all duration-200 ${
            errors.message
              ? 'border-[#C4705A] focus:border-[#C4705A] focus:shadow-[0_0_0_3px_rgba(196,112,90,0.1)]'
              : 'border-[#D4C8B8] focus:border-[#B8956A] focus:shadow-[0_0_0_3px_rgba(184,149,106,0.1)]'
          }`}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-[#C4705A]">{errors.message}</p>
        )}
      </div>

      {status === 'error' && (
        <p className="text-sm text-[#C4705A]">
          Something went wrong. Please try again or contact us directly.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="h-12 w-full bg-[#1A1714] text-sm font-medium uppercase tracking-wider text-white transition-all duration-200 hover:bg-[#2C2824] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'loading' ? (
          <span className="inline-flex items-center gap-2">
            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Sending...
          </span>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
