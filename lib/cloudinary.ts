import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function getOptimizedUrl(publicId: string, options?: Record<string, unknown>): string {
  return cloudinary.url(publicId, {
    fetch_format: 'auto',
    quality: 'auto',
    ...options,
  });
}

export function getThumbnailUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    width: 200,
    height: 200,
    crop: 'fill',
    fetch_format: 'auto',
    quality: 'auto',
  });
}

export async function generateUploadSignature(
  folder: string = 'furniture',
  options?: Record<string, unknown>,
): Promise<{ timestamp: number; signature: string; folder: string }> {
  const timestamp = Math.round(Date.now() / 1000);
  const params: Record<string, unknown> = { timestamp, folder, ...options };
  const signature = cloudinary.utils.api_sign_request(
    params as Record<string, string>,
    process.env.CLOUDINARY_API_SECRET!,
  );
  return { timestamp, signature, folder };
}

export { cloudinary };
