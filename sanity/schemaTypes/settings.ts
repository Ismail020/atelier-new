import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const settingsType = defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      description: "Used for SEO and browser titles",
    }),
    defineField({
      name: "contactInfo",
      title: "Contact Information",
      type: "object",
      fields: [
        defineField({
          name: "headOfDesign",
          title: "Head of Design",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "phone",
              title: "Phone Number",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "email",
              title: "Email Address",
              type: "email",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
        defineField({
          name: "generalInquiries",
          title: "Other Related Questions",
          type: "object",
          fields: [
            defineField({
              name: "email",
              title: "Email Address",
              type: "email",
              validation: (rule) => rule.required(),
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "socialMedia",
      title: "Social Media Links",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          title: "Social Link",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: [
                  { title: "Facebook", value: "Facebook" },
                  { title: "Instagram", value: "Instagram" },
                  { title: "Twitter", value: "Twitter" },
                  { title: "LinkedIn", value: "Linkedin" },
                  { title: "YouTube", value: "Youtube" },
                  { title: "TikTok", value: "Tiktok" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (rule) => rule.required().uri({ allowRelative: false }),
            }),
          ],
          preview: {
            select: {
              platform: "platform",
              url: "url",
            },
            prepare({ platform, url }) {
              const icons: { [key: string]: string } = {
                facebook: "📘",
                instagram: "📷",
                twitter: "🐦",
                linkedin: "💼",
                youtube: "🎥",
                tiktok: "🎵",
              };

              return {
                title: platform
                  ? `${icons[platform]} ${platform.charAt(0).toUpperCase() + platform.slice(1)}`
                  : "Social Link",
                subtitle: url,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "contactUsButton",
      title: "Contact Us Button",
      type: "object",
      description: "Global configuration for the Contact Us button on project pages",
      fields: [
        defineField({
          name: "text",
          title: "Button Text",
          type: "internationalizedArrayString",
          description: "Button text in multiple languages",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "contactPages",
          title: "Contact Pages",
          type: "object",
          description: "Select contact pages for each language",
          fields: [
            defineField({
              name: "english",
              title: "English Contact Page",
              type: "reference",
              to: [{ type: "page" }],
              options: {
                filter: 'language == "en"',
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "french",
              title: "French Contact Page",
              type: "reference",
              to: [{ type: "page" }],
              options: {
                filter: 'language == "fr"',
              },
              validation: (rule) => rule.required(),
            }),
          ],
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "style",
          title: "Button Style",
          type: "string",
          options: {
            list: [
              { title: "Primary", value: "primary" },
              { title: "Secondary", value: "secondary" },
              { title: "Outline", value: "outline" },
            ],
          },
          initialValue: "primary",
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Site Settings",
        subtitle: "Global site configuration",
      };
    },
  },
});
