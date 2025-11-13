import { defineField } from "sanity";

export const createButtonsArray = (options?: {
  group?: string;
  maxButtons?: number;
  title?: string;
  name?: string;
}) => {
  const {
    group,
    maxButtons = 2,
    title = "Buttons",
    name = "buttons",
  } = options || {};

  return defineField({
    name,
    title,
    type: "array",
    of: [
      {
        type: "object",
        name: "button",
        title: "Button",
        fields: [
          defineField({
            name: "linkText",
            type: "string",
            title: "Link Text",
            validation: (rule) => rule.required(),
          }),
          defineField({
            name: "linkType",
            type: "string",
            title: "Link Type",
            options: {
              list: [
                { title: "Page", value: "page" },
                { title: "Anchor Link", value: "anchor" },
                { title: "Email", value: "email" },
                { title: "Custom URL", value: "custom" },
              ],
              layout: "radio",
            },
            initialValue: "page",
          }),
          defineField({
            name: "page",
            type: "reference",
            title: "Page",
            to: [{ type: "page" }],
            hidden: ({ parent }) => parent?.linkType !== "page",
          }),
          defineField({
            name: "customUrl",
            type: "url",
            title: "Custom URL",
            hidden: ({ parent }) => parent?.linkType !== "custom",
          }),
          defineField({
            name: "anchorLink",
            type: "string",
            title: "Anchor Link",
            description:
              "Enter the anchor ID (without #). Example: 'about-section'",
            placeholder: "about-section",
            hidden: ({ parent }) => parent?.linkType !== "anchor",
          }),
          defineField({
            name: "email",
            type: "email",
            title: "Email Address",
            description: "Enter the email address (e.g., hello@example.com)",
            placeholder: "hello@example.com",
            hidden: ({ parent }) => parent?.linkType !== "email",
          }),
          defineField({
            name: "buttonStyle",
            type: "string",
            title: "Button Style",
            options: {
              list: [
                { title: "Primary", value: "primary" },
                { title: "Secondary", value: "secondary" },
              ],
              layout: "radio",
            },
            initialValue: "primary",
          }),
        ],
        preview: {
          select: {
            title: "linkText",
            linkType: "linkType",
            pageName: "page.name",
            customUrl: "customUrl",
            anchorLink: "anchorLink",
            email: "email",
            buttonStyle: "buttonStyle",
          },
          prepare(selection) {
            const {
              title,
              linkType,
              pageName,
              customUrl,
              anchorLink,
              email,
              buttonStyle,
            } = selection;
            let subtitle = "";

            if (linkType === "page" && pageName) {
              subtitle = `Page: ${pageName}`;
            } else if (linkType === "custom" && customUrl) {
              subtitle = `URL: ${customUrl}`;
            } else if (linkType === "anchor" && anchorLink) {
              subtitle = `Anchor: #${anchorLink}`;
            } else if (linkType === "email" && email) {
              subtitle = `Email: ${email}`;
            }

            if (buttonStyle) {
              subtitle += ` (${buttonStyle})`;
            }

            return {
              title: title || "Untitled Button",
              subtitle,
            };
          },
        },
      },
    ],
    ...(group && { group }),
    validation: (rule) =>
      rule.max(maxButtons).error(`Maximum ${maxButtons} buttons allowed`),
  });
};

// Backward compatibility - export default buttonsArray
export const buttonsArray = createButtonsArray({ group: "general" });
