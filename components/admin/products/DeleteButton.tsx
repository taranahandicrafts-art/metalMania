'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.refresh();
      }
    } catch {
      // silently fail
    }
    setConfirming(false);
  };

  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <button onClick={handleDelete} className="text-sm text-destructive hover:text-destructive/80">
          Confirm
        </button>
        <button onClick={() => setConfirming(false)} className="text-sm text-muted-foreground hover:text-foreground">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="text-sm text-muted-foreground underline underline-offset-2 hover:text-destructive">
      Delete
    </button>
  );
}
