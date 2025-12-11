"use client";

import { Box, Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { useEffect, useMemo, useState } from "react";
import { ArrayOfObjectsInputProps, set, useClient, useFormValue } from "sanity";

import { GalleryImage, GalleryLayout, AssetDataMap, AssetData } from "./types";
import { groupImagesByAspectRatio, generateGalleryLayout } from "./layoutGenerator";
import { SortableImageItem } from "./SortableImageItem";

export function GalleryInput(props: ArrayOfObjectsInputProps) {
  // Get gallery images from the form (read-only)
  const galleryImages = useFormValue(["gallery"]) as GalleryImage[] | undefined;
  // Get current layout value from props (what we're editing - no DnD here!)
  const currentLayout = (props.value as GalleryLayout) || [];

  const [assetData, setAssetData] = useState<AssetDataMap>({});
  const [validationWarning, setValidationWarning] = useState<string>("");
  const [isolatedImageKeys, setIsolatedImageKeys] = useState<Set<string>>(new Set());
  const client = useClient({ apiVersion: "2023-10-10" });

  const images = galleryImages || [];

  // Load asset metadata
  useEffect(() => {
    async function loadAssets() {
      const newData: AssetDataMap = {};

      for (const img of images ?? []) {
        const ref = img?.asset?._ref;
        if (!ref || assetData[ref]) continue;

        try {
          const data = await client.fetch(`*[_id == $id][0]{url, metadata}`, {
            id: ref,
          });
          if (data) newData[ref] = data;
        } catch (error) {
          console.error("Error loading asset:", error);
        }
      }

      if (Object.keys(newData).length > 0) {
        setAssetData((prev) => ({ ...prev, ...newData }));
      }
    }

    loadAssets();
  }, [images, client]);

  // Validate for isolated portrait images
  useEffect(() => {
    if (!images || images.length === 0) {
      setValidationWarning("");
      setIsolatedImageKeys(new Set());
      return;
    }

    const groups = groupImagesByAspectRatio(images, assetData);

    const isolated = groups.filter((g) => {
      // Portrait groups of size 1 are isolated (need 2+)
      if (g.type === "portrait") {
        return g.images.length === 1;
      }
      return false;
    });

    const isolatedKeys = new Set<string>();
    if (isolated.length > 0) {
      isolated.forEach((g) => {
        g.images.forEach((img) => {
          if (img._key) isolatedKeys.add(img._key);
        });
      });
      const isolatedCount = isolatedKeys.size;
      setValidationWarning(
        `⚠️ ${isolatedCount} isolated portrait photo(s) cannot be placed. Portrait photos must appear in groups of at least 2.`,
      );
    } else {
      setValidationWarning("");
    }
    setIsolatedImageKeys(isolatedKeys);
  }, [images, assetData]);

  // Generate layout
  const handleGenerateLayout = () => {
    if (!images || images.length === 0) {
      return;
    }

    try {
      const layout = generateGalleryLayout(images, assetData);
      props.onChange(set(layout));
    } catch (error) {
      console.error("Error generating layout:", error);
    }
  };

  const counts = useMemo(() => {
    let landscape = 0;
    let portrait = 0;

    for (const img of images || []) {
      const assetRef = img?.asset?._ref;
      if (!assetRef) continue;

      const asset = assetData[assetRef];
      const dims = asset?.metadata?.dimensions;
      if (!dims) continue;

      const ar = dims.width / dims.height;

      if (ar >= 1.1 && ar <= 1.6) {
        landscape++;
      } else if (ar >= 0.6 && ar <= 0.9) {
        portrait++;
      } else if (ar >= 0.9 && ar < 1.1) {
        landscape++; // Square = landscape
      }
    }

    return { landscape, portrait };
  }, [images, assetData]);

  return (
    <Stack space={3}>
      {/* Gallery info and generation button */}
      <Card padding={4} border>
        <Stack space={3}>
          <Flex justify="space-between" align="center">
            <Text size={1} weight="semibold">
              📸 Photo Gallery
            </Text>
          </Flex>

          <Flex gap={2}>
            <Text size={0} muted>
              Total: {images.length}
            </Text>
            <Text size={0} muted>
              Landscape: {counts.landscape}
            </Text>
            <Text size={0} muted>
              Portrait: {counts.portrait}
            </Text>
          </Flex>

          {validationWarning && (
            <Card padding={3} tone="caution" border>
              <Text size={0}>{validationWarning}</Text>
            </Card>
          )}

          <Button text="Generate Layout" onClick={handleGenerateLayout} mode="default" />
        </Stack>
      </Card>

      {/* Layout preview */}
      {currentLayout.length > 0 && (
        <Card padding={4} border>
          <Stack space={3}>
            <Text size={1} weight="semibold">
              ✅ Generated Layout
            </Text>

            {currentLayout.map((row, rowIdx) => (
              <Box key={rowIdx}>
                <Box
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      row.images.length === 1
                        ? "1fr"
                        : row.images.length === 2
                          ? "1fr 1fr"
                          : "repeat(3, 1fr)",
                    gap: "12px",
                    marginBottom: "20px",
                  }}
                >
                  {row.images.map((imageKey) => {
                    const img = images.find((i) => i._key === imageKey);
                    const idx = images.findIndex((i) => i._key === imageKey);
                    const isIsolated = isolatedImageKeys.has(imageKey);

                    if (!img) return null;

                    return (
                      <SortableImageItem
                        key={imageKey}
                        id={imageKey}
                        img={img}
                        idx={idx}
                        assetData={assetData}
                        isIsolated={isIsolated}
                      />
                    );
                  })}
                </Box>
              </Box>
            ))}
          </Stack>
        </Card>
      )}
    </Stack>
  );
}
