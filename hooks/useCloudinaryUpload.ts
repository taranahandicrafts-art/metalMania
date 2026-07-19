'use client';

import { useState, useCallback } from 'react';
import { v2 as cloudinary } from 'cloudinary';

interface UploadState {
  uploading: boolean;
  progress: number;
  error: string | null;
  url: string | null;
  publicId: string | null;
}

export function useCloudinaryUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
    url: null,
    publicId: null,
  });

  const upload = useCallback(async (file: File, folder: string = 'furniture') => {
    setState({ uploading: true, progress: 0, error: null, url: null, publicId: null });

    try {
      const sigRes = await fetch('/api/media/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder }),
      });

      if (!sigRes.ok) throw new Error('Failed to get upload signature');
      const { timestamp, signature } = await sigRes.json();

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append('timestamp', timestamp.toString());
      formData.append('signature', signature);
      formData.append('folder', folder);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setState((prev) => ({ ...prev, progress: Math.round((e.loaded / e.total) * 100) }));
        }
      };

      const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error('Upload failed'));
          }
        };
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(formData);
      });

      setState({
        uploading: false,
        progress: 100,
        error: null,
        url: result.secure_url,
        publicId: result.public_id,
      });

      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setState({ uploading: false, progress: 0, error: message, url: null, publicId: null });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ uploading: false, progress: 0, error: null, url: null, publicId: null });
  }, []);

  return { ...state, upload, reset };
}
