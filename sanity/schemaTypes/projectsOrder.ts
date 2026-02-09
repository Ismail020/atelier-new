import { defineField, defineType } from "sanity";
import { ProjectsIcon } from "@sanity/icons";

export const projectsOrderType = defineType({
  name: "projectsOrder",
  title: "Projects Order",
  type: "document",
  icon: ProjectsIcon,
  fields: [
    defineField({
      name: "orderedProjects",
      title: "Ordered Projects",
      type: "array",
      description: "Drag to reorder the projects page.",
      of: [
        {
          type: "reference",
          to: [{ type: "project" }],
        },
      ],
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Projects Order",
      };
    },
  },
});
