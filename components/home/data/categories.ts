/** Built-in entry (not a DB category) listing every product tagged New Arrival. */
export const NEW_ARRIVALS_LABEL = 'New Arrivals';

/** "All", then "New Arrivals", then the given categories (dropping any duplicate "New Arrivals"). */
export function withDefaultCategories(names: string[]): string[] {
  const rest = names.filter(
    (n) => n !== 'All' && n.toLowerCase() !== NEW_ARRIVALS_LABEL.toLowerCase(),
  );
  return ['All', NEW_ARRIVALS_LABEL, ...rest];
}
