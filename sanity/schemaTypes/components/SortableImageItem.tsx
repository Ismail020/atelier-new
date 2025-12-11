import { Box, Flex, Text } from "@sanity/ui";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GalleryImage, AssetDataMap } from "./types";

interface SortableImageItemProps {
  id: string;
  img: GalleryImage;
  idx: number;
  assetData: AssetDataMap;
  isIsolated?: boolean;
}

export function SortableImageItem({
  id,
  img,
  idx,
  assetData,
  isIsolated = false,
}: SortableImageItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const assetRef = img?.asset?._ref;
  if (!assetRef) return null;
  const asset = assetData[assetRef];
  const dims = asset?.metadata?.dimensions;
  const ar = dims ? dims.width / dims.height : 0;

  let aspectIcon = "?";
  if (ar >= 1.1 && ar <= 1.6) aspectIcon = "🏜️"; // Landscape
  else if (ar >= 0.6 && ar <= 0.9) aspectIcon = "🏙️"; // Portrait
  else if (ar >= 0.9 && ar < 1.1) aspectIcon = "🟦"; // Square

  return (
    <Box
      ref={setNodeRef}
      style={{
        ...style,
        position: "relative",
        borderRadius: "8px",
        overflow: "hidden",
        border: isDragging
          ? "3px solid #2d82f7"
          : isIsolated
            ? "3px solid #dc2626"
            : "2px solid #ddd",
        backgroundColor: isDragging
          ? "#f0f7ff"
          : isIsolated
            ? "#fee2e2"
            : "transparent",
        cursor: "grab",
      }}
      {...attributes}
      {...listeners}
    >
      {asset?.url && (
        <img
          src={`${asset.url}?w=200&h=200&fit=crop`}
          alt={`Photo ${idx + 1}`}
          style={{
            width: "100%",
            height: "100px",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.7)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "8px",
          opacity: 0,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = "0";
        }}
      >
        <Flex justify="space-between">
          <Text size={2} weight="bold" style={{ color: "white" }}>
            #{idx + 1}
          </Text>
          <Text style={{ color: "white" }}>{aspectIcon}</Text>
        </Flex>
      </Box>
    </Box>
  );
}
