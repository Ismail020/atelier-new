import { defineType, defineField } from "sanity";
import { menuItems } from "./components/menuItems";
import { createButtonsArray } from "./components/buttonsArray";

export const navbarType = defineType({
  name: "navbar",
  title: "Navbar",
  type: "document",
  fields: [
    defineField({
      name: "navbarStructure",
      title: "Navbar Structure",
      type: "object",
      fields: [
        defineField({
          name: "brandText",
          title: "Brand Text",
          type: "string",
          description: "Text shown before logo, will be replaced by logo on scroll",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "logo",
          title: "Logo",
          type: "image",
          options: { hotspot: true },
          description: "Logo shown after scroll",
        }),
        menuItems,
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Navbar",
      };
    },
  },
});
