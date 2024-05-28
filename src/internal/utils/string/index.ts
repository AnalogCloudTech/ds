export function capitalizeFirstLetter(text: string): string {
  const lower = text.toLowerCase();
  const firstLetter = text.charAt(0).toUpperCase();

  return `${firstLetter}${lower.slice(1)}`;
}
