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
      const assetRef = img?.asset?._ref;
      if (!assetRef) continue;

      const asset = assetData[assetRef];
      const dims = asset?.metadata?.dimensions;
      if (!dims) continue;

      const ar = dims.width / dims.height;

      // Breder ranges voor aspect ratios
      // 4:3 ratio (1.33) - landscape: 1.1 tot 1.6
      // 0.75:1 ratio (0.75) - portrait: 0.6 tot 0.9
      if (ar >= 1.1 && ar <= 1.6) wide43++;
      else if (ar >= 0.6 && ar <= 0.9) tall075++;
    }

    return { wide43, tall075 };
  }, [images, assetData]);

  function saveLayout(layout: GalleryLayout) {
    // Add _key properties to each item in the layout array
    const layoutWithKeys: GalleryLayout = layout.map((item, index) => ({
      ...item,
      _key: item._key || `row-${Date.now()}-${index}`,
    }));

    // Use Sanity's set function to properly save the array
    props.onChange(set(layoutWithKeys));
  }

  // ---------------------------------------------------------
  // RANDOM LAYOUT GENERATOR
  // ---------------------------------------------------------
  function generateRandomLayout() {
    const horizontals: Array<{ key: string; index: number }> = [];
    const verticals: Array<{ key: string; index: number }> = [];

    // SPLIT - track both key and original index
    for (let idx = 0; idx < (images || []).length; idx++) {
      const img = images?.[idx];
      const ref = img?.asset?._ref;
      if (!ref) continue;
      const asset = assetData[ref];
      const dims = asset?.metadata?.dimensions;
      if (!dims) continue;

      const ar = dims.width / dims.height;
      // Zelfde ranges als in counts useMemo
      if (ar >= 1.1 && ar <= 1.6 && img._key) {
        horizontals.push({ key: img._key, index: idx });
      } else if (ar >= 0.6 && ar <= 0.9 && img._key) {
        verticals.push({ key: img._key, index: idx });
      }
    }

    const H = horizontals.length;
    const V = verticals.length;

    // ---------------------------------------------------------
    // HORIZONTAAL VERDELEN
    // ---------------------------------------------------------
    let row1Count = Math.min(2, H);
    let row3Count = Math.floor((H - row1Count) / 2);

    const remainingH = H - row1Count - row3Count * 2;
    if (remainingH > 0 && row1Count > 0) {
      row1Count = Math.max(0, row1Count - 1);
      row3Count = Math.floor((H - row1Count) / 2);
    }

    // ---------------------------------------------------------
    // VERTICAAL VERDELEN
    // ---------------------------------------------------------
    let row4Count = Math.min(1, Math.floor(V / 2));
    let row2Count = Math.floor((V - row4Count * 2) / 3);

    const remainingV = V - row4Count * 2 - row2Count * 3;
    if (remainingV >= 2) {
      if (remainingV >= 3) {
        row2Count += Math.floor(remainingV / 3);
      } else if (remainingV === 2 && row4Count === 0) {
        row4Count = 1;
      }
    }

    // SHUFFLE
    const shuffle = (arr: Array<{ key: string; index: number }>) =>
      arr.sort(() => Math.random() - 0.5);

    shuffle(horizontals);
    shuffle(verticals);

    const layout: GalleryLayout = [];

    // BUILD ROW1
    for (let i = 0; i < row1Count; i++) {
      const item = horizontals.shift();
      if (item) {
        layout.push({
          _type: "galleryRow",
          type: "row1",
          images: [item.key],
        });
      }
    }

    // BUILD ROW3
    for (let i = 0; i < row3Count; i++) {
      const item1 = horizontals.shift();
      const item2 = horizontals.shift();
      if (item1 && item2) {
        layout.push({
          _type: "galleryRow",
          type: "row3",
          images: [item1.key, item2.key],
        });
      }
    }

    // BUILD ROW4
    for (let i = 0; i < row4Count; i++) {
      const item1 = verticals.shift();
      const item2 = verticals.shift();
      if (item1 && item2) {
        layout.push({
          _type: "galleryRow",
          type: "row4",
          images: [item1.key, item2.key],
        });
      }
    }

    // BUILD ROW2
    for (let i = 0; i < row2Count; i++) {
      const item1 = verticals.shift();
      const item2 = verticals.shift();
      const item3 = verticals.shift();
      if (item1 && item2 && item3) {
        layout.push({
          _type: "galleryRow",
          type: "row2",
          images: [item1.key, item2.key, item3.key],
        });
      }
    }

    // SHUFFLE FINAL ROW ORDER for variety
    layout.sort(() => Math.random() - 0.5);

    // Calculate total images used
    const totalUsed = layout.reduce((sum, row) => sum + row.images.length, 0);
    console.log(
      `Layout generated: Using ${totalUsed} out of ${(images || []).length} total images`,
    );
    console.log(
      `Horizontal: ${H} available, row1: ${row1Count}, row3: ${row3Count} (using ${row1Count + row3Count * 2})`,
    );
    console.log(
      `Vertical: ${V} available, row2: ${row2Count}, row4: ${row4Count} (using ${row2Count * 3 + row4Count * 2})`,
    );

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
      <Stack key={row.images.join("-")} space={2} style={{ marginBottom: "16px" }}>
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
            else if (aspect > 0.7 && aspect < 0.8) ratioLabel = "staand (0.74:1)";
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
          <Button text="Genereer Random Layout" tone="primary" onClick={generateRandomLayout} />

          {/* CURRENT LAYOUT */}
          {existingLayout.length > 0 && (
            <Card padding={3} radius={2} shadow={1} tone="positive">
              <Text weight="semibold" size={2} style={{ marginBottom: "12px" }}>
                Current Layout
              </Text>

              {existingLayout.map((row) => renderPreviewRow(row))}
            </Card>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
