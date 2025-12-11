import { GalleryLayout, GalleryRow, ImageGroup, GalleryImage, AssetDataMap } from "./types";

/**
 * Groups images by aspect ratio while maintaining DnD order
 */
export function groupImagesByAspectRatio(
  displayImages: GalleryImage[],
  assetData: AssetDataMap
): ImageGroup[] {
  const groups: ImageGroup[] = [];
  let currentGroup: ImageGroup | null = null;

  for (const img of displayImages) {
    const ref = img?.asset?._ref;
    if (!ref) continue;

    const asset = assetData[ref];
    const dims = asset?.metadata?.dimensions;
    if (!dims) continue;

    const ar = dims.width / dims.height;
    let imgType: "landscape" | "portrait" | null = null;

    if (ar >= 1.1 && ar <= 1.6) {
      imgType = "landscape";
    } else if (ar >= 0.6 && ar <= 0.9) {
      imgType = "portrait";
    } else if (ar >= 0.9 && ar < 1.1) {
      // Square images - treat as landscape
      imgType = "landscape";
    }

    if (!imgType) continue;

    // If same type as current group, add to it
    if (currentGroup && currentGroup.type === imgType) {
      currentGroup.images.push(img);
    } else {
      // Start new group
      if (currentGroup) {
        groups.push(currentGroup);
      }
      currentGroup = { type: imgType, images: [img] };
    }
  }

  // Push last group
  if (currentGroup) {
    groups.push(currentGroup);
  }

  return groups;
}

/**
 * Pre-calculates optimal row sequence for a group of images
 */
function calculateRowSequence(
  type: "landscape" | "portrait",
  count: number
): Array<{ type: string; count: number }> {
  const sequence: Array<{ type: string; count: number }> = [];
  let temp = count;

  if (type === "portrait") {
    // Portrait: row2=3, row4=2
    if (count === 1) {
      // Can't place 1
      console.log(`Portrait group (${count}): cannot place 1 image`);
    } else if (count === 2) {
      sequence.push({ type: "row4", count: 2 });
    } else if (count === 3) {
      sequence.push({ type: "row2", count: 3 });
    } else if (count === 4) {
      sequence.push({ type: "row4", count: 2 });
      sequence.push({ type: "row4", count: 2 });
    } else if (count === 5) {
      sequence.push({ type: "row2", count: 3 });
      sequence.push({ type: "row4", count: 2 });
    } else if (count === 6) {
      sequence.push({ type: "row2", count: 3 });
      sequence.push({ type: "row2", count: 3 });
    } else if (count === 7) {
      sequence.push({ type: "row2", count: 3 });
      sequence.push({ type: "row4", count: 2 });
      sequence.push({ type: "row2", count: 3 });
    } else {
      // For 8+: use greedy approach
      while (temp > 0) {
        if (temp >= 3) {
          sequence.push({ type: "row2", count: 3 });
          temp -= 3;
        } else if (temp >= 2) {
          sequence.push({ type: "row4", count: 2 });
          temp -= 2;
        } else {
          break;
        }
      }
    }
    console.log(
      `Portrait group (${count}): sequence = [${sequence.map((s) => `${s.type}(${s.count})`).join(", ")}]`
    );
  } else {
    // Landscape: row1=1, row3=2
    while (temp > 0) {
      if (temp >= 2) {
        sequence.push({ type: "row3", count: 2 });
        temp -= 2;
      } else if (temp >= 1) {
        sequence.push({ type: "row1", count: 1 });
        temp -= 1;
      } else {
        break;
      }
    }
  }

  return sequence;
}

/**
 * Generates gallery layout from grouped images respecting DnD order
 */
export function generateGalleryLayout(
  images: GalleryImage[],
  assetData: AssetDataMap
): GalleryLayout {
  const groups = groupImagesByAspectRatio(images, assetData);
  const layout: GalleryLayout = [];

  for (const group of groups) {
    if (!group.images || group.images.length === 0) continue;
    
    const sequence = calculateRowSequence(group.type, group.images.length);
    let startIdx = 0;

    // Execute the sequence
    for (const rowReq of sequence) {
      const rowImages: string[] = [];
      for (let i = 0; i < rowReq.count; i++) {
        const img = group.images[startIdx + i];
        if (img) {
          rowImages.push(img._key!);
        }
      }

      if (rowImages.length === rowReq.count) {
        layout.push({
          _key: `row-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          _type: "galleryRow",
          type: rowReq.type,
          images: rowImages,
        });
        startIdx += rowReq.count;
      }
    }
  }

  console.log(
    `Layout generated: ${layout.length} rows from ${groups.reduce((sum, g) => sum + g.images.length, 0)} images`
  );

  return layout;
}

/**
 * Formats group information for display
 */
export function formatGroupsInfo(
  images: GalleryImage[],
  assetData: AssetDataMap
): string {
  const groups = groupImagesByAspectRatio(images, assetData);
  return groups
    .filter((g) => g.images && g.images.length > 0)
    .map(
      (g, i) =>
        `${i + 1}. ${g.type === "landscape" ? "🏜️ Landscape" : "🏙️ Portrait"} (${g.images.length})`
    )
    .join("\n");
}
