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
          name: "email",
          title: "Email Address",
          type: "email",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "phone",
          title: "Phone Number",
          type: "string",
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
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "Twitter", value: "twitter" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "YouTube", value: "youtube" },
                  { title: "TikTok", value: "tiktok" },
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
                title: platform ? `${icons[platform]} ${platform.charAt(0).toUpperCase() + platform.slice(1)}` : "Social Link",
                subtitle: url,
              };
            },
          },
        },
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