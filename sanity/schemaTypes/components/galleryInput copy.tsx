import { Stack, Card, Text, Flex, Box, Button } from "@sanity/ui";
import { InputProps, useClient } from "sanity";
import { useEffect, useState, useMemo } from "react";
import { set, unset } from "sanity";

export function GalleryInput(props: InputProps) {
  const { renderDefault } = props;

  const client = useClient({ apiVersion: "2023-10-10" });
  const images = (props.value as any[]) ?? [];
  const [assetData, setAssetData] = useState<Record<string, any>>({});
  const [previewLayout, setPreviewLayout] = useState<any[]>([]);

  // ---------------------------------------------------------
  // LOAD FULL ASSET METADATA
  // ---------------------------------------------------------
  useEffect(() => {
    async function loadAssets() {
      const newData: any = {};

      for (const img of images) {
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
  }, [images]);

  // ---------------------------------------------------------
  // COUNT IMAGES
  // ---------------------------------------------------------
  const counts = useMemo(() => {
    let wide43 = 0;
    let tall075 = 0;

    for (const img of images) {
      const asset = assetData[img?.asset?._ref];
      const dims = asset?.metadata?.dimensions;
      if (!dims) continue;

      const ar = dims.width / dims.height;

      if (ar > 1.25 && ar < 1.4) wide43++;
      else if (ar > 0.7 && ar < 0.8) tall075++;
    }

    return { wide43, tall075 };
  }, [images, assetData]);

  function saveLayout(layout) {
    const parentPath = props.path.slice(0, -1); // remove 'gallery'

    props.onChange(set(layout, [...parentPath, "galleryLayout"]));
  }

  // ---------------------------------------------------------
  // RANDOM LAYOUT GENERATOR
  // ---------------------------------------------------------
  function generateRandomLayout() {
    const horizontals: string[] = [];
    const verticals: string[] = [];

    // SPLIT
    for (const img of images) {
      const asset = assetData[img?.asset?._ref];
      const dims = asset?.metadata?.dimensions;
      if (!dims) continue;

      const ar = dims.width / dims.height;
      if (ar > 1.25 && ar < 1.4) horizontals.push(img._key);
      else if (ar > 0.7 && ar < 0.8) verticals.push(img._key);
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
    const shuffle = (arr: any[]) => arr.sort(() => Math.random() - 0.5);

    shuffle(horizontals);
    shuffle(verticals);

    const layout: any[] = [];

    // BUILD ROW1
    for (let i = 0; i < row1Count; i++) {
      layout.push({
        _type: "galleryRow",
        type: "row1",
        images: [horizontals.shift()],
      });
    }

    // BUILD ROW3
    for (let i = 0; i < row3Count; i++) {
      layout.push({
        _type: "galleryRow",
        type: "row3",
        images: [horizontals.shift(), horizontals.shift()],
      });
    }

    // BUILD ROW4
    for (let i = 0; i < row4Count; i++) {
      layout.push({
        _type: "galleryRow",
        type: "row4",
        images: [verticals.shift(), verticals.shift()],
      });
    }

    // BUILD ROW2
    for (let i = 0; i < row2Count; i++) {
      layout.push({
        _type: "galleryRow",
        type: "row2",
        images: [verticals.shift(), verticals.shift(), verticals.shift()],
      });
    }

    // SHUFFLE FINAL ROW ORDER for variety
    shuffle(layout);

    setPreviewLayout(layout);
    saveLayout(layout);

    console.log("FINAL PERFECT LAYOUT:", layout);
  }

  // ---------------------------------------------------------
  // PREVIEW RENDERER
  // ---------------------------------------------------------
  function renderPreviewRow(row: any) {
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
            const img = images.find((i) => i._key === key);
            const asset = assetData[img?.asset?._ref];
            if (!asset) return null;

            const dims = asset.metadata?.dimensions;
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

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------
  return (
    <Stack space={4}>
      {renderDefault(props)}

      {/* SUMMARY BLOCK */}
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

          {/* PREVIEW */}
          {previewLayout.length > 0 && (
            <Card padding={3} radius={2} shadow={1} tone="default">
              <Text weight="semibold" size={2} style={{ marginBottom: "12px" }}>
                Layout Preview
              </Text>

              {previewLayout.map((row) => renderPreviewRow(row))}
            </Card>
          )}
        </Stack>
      </Card>
    </Stack>
  );
}
