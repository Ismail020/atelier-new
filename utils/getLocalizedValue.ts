// Helper function to get localized value from internationalized array
export function getLocalizedValue(
  content: Array<{ _key: string; _type: string; value?: string }> | string | null | undefined,
  locale: string,
): string {
  if (!content) return "";
  if (typeof content === "string") return content;

  const localizedItem = content.find((item) => item._key === locale);
  return localizedItem?.value || content[0]?.value || "";
}