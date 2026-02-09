import { type SchemaTypeDefinition } from "sanity";
import { localeType } from "./locale";
import { pageType } from "./page";
import { navbarType } from "./navbar";
import { footerType } from "./footer";
import { settingsType } from "./settings";
import { projectType } from "./project";
import { projectsOrderType } from "./projectsOrder";
import { pressType } from "./press";
import { headlineSection } from "./components/headlineSection";
import { projectsSection } from "./components/projectsSection";
import { allProjectsSection } from "./components/allProjectsSection";
import { contentSection } from "./components/contentSection";
import { contactSection } from "./components/contactSection";
import { pressCoverageSection } from "./components/pressCoverageSection";
import { termsConditionsSection } from "./components/termsConditionsSection";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    pageType,
    localeType,
    navbarType,
    footerType,
    settingsType,
    projectType,
    projectsOrderType,
    pressType,
    headlineSection,
    projectsSection,
    allProjectsSection,
    contentSection,
    contactSection,
    pressCoverageSection,
    termsConditionsSection,
  ],
};
