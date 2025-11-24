import { defineType, defineField } from "sanity";
import { MasterDetailIcon } from "@sanity/icons";

export const footerType = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  icon: MasterDetailIcon,
  fields: [
    defineField({
      name: "logoDesktop",
      title: "Logo Desktop",
      type: "image",
      options: { hotspot: true },
      description: "Logo for desktop view",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logoMobile",
      title: "Logo Mobile",
      type: "image",
      options: { hotspot: true },
      description: "Logo for mobile view",
      validation: (rule) => rule.required(),
    }),

    // Column 1: Language switch and terms page
    defineField({
      name: "column1",
      title: "Column 1 - Language & Legal",
      type: "object",
      fields: [
        defineField({
          name: "showLanguageSwitch",
          title: "Show Language Switch",
          type: "boolean",
          initialValue: true,
          readOnly: true,
        }),
        defineField({
          name: "termsPageEN",
          title: "Terms Page (English)",
          type: "reference",
          to: [{ type: "page" }],
          options: {
            filter: 'language == "en"',
          },
          description: "Select the English Terms of Services page",
        }),
        defineField({
          name: "termsPageFR",
          title: "Terms Page (French)",
          type: "reference",
          to: [{ type: "page" }],
          options: {
            filter: 'language == "fr"',
          },
          description: "Select the French Conditions Générales page",
        }),
      ],
    }),

    // Column 2: Contact info (references settings)
    defineField({
      name: "column2",
      title: "Column 2 - Contact Info",
      type: "object",
      fields: [
        defineField({
          name: "useSettingsContact",
          title: "Use Contact Info from Settings",
          type: "boolean",
          description: "Email and phone will be pulled from Site Settings",
          initialValue: true,
          readOnly: true,
        }),
      ],
    }),

    // Column 3: Social media (references settings)
    defineField({
      name: "column3",
      title: "Column 3 - Social Media",
      type: "object",
      fields: [
        defineField({
          name: "useSettingsSocial",
          title: "Use Social Media from Settings",
          type: "boolean",
          description: "Social media links will be pulled from Site Settings",
          initialValue: true,
          readOnly: true,
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Footer" };
    },
  },
});
