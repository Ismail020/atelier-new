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
          name: "logo",
          title: "Logo",
          type: "image",
          options: { hotspot: true },
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
