import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const settingsType = defineType({
  name: "settings",
  title: "Site Settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "general", title: "General", default: true },
    { name: "contact", title: "Contact" },
    { name: "social", title: "Social" },
    { name: "cta", title: "Buttons" },
    { name: "labels", title: "Labels" },
    { name: "seo", title: "SEO" },
    { name: "structuredData", title: "Structured Data" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Site Title",
      type: "string",
      description: "Used for SEO and browser titles",
      group: "general",
    }),
    defineField({
      name: "seoDefaultImage",
      title: "Default SEO Image",
      type: "image",
      group: "seo",
      description: "Open Graph / social share image fallback",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "contactInfo",
      title: "Contact Information",
      type: "object",
      group: "contact",
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
      group: "social",
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
      group: "cta",
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
    defineField({
      name: "relatedProjectsTitle",
      title: "Related Projects Title",
      type: "internationalizedArrayString",
      description: "Title for the related projects section on project pages",
      group: "labels",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "viewAllLinkText",
      title: "View All Link Text",
      type: "internationalizedArrayString",
      description: "Text for the view all projects link",
      group: "labels",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "structuredData",
      title: "Structured Data",
      type: "object",
      group: "structuredData",
      fields: [
        defineField({
          name: "localBusiness",
          title: "Local Business",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
            defineField({
              name: "image",
              title: "Image URL",
              type: "image",
              options: {
                hotspot: true,
              },
            }),
            defineField({
              name: "address",
              title: "Address",
              type: "object",
              fields: [
                defineField({
                  name: "addressCountry",
                  title: "Country",
                  type: "string",
                }),
                defineField({
                  name: "addressLocality",
                  title: "Locality",
                  type: "string",
                }),
                defineField({
                  name: "addressRegion",
                  title: "Region",
                  type: "string",
                }),
                defineField({
                  name: "postalCode",
                  title: "Postal Code",
                  type: "string",
                }),
                defineField({
                  name: "streetAddress",
                  title: "Street Address",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "telephone",
              title: "Telephone",
              type: "string",
            }),
          ],
        }),
        defineField({
          name: "website",
          title: "Website",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
            }),
          ],
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
