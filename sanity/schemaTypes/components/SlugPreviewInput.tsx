import { Stack, Text, Inline } from "@sanity/ui";
import { InputProps } from "sanity";
import { useFormValue } from "sanity";

const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL;

type ExtendedInputProps = InputProps & {
  document?: {
    _type?: string;
    language?: string;
  };
};

export function SlugPreviewInput(props: ExtendedInputProps) {
  const { renderDefault } = props;

  const language = useFormValue(["language"]) as string | undefined;
  const name = useFormValue(["name"]) as string | undefined;
  const documentType = useFormValue(["_type"]) as string | undefined;

  const previewUrls = (() => {
    if (name?.toLowerCase() === "home") {
      return [`${FRONTEND_BASE_URL}/${language}`];
    }

    console.log("Generating preview URLs for document type:", documentType);

    if (documentType === "project") {
      const nameSlug =
        name
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") || "";
      return [
        `${FRONTEND_BASE_URL}/en/projects/${nameSlug}`,
        `${FRONTEND_BASE_URL}/fr/projects/${nameSlug}`,
      ];
    }

    // Create a slug from the name
    const nameSlug =
      name
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "";
    return [`${FRONTEND_BASE_URL}/${language}/${nameSlug}`];
  })();

  return (
    <Stack space={3}>
      {renderDefault(props)}

      {name && FRONTEND_BASE_URL && (
        <Stack space={2}>
          <Text size={1} muted>
            {previewUrls.length > 1 ? "Permalinks:" : "Permalink:"}
          </Text>
          {previewUrls.map((url, index) => (
            <Inline key={index} space={2}>
              {documentType === "project" && (
                <Text size={1} muted>
                  {index === 0 ? "🇺🇸 EN:" : "🇫🇷 FR:"}
                </Text>
              )}
              <Text
                as="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                size={1}
                style={{ textDecoration: "underline", color: "#2271b1" }}
              >
                {url}
              </Text>
            </Inline>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
