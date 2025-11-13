import { defineField, defineType } from "sanity";
import { SlugPreviewInput } from "./components/SlugPreviewInput";

export const pageType = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "name",
      type: "string",
      components: {
        input: SlugPreviewInput,
      },
    }),

    defineField({
      name: "language",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      language: 'language'
    },
    prepare({title, language}) {
      const languageFlag = language === 'en' ? '🇺🇸' : language === 'fr' ? '🇫🇷' : '🌐';
      const languageName = language === 'en' ? 'EN' : language === 'fr' ? 'FR' : language || 'Unknown';
      
      return {
        title: title || 'Untitled',
        subtitle: `${languageFlag} ${languageName}`,
        media: undefined
      }
    }
  }
});
