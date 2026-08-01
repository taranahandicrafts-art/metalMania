'use client';

import { useState, useCallback } from 'react';

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

interface AdminFAQClientProps {
  initialFaqs: FAQItem[];
}

const inputClass =
  'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

export default function AdminFAQClient({ initialFaqs }: AdminFAQClientProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFaqs);
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({ question: '', answer: '', sort_order: 0, is_active: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setForm({ question: '', answer: '', sort_order: faqs.length, is_active: true });
    setEditing(null);
    setIsNew(true);
    setError(null);
  };

  const openEdit = useCallback((faq: FAQItem) => {
    setForm({ question: faq.question, answer: faq.answer, sort_order: faq.sort_order, is_active: faq.is_active });
    setEditing(faq);
    setIsNew(false);
    setError(null);
  }, []);

  const closeForm = () => {
    setEditing(null);
    setIsNew(false);
    setError(null);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      setError('Question and answer are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isNew) {
        const res = await fetch('/api/faqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to create');
        const created = await res.json();
        setFaqs((prev) => [...prev, created]);
      } else if (editing) {
        const res = await fetch(`/api/faqs/${editing._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).error || 'Failed to update');
        const updated = await res.json();
        setFaqs((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
      }
      closeForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    try {
      const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setFaqs((prev) => prev.filter((f) => f._id !== id));
    } catch {
      alert('Failed to delete FAQ');
    }
  }, []);

  const handleToggleActive = useCallback(async (faq: FAQItem) => {
    try {
      const res = await fetch(`/api/faqs/${faq._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !faq.is_active }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setFaqs((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
    } catch {
      alert('Failed to update FAQ');
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={openNew}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          + New FAQ
        </button>
      </div>

      {/* Inline form */}
      {(isNew || editing) && (
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <h3 className="text-lg font-semibold">{isNew ? 'New FAQ' : 'Edit FAQ'}</h3>
          {error && (
            <p className="rounded border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <label className="text-sm font-medium">Question</label>
            <input
              className={inputClass}
              value={form.question}
              onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
              placeholder="What is your question?"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Answer</label>
            <textarea
              className={`${inputClass} min-h-24 resize-y`}
              value={form.answer}
              onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
              placeholder="Provide a clear, helpful answer…"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order</label>
              <input
                type="number"
                className={inputClass}
                value={form.sort_order}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
              />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Active (show on home page)
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="inline-flex h-9 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FAQ list */}
      {faqs.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
          No FAQs yet. Click <strong>+ New FAQ</strong> to add one.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((faq) => (
                <tr key={faq._id} className="border-b last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-muted-foreground">{faq.sort_order}</td>
                  <td className="px-4 py-3 max-w-md">
                    <p className="font-medium">{faq.question}</p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{faq.answer}</p>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(faq)}
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        faq.is_active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                      }`}
                    >
                      {faq.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(faq)}
                        className="rounded px-2 py-1 text-xs font-medium hover:bg-muted"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(faq._id)}
                        className="rounded px-2 py-1 text-xs font-medium text-destructive hover:bg-destructive/10"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
