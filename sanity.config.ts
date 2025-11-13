"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { TranslateIcon, DocumentIcon } from "@sanity/icons";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { documentInternationalization } from "@sanity/document-internationalization";
import { internationalizedArray } from "sanity-plugin-internationalized-array";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema: {
    ...schema,
    templates: (prev) => [
      ...prev.filter((template) => template.schemaType !== "page"),
      {
        id: "page-en",
        title: "English page",
        description: "Create a new page in English",
        schemaType: "page",
        icon: DocumentIcon,
        value: {
          language: "en",
        },
      },
      {
        id: "page-fr",
        title: "French page",
        description: "Create a new page in French",
        schemaType: "page",
        icon: TranslateIcon,
        value: {
          language: "fr",
        },
      },
    ],
  },
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    documentInternationalization({
      // fetch locales from Content Lake or load from your locale file
      supportedLanguages: (client) =>
        client.fetch(`*[_type == "locale"]{"id": tag, "title":name}`),
      // define schema types using document level localization
      schemaTypes: ["page"],
    }),
    internationalizedArray({
      // Use client to fetch locales or import from local locale file
      languages: (client) =>
        client.fetch(`*[_type == "locale"]{"id": tag, "title":name}`),
      // Define field types to localize as-needed
      fieldTypes: ["string"],
    }),
  ],
});
