import { Stack, Text, Inline } from "@sanity/ui";
import { InputProps } from "sanity";
import { useFormValue } from "sanity";

const FRONTEND_BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_BASE_URL;

type SlugValue = {
  current?: string;
  _type?: string;
};

type ExtendedInputProps = InputProps & {
  document?: {
    _type?: string;
    language?: string;
  };
};

export function SlugPreviewInput(props: ExtendedInputProps) {
  const { value, renderDefault } = props;

  const language = useFormValue(["language"]) as string | undefined;
  const name = useFormValue(["name"]) as string | undefined;

  const slugValue = (value as SlugValue)?.current || "";

  // Debug logs
  console.log("Debug info:", {
    slugValue,
    FRONTEND_BASE_URL,
    language,
    name,
    hasSlugValue: !!slugValue,
    hasFrontendUrl: !!FRONTEND_BASE_URL,
  });

  const previewUrl = (() => {
    if (name?.toLowerCase() === "home") {
      return `${FRONTEND_BASE_URL}/${language}`;
    }

    // Create a slug from the name
    const nameSlug =
      name
        ?.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") || "";
    return `${FRONTEND_BASE_URL}/${language}/${nameSlug}`;
  })();

  return (
    <Stack space={3}>
      {renderDefault(props)}

      {name && FRONTEND_BASE_URL && (
        <Inline space={2}>
          <Text size={1} muted>
            Permalink:
          </Text>
          <Text
            as="a"
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            size={1}
            style={{ textDecoration: "underline", color: "#2271b1" }}
          >
            {previewUrl}
          </Text>
        </Inline>
      )}
    </Stack>
  );
}
