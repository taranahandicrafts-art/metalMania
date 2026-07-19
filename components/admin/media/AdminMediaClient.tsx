'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface MediaItem {
  _id: string;
  url: string;
  filename: string;
  mimetype: string;
  size: number;
  alt: string;
  created_at: string;
}

interface AdminMediaClientProps {
  initialMedia: MediaItem[];
}

export function AdminMediaClient({ initialMedia }: AdminMediaClientProps) {
  const router = useRouter();
  const [media, setMedia] = useState(initialMedia);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragging(true);
    else if (e.type === 'dragleave') setDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) await uploadFiles(Array.from(files));
  }, []);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await uploadFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  }, []);

  const uploadFiles = async (files: File[]) => {
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));

      const res = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      if (data.media) setMedia((prev) => [...data.media, ...prev]);
      router.refresh();
    } catch {
      // silently fail
    } finally {
      setUploading(false);
    }
  };

  const copyUrl = useCallback((url: string) => {
    navigator.clipboard.writeText(url);
  }, []);

  return (
    <div className="space-y-6">
      <div
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
          dragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 text-muted-foreground">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        <p className="text-sm font-medium">{uploading ? 'Uploading...' : 'Drop files or click to upload'}</p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP up to 10MB</p>
        <input id="file-input" type="file" multiple accept="image/*" className="hidden" onChange={handleFileInput} disabled={uploading} />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {media.map((item) => (
          <div key={item._id} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
            <Image src={item.url} alt={item.alt || item.filename} fill sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw" className="object-cover" />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button type="button" onClick={() => copyUrl(item.url)} className="rounded bg-white px-2 py-1 text-xs font-medium text-black hover:bg-white/90">
                Copy URL
              </button>
            </div>
            <p className="absolute bottom-0 left-0 right-0 truncate bg-gradient-to-t from-black/60 to-transparent px-2 pb-1 pt-4 text-xs text-white">
              {item.filename}
            </p>
          </div>
        ))}
        {media.length === 0 && !uploading && (
          <p className="col-span-full py-12 text-center text-sm text-muted-foreground">No media uploaded yet</p>
        )}
      </div>
    </div>
  );
}
