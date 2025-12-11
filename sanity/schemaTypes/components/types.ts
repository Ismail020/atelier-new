export interface GalleryImage {
  _key?: string;
  asset?: {
    _ref?: string;
  };
}

export interface GalleryRow {
  _key?: string;
  _type: string;
  type: string;
  images: string[];
}

export type GalleryLayout = GalleryRow[];

export interface ImageGroup {
  type: "landscape" | "portrait";
  images: GalleryImage[];
}

export interface AssetData {
  url?: string;
  metadata?: { dimensions?: { width: number; height: number } };
}

export interface AssetDataMap {
  [key: string]: AssetData;
}
