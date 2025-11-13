import type { StructureResolver } from "sanity/structure";
import { TranslateIcon, DocumentIcon } from "@sanity/icons";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .icon(DocumentIcon)
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
                .icon(TranslateIcon)
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

      ...S.documentTypeListItems().filter(
        (listItem) => listItem.getId() !== "page"
      ),
    ]);
