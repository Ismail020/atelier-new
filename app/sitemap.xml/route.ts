import { client } from "@/sanity/lib/client";

interface PageSlugItem {
  slug: { current: string };
  _updatedAt?: string;
}

interface ProjectSlugItem {
  slug: { current: string };
  _updatedAt?: string;
}

interface TranslationGroupItem {
  _updatedAt?: string;
  translations?: Array<{
    language?: string;
    slug?: string;
    name?: string;
    noIndex?: boolean;
    updatedAt?: string;
  }>;
}

function absoluteUrl(baseUrl: string, path: string): string {
  return `${baseUrl}${path}`;
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  alternates?: Record<string, string>;
};

function renderUrl(entry: SitemapEntry): string {
  const alternateLinks = Object.entries(entry.alternates || {})
    .map(
      ([lang, href]) =>
        `    <xhtml:link rel=\"alternate\" hreflang=\"${xmlEscape(lang)}\" href=\"${xmlEscape(href)}\" />`,
    )
    .join("\n");

  return [
    "  <url>",
    `    <loc>${xmlEscape(entry.loc)}</loc>`,
    alternateLinks,
    entry.lastmod ? `    <lastmod>${xmlEscape(entry.lastmod)}</lastmod>` : "",
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function GET(request: Request) {
  const requestOrigin = new URL(request.url).origin;
  const baseUrl = process.env.SITE_URL || requestOrigin;

  const [translationGroups, frFallbackPages, enFallbackPages, projects] = await Promise.all([
    client.fetch<TranslationGroupItem[]>(
      `*[_type == "translation.metadata" && "page" in schemaTypes]{
        _updatedAt,
        "translations": translations[]{
          "language": value->language,
          "slug": value->slug.current,
          "name": value->name,
          "noIndex": value->noIndex,
          "updatedAt": value->_updatedAt
        }
      }`,
    ),
    client.fetch<PageSlugItem[]>(
      `*[_type == "page" && defined(slug.current) && name != "Home" && language == "fr" && noIndex != true]{ slug, _updatedAt }`,
    ),
    client.fetch<PageSlugItem[]>(
      `*[_type == "page" && defined(slug.current) && name != "Home" && language == "en" && noIndex != true]{ slug, _updatedAt }`,
    ),
    client.fetch<ProjectSlugItem[]>(
      `*[_type == "project" && defined(slug.current) && noIndex != true]{ slug, _updatedAt }`,
    ),
  ]);

  const entries: SitemapEntry[] = [
    {
      loc: absoluteUrl(baseUrl, "/"),
      alternates: {
        fr: absoluteUrl(baseUrl, "/"),
        en: absoluteUrl(baseUrl, "/en"),
        "x-default": absoluteUrl(baseUrl, "/"),
      },
    },
    {
      loc: absoluteUrl(baseUrl, "/en"),
      alternates: {
        fr: absoluteUrl(baseUrl, "/"),
        en: absoluteUrl(baseUrl, "/en"),
        "x-default": absoluteUrl(baseUrl, "/"),
      },
    },
  ];

  const pageEntriesFromTranslations = (translationGroups || []).flatMap((group) => {
    const validTranslations = (group.translations || []).filter(
      (item) =>
        item.slug &&
        item.name !== "Home" &&
        (item.language === "fr" || item.language === "en") &&
        item.noIndex !== true,
    );

    if (!validTranslations.length) {
      return [];
    }

    const frTranslation = validTranslations.find((item) => item.language === "fr");
    const enTranslation = validTranslations.find((item) => item.language === "en");

    const alternates: Record<string, string> = {};

    if (frTranslation?.slug) {
      alternates.fr = absoluteUrl(baseUrl, `/${frTranslation.slug}`);
      alternates["x-default"] = absoluteUrl(baseUrl, `/${frTranslation.slug}`);
    }

    if (enTranslation?.slug) {
      alternates.en = absoluteUrl(baseUrl, `/en/${enTranslation.slug}`);
    }

    return validTranslations.flatMap((item) => {
      if (!item.slug || !item.language) {
        return [];
      }

      const routePath = item.language === "en" ? `/en/${item.slug}` : `/${item.slug}`;
      const lastmod = item.updatedAt || group._updatedAt;

      return [
        {
          loc: absoluteUrl(baseUrl, routePath),
          lastmod,
          alternates,
        },
      ];
    });
  });

  const existingPageLocs = new Set(pageEntriesFromTranslations.map((entry) => entry.loc));

  const frFallbackEntries: SitemapEntry[] = (frFallbackPages || [])
    .filter((page) => page.slug?.current)
    .map((page) => ({
      loc: absoluteUrl(baseUrl, `/${page.slug.current}`),
      lastmod: page._updatedAt,
      alternates: {
        fr: absoluteUrl(baseUrl, `/${page.slug.current}`),
        "x-default": absoluteUrl(baseUrl, `/${page.slug.current}`),
      },
    }))
    .filter((entry) => !existingPageLocs.has(entry.loc));

  const enFallbackEntries: SitemapEntry[] = (enFallbackPages || [])
    .filter((page) => page.slug?.current)
    .map((page) => ({
      loc: absoluteUrl(baseUrl, `/en/${page.slug.current}`),
      lastmod: page._updatedAt,
      alternates: {
        en: absoluteUrl(baseUrl, `/en/${page.slug.current}`),
      },
    }))
    .filter((entry) => !existingPageLocs.has(entry.loc));

  const projectEntries: SitemapEntry[] = (projects || [])
    .filter((project) => project.slug?.current)
    .flatMap((project) => {
      const frPath = `/projets/${project.slug.current}`;
      const enPath = `/en/projects/${project.slug.current}`;

      return [
        {
          loc: absoluteUrl(baseUrl, frPath),
          lastmod: project._updatedAt,
          alternates: {
            fr: absoluteUrl(baseUrl, frPath),
            en: absoluteUrl(baseUrl, enPath),
            "x-default": absoluteUrl(baseUrl, frPath),
          },
        },
        {
          loc: absoluteUrl(baseUrl, enPath),
          lastmod: project._updatedAt,
          alternates: {
            fr: absoluteUrl(baseUrl, frPath),
            en: absoluteUrl(baseUrl, enPath),
            "x-default": absoluteUrl(baseUrl, frPath),
          },
        },
      ];
    });

  entries.push(
    ...pageEntriesFromTranslations,
    ...frFallbackEntries,
    ...enFallbackEntries,
    ...projectEntries,
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...entries.map(renderUrl),
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
