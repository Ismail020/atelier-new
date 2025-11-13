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
            name: "linkText",
            type: "string",
            title: "Link Text",
            description:
              "Custom text for this menu item. If not provided, the page name will be used.",
          }),
        ],
        preview: {
          select: {
            linkText: "linkText",
            pageName: "page.name",
            pageLanguage: "page.language",
          },
          prepare(selection: {
            linkText?: string;
            pageName?: string;
            pageLanguage?: string;
          }) {
            const { linkText, pageName, pageLanguage } = selection;

            // Use custom link text if available, otherwise fall back to page name
            const displayText = linkText || pageName || "No page selected";

            const languageFlag =
              pageLanguage === "en"
                ? "🇺🇸"
                : pageLanguage === "fr"
                  ? "🇫🇷"
                  : "🌐";

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
