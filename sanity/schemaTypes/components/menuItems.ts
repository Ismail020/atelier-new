import { defineField } from "sanity";

// Create a menu items array that can be used per language
export const createMenuItemsForLanguage = (language: "en" | "fr") =>
  defineField({
    name: `menuItems${language.toUpperCase()}`,
    title: `Menu Items (${language.toUpperCase()})`,
    type: "array",
    of: [
      {
        type: "object",
        name: "menuItem",
        title: "Menu Item",
        fields: [
          defineField({
            name: "page",
            type: "reference",
            title: "Page",
            to: [{ type: "page" }],
            options: {
              filter: `language == "${language}"`,
            },
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "mobileImage",
            type: "image",
            title: "Mobile Menu Image",
            description: `Mobile menu image for ${language.toUpperCase()} version`,
            options: { hotspot: true },
            validation: (rule) => rule.required(),
          }),
        ],
        preview: {
          select: {
            pageName: "page.name",
            pageLanguage: "page.language",
          },
          prepare(selection: {
            pageName?: string;
            pageLanguage?: string;
            mobileImage?: { asset: { url: string } };
          }) {
            const { pageName, pageLanguage } = selection;

            const displayText = pageName || "No page selected";

            const languageFlag = pageLanguage === "en" ? "🇺🇸" : pageLanguage === "fr" ? "🇫🇷" : "🌐";

            return {
              title: displayText,
              subtitle: `${languageFlag} ${pageName || "No page selected"}`,
            };
          },
        },
      },
    ],
  });

export const menuItems = defineField({
  name: "menuItems",
  title: "Menu Items",
  type: "object",
  fields: [createMenuItemsForLanguage("en"), createMenuItemsForLanguage("fr")],
});
