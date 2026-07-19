export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function ensureUniqueSlug(
  slug: string,
  model: { findOne: (query: Record<string, unknown>) => Promise<{ _id: string } | null> },
  existingId?: string,
): Promise<string> {
  let candidate = slug;
  let counter = 1;
  while (true) {
    const existing = await model.findOne({ slug: candidate });
    if (!existing || (existingId && existing._id.toString() === existingId)) {
      return candidate;
    }
    candidate = `${slug}-${counter}`;
    counter++;
  }
}
