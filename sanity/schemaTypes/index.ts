import { type SchemaTypeDefinition } from "sanity";
import { localeType } from "./locale";
import { pageType } from "./page";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [pageType, localeType],
};
