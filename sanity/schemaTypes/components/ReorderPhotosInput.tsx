"use client";

import { Box, Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrayOfObjectsInputProps, set, useClient } from "sanity";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

import { GalleryImage, AssetDataMap, AssetData } from "./types";
import { SortableImageItem } from "./SortableImageItem";
import { groupImagesByAspectRatio } from "./layoutGenerator";

export function ReorderPhotosInput(props: ArrayOfObjectsInputProps) {
  // props.value is the gallery array
  const images = (props.value as GalleryImage[]) || [];
  const [assetData, setAssetData] = useState<AssetDataMap>({});
  const [validationWarning, setValidationWarning] = useState<string>("");
  const [isolatedImageKeys, setIsolatedImageKeys] = useState<Set<string>>(new Set());
  const client = useClient({ apiVersion: "2023-10-10" });

  // Load asset metadata for all images
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

    if (images.length > 0) {
      loadAssets();
    }
  }, [images, client, assetData]);

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

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Get image keys for sorting context
  const imageIds = useMemo(
    () => images.map((img) => img._key).filter((key): key is string => !!key),
    [images]
  );

  // Handle drag end - reorder images
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const oldIndex = imageIds.indexOf(active.id as string);
      const newIndex = imageIds.indexOf(over.id as string);

      if (oldIndex >= 0 && newIndex >= 0) {
        const reorderedImages = arrayMove(images, oldIndex, newIndex);
        props.onChange(set(reorderedImages));
      }
    },
    [images, imageIds, props],
  );

  return (
    <Stack space={3}>
      {/* Render default array input for upload/delete */}
      {props.renderDefault(props)}

      {/* Reorder section */}
      <Box>
        <Card padding={4} border>
          <Stack space={3}>
            <Flex justify="space-between" align="center">
              <Text size={1} weight="semibold">
                🖼️ Reorder Photos (Drag & Drop)
              </Text>
              <Text size={0} muted>
                {images.length} photo{images.length !== 1 ? "s" : ""}
              </Text>
            </Flex>

            <Text size={0} muted>
              🏜️ Landscape • 🏙️ Portrait • 🟦 Square
            </Text>

            {validationWarning && (
              <Card padding={3} tone="caution" border>
                <Text size={0}>{validationWarning}</Text>
              </Card>
            )}

            {images.length === 0 ? (
              <Card padding={3} tone="caution" border>
                <Text size={0}>No photos in gallery yet. Add photos using the button below.</Text>
              </Card>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <Box
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    gap: "12px",
                  }}
                >
                  <SortableContext items={imageIds} strategy={rectSortingStrategy}>
                    {images.map((img, idx) => {
                      if (!img._key) return null;
                      const isIsolated = isolatedImageKeys.has(img._key);
                      return (
                        <SortableImageItem
                          key={img._key}
                          id={img._key}
                          img={img}
                          idx={idx}
                          assetData={assetData}
                          isIsolated={isIsolated}
                        />
                      );
                    })}
                  </SortableContext>
                </Box>
              </DndContext>
            )}
          </Stack>
        </Card>
      </Box>
    </Stack>
  );
}
