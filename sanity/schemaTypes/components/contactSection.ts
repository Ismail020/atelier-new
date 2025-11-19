import { defineField } from "sanity";

export const contactSection = {
  type: "object",
  name: "contactSection",
  title: "Contact Section",
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contactUsImage",
      title: "Contact Us Image",
      type: "image",
      options: { hotspot: true },
      description: "Image for the 'Contact Us' visual element",
      validation: (rule) => rule.required(),
    }),
    
    // Column 1: Head of Design
    defineField({
      name: "column1Title",
      title: "Column 1 Title (Head of Design)",
      type: "string",
      validation: (rule) => rule.required(),
      placeholder: "Head of Design",
    }),
    defineField({
      name: "column1Info",
      title: "Column 1 Info Source",
      type: "boolean",
      readOnly: true,
      initialValue: true,
      description: "Name, phone & email from Settings -> Contact Info -> Head of Design",
    }),

    // Column 2: Other Related Questions  
    defineField({
      name: "column2Title",
      title: "Column 2 Title (Other Questions)",
      type: "string", 
      validation: (rule) => rule.required(),
      placeholder: "Other Related Questions",
    }),
    defineField({
      name: "column2Info",
      title: "Column 2 Info Source",
      type: "boolean",
      readOnly: true,
      initialValue: true,
      description: "Email from Settings -> Contact Info -> Other Related Questions",
    }),

    // Column 3: Socials
    defineField({
      name: "column3Title", 
      title: "Column 3 Title (Socials)",
      type: "string",
      validation: (rule) => rule.required(),
      placeholder: "Socials",
    }),
    defineField({
      name: "column3Info",
      title: "Column 3 Info Source", 
      type: "boolean",
      readOnly: true,
      initialValue: true,
      description: "Social media accounts are pulled from global settings",
    }),
  ],
  preview: {
    select: {
      title: "title",
      column1Title: "column1Title",
      column2Title: "column2Title", 
      column3Title: "column3Title",
    },
    prepare({ title, column1Title, column2Title, column3Title }: { 
      title?: string; 
      column1Title?: string;
      column2Title?: string;
      column3Title?: string;
    }) {
      const columns = [column1Title, column2Title, column3Title].filter(Boolean).join(" | ");
      
      return {
        title: "Contact Section",
        subtitle: `${title || "No title"} - ${columns || "No column titles"}`,
      };
    },
  },
};