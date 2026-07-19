'use client';

import { useCallback, useRef, useState } from 'react';

interface CloudinaryUploadButtonProps {
  onUpload: (result: { url: string; public_id: string; secure_url: string; width: number; height: number }) => void;
  folder?: string;
  label?: string;
}

export function CloudinaryUploadButton({ onUpload, folder = 'furniture', label = 'Upload Image' }: CloudinaryUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('Only image and video files are allowed');
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be under 10MB');
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', folder);

        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Upload failed');

        const result = await res.json();
        onUpload({
          url: result.secure_url || result.url,
          public_id: result.public_id,
          secure_url: result.secure_url,
          width: result.width || 0,
          height: result.height || 0,
        });
      } catch {
        alert('Upload failed. Please try again.');
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = '';
      }
    },
    [onUpload, folder],
  );

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFile}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : label}
      </button>
    </>
  );
}
