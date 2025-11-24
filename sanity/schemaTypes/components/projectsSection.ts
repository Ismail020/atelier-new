import { defineField } from "sanity";

export const projectsSection = {
  type: "object",
  name: "projectsSection",
  title: "Projects Section",
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      description: "Title for the projects section",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectsPageLink",
      title: "Projects Page Link",
      type: "reference",
      to: [{ type: "page" }],
      description: "Link to the main projects page",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "projectLinkText",
      title: "Project Button Text",
      type: "string",
      description: "Text for individual project buttons (e.g. 'View Project', 'Learn More')",
      validation: (rule) => rule.required(),
      placeholder: "View Project",
    }),
    defineField({
      name: "viewAllLinkText",
      title: "View All Link Text",
      type: "string",
      description: "Text for the projects page link (e.g. 'View All Projects')",
      validation: (rule) => rule.required(),
      placeholder: "View All Projects",
    }),
    defineField({
      name: "selectedProjects",
      title: "Selected Projects",
      type: "array",
      description: "Select exactly 4 projects to display",
      validation: (rule) => rule.required().min(4).max(4).error("Please select exactly 4 projects"),
      of: [
        {
          type: "reference",
          to: [{ type: "project" }],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      selectedProjects: "selectedProjects",
    },
    prepare({ title, selectedProjects }: { title?: string; selectedProjects?: Array<unknown> }) {
      const projectCount = selectedProjects?.length || 0;

      return {
        title: "Projects Section",
        subtitle: `${title || "No title"} - ${projectCount}/4 projects selected`,
      };
    },
  },
};
