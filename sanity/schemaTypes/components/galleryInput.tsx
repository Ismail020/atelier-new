import { Box, Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { useEffect, useMemo, useState } from "react";
import { ArrayOfObjectsInputProps, set, useClient, useFormValue } from "sanity";

interface GalleryImage {
  _key?: string;
  asset?: {
    _ref?: string;
  };
}

interface GalleryRow {
  _key?: string;
  _type: string;
  type: string;
  images: string[];
}

type GalleryLayout = GalleryRow[];

export function GalleryInput(props: ArrayOfObjectsInputProps) {
  const images = useFormValue(["gallery"]) as GalleryImage[] | undefined;
  const [assetData, setAssetData] = useState<
    Record<
      string,
      {
        url?: string;
        metadata?: { dimensions?: { width: number; height: number } };
      }
    >
  >({});
  const client = useClient({ apiVersion: "2023-10-10" });
  // Use props.value directly instead of local state for existing layout
  const existingLayout = (props.value as GalleryLayout) || [];
  const [previewLayout, setPreviewLayout] = useState<GalleryLayout>([]);

  useEffect(() => {
    async function loadAssets() {
      const newData: Record<
        string,
        {
          url?: string;
          metadata?: { dimensions?: { width: number; height: number } };
        }
      > = {};

      for (const img of images ?? []) {
        const ref = img?.asset?._ref;
        if (!ref) continue;
        if (assetData[ref]) continue;

        const data = await client.fetch(`*[_id == $id][0]{url, metadata}`, {
          id: ref,
        });

        newData[ref] = data;
      }

      if (Object.keys(newData).length > 0) {
        setAssetData((prev) => ({ ...prev, ...newData }));
      }
    }

    loadAssets();
  }, [assetData, client, images]);

  const counts = useMemo(() => {
    let wide43 = 0;
    let tall075 = 0;

    for (const img of images || []) {
      const asset = assetData[img?.asset?._ref];
      const dims = asset?.metadata?.dimensions;
      if (!dims) continue;

      const ar = dims.width / dims.height;

      if (ar > 1.25 && ar < 1.4) wide43++;
      else if (ar > 0.7 && ar < 0.8) tall075++;
    }

    return { wide43, tall075 };
  }, [images, assetData]);

  function saveLayout(layout: GalleryLayout) {
    // Add _key properties to each item in the layout array
    const layoutWithKeys: GalleryLayout = layout.map((item, index) => ({
      ...item,
      _key: item._key || `row-${Date.now()}-${index}`
    }));
    
    // Use Sanity's set function to properly save the array
    props.onChange(set(layoutWithKeys));
  }

  // ---------------------------------------------------------
  // RANDOM LAYOUT GENERATOR
  // ---------------------------------------------------------
  function generateRandomLayout() {
    const horizontals: string[] = [];
    const verticals: string[] = [];

    // SPLIT
    for (const img of images || []) {
      const ref = img?.asset?._ref;
      if (!ref) continue;
      const asset = assetData[ref];
      const dims = asset?.metadata?.dimensions;
      if (!dims) continue;

      const ar = dims.width / dims.height;
      if (ar > 1.25 && ar < 1.4 && img._key) horizontals.push(img._key);
      else if (ar > 0.7 && ar < 0.8 && img._key) verticals.push(img._key);
    }

    const H = horizontals.length;
    const V = verticals.length;

    // ---------------------------------------------------------
    // HORIZONTAAL EXACT VERDELEN
    // Solve: row1*1 + row3*2 = H
    // with constraint: row1 <= 2
    // ---------------------------------------------------------
    let row1Count = 0;
    let row3Count = 0;

    for (let r1 = 0; r1 <= 2; r1++) {
      const rest = H - r1;
      if (rest >= 0 && rest % 2 === 0) {
        row1Count = r1;
        row3Count = rest / 2;
        break;
      }
    }

    // ---------------------------------------------------------
    // VERTICAAL EXACT VERDELEN
    // Solve: row4*2 + row2*3 = V
    // with constraint: row4 <= 1
    // ---------------------------------------------------------
    let row4Count = 0;
    let row2Count = 0;

    for (let r4 = 0; r4 <= 1; r4++) {
      const rest = V - r4 * 2;
      if (rest >= 0 && rest % 3 === 0) {
        row4Count = r4;
        row2Count = rest / 3;
        break;
      }
    }

    // SHUFFLE
    const shuffle = (arr: string[]) => arr.sort(() => Math.random() - 0.5);

    shuffle(horizontals);
    shuffle(verticals);

    const layout: GalleryLayout = [];

    // BUILD ROW1
    for (let i = 0; i < row1Count; i++) {
      const img = horizontals.shift();
      if (img) {
        layout.push({
          _type: "galleryRow",
          type: "row1",
          images: [img],
        });
      }
    }

    // BUILD ROW3
    for (let i = 0; i < row3Count; i++) {
      const img1 = horizontals.shift();
      const img2 = horizontals.shift();
      if (img1 && img2) {
        layout.push({
          _type: "galleryRow",
          type: "row3",
          images: [img1, img2],
        });
      }
    }

    // BUILD ROW4
    for (let i = 0; i < row4Count; i++) {
      const img1 = verticals.shift();
      const img2 = verticals.shift();
      if (img1 && img2) {
        layout.push({
          _type: "galleryRow",
          type: "row4",
          images: [img1, img2],
        });
      }
    }

    // BUILD ROW2
    for (let i = 0; i < row2Count; i++) {
      const img1 = verticals.shift();
      const img2 = verticals.shift();
      const img3 = verticals.shift();
      if (img1 && img2 && img3) {
        layout.push({
          _type: "galleryRow",
          type: "row2",
          images: [img1, img2, img3],
        });
      }
    }

    // SHUFFLE FINAL ROW ORDER for variety
    layout.sort(() => Math.random() - 0.5);

    setPreviewLayout(layout);
    saveLayout(layout);
  }

  // ---------------------------------------------------------
  // PREVIEW RENDERER
  // ---------------------------------------------------------
  function renderPreviewRow(row: GalleryRow) {
    const LABELS: Record<string, string> = {
      row1: "1 groot liggend",
      row2: "3 klein staand",
      row3: "2 klein liggend",
      row4: "2 grote staand",
    };

    return (
      <Stack
        key={row.images.join("-")}
        space={2}
        style={{ marginBottom: "16px" }}
      >
        {/* --- ROW LABEL --- */}
        <Text size={1} muted>
          <strong>{row.type}</strong> — {LABELS[row.type]}
        </Text>

        <Flex gap={2} style={{ width: "100%" }}>
          {row.images.map((key: string) => {
            const img = images?.find((i) => i._key === key);
            const assetRef = img?.asset?._ref;
            if (!assetRef) return null;
            const asset = assetData[assetRef];
            if (!asset) return null;

            const dims = asset.metadata?.dimensions;
            if (!dims) return null;
            const aspect = dims.width / dims.height;

            // Oriëntatie label
            let ratioLabel = "";
            if (aspect > 1.25 && aspect < 1.4) ratioLabel = "liggend (4:3)";
            else if (aspect > 0.7 && aspect < 0.8)
              ratioLabel = "staand (0.74:1)";
            else ratioLabel = "onbekend";

            return (
              <Stack key={key} space={1} style={{ flex: 1 }}>
                {/* IMAGE */}
                <Box
                  style={{
                    flex: 1,
                    overflow: "hidden",
                    borderRadius: "8px",
                  }}
                >
                  <img
                    src={`${asset.url}?w=600&fit=crop`}
                    alt="Gallery preview"
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Box>

                {/* ORIENTATION LABEL */}
                <Text size={1} muted align="center">
                  {ratioLabel}
                </Text>
              </Stack>
            );
          })}
        </Flex>
      </Stack>
    );
  }

  return (
    <Stack space={4}>
      <Card padding={4} shadow={1} radius={2} tone="default">
        <Stack space={4}>
          <Card padding={3} radius={2} shadow={1} tone="primary">
            <Stack space={2}>
              <Text weight="semibold">Foto telling:</Text>
              <Text>
                4:3 (row1/row3): <strong>{counts.wide43}</strong>
              </Text>
              <Text>
                0.75 (row2/row4): <strong>{counts.tall075}</strong>
              </Text>
            </Stack>
          </Card>

          {/* GENERATE BUTTON */}
          <Button
            text="Genereer Random Layout"
            tone="primary"
            onClick={generateRandomLayout}
          />

          {/* EXISTING LAYOUT */}
          {existingLayout.length > 0 && (
            <Card padding={3} radius={2} shadow={1} tone="positive">
              <Text weight="semibold" size={2} style={{ marginBottom: "12px" }}>
                Current Saved Layout
              </Text>

              {existingLayout.map((row) => renderPreviewRow(row))}
            </Card>
          )}

          {/* PREVIEW */}
          {previewLayout.length > 0 && (
            <Card padding={3} radius={2} shadow={1} tone="default">
              <Text weight="semibold" size={2} style={{ marginBottom: "12px" }}>
                New Layout Preview
              </Text>

              {previewLayout.map((row) => renderPreviewRow(row))}
            </Card>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
