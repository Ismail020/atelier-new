import { type SchemaTypeDefinition } from "sanity";
import { localeType } from "./locale";
import { pageType } from "./page";
import { navbarType } from "./navbar";
import { footerType } from "./footer";
import { settingsType } from "./settings";
import { projectType } from "./project";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    pageType,
    localeType,
    navbarType,
    footerType,
    settingsType,
    projectType,
  ],
};
