import type { StructureResolver } from "sanity/structure";
import {
  DocumentIcon,
  DocumentsIcon,
  MenuIcon,
  MasterDetailIcon,
  CogIcon,
  TranslateIcon,
  ProjectsIcon,
  DocumentTextIcon,
} from "@sanity/icons";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Content section
      S.listItem()
        .title("Pages")
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title("Pages by Language")
            .items([
              S.listItem()
                .title("English Pages")
                .icon(DocumentIcon)
                .child(
                  S.documentTypeList("page")
                    .title("English Pages")
                    .filter('_type == "page" && language == "en"')
                ),

              S.listItem()
                .title("French Pages")
                .icon(DocumentIcon)
                .child(
                  S.documentTypeList("page")
                    .title("French Pages")
                    .filter('_type == "page" && language == "fr"')
                ),

              S.listItem()
                .title("Pages without language")
                .icon(DocumentIcon)
                .child(
                  S.documentTypeList("page")
                    .title("Pages without language")
                    .filter('_type == "page" && !defined(language)')
                ),
            ])
        ),

      // projects

      S.listItem()
        .title("Projects")
        .icon(ProjectsIcon)
        .child(S.documentTypeList("project").title("Projects")),

      // Press Coverage
      S.listItem()
        .title("Press Coverage")
        .icon(DocumentTextIcon)
        .child(S.documentTypeList("press").title("Press")),

      // Divider
      S.divider(),

      // Navigation
      S.listItem()
        .title("Navbar")
        .id("navbar")
        .child(S.document().schemaType("navbar").documentId("navbar"))
        .icon(MenuIcon),

      S.listItem()
        .title("Footer")
        .id("footer")
        .child(S.document().schemaType("footer").documentId("footer"))
        .icon(MasterDetailIcon),

      // Divider
      S.divider(),

      // Site Configuration section
      S.listItem()
        .title("Site Configuration")
        .icon(CogIcon)
        .child(
          S.list()
            .title("Site Configuration")
            .items([
              S.listItem()
                .title("Settings")
                .id("settings")
                .child(
                  S.document().schemaType("settings").documentId("settings")
                )
                .icon(CogIcon),

              S.listItem()
                .title("Locales")
                .child(S.documentTypeList("locale"))
                .icon(TranslateIcon),
            ])
        ),
    ]);
