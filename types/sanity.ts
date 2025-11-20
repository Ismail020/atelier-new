export interface SanityImage {
  asset?: {
    _ref: string;
    _type: "reference";
    _createdAt?: string;
    _id?: string;
    _rev?: string;
    _updatedAt?: string;
    assetId?: string;
    extension?: string;
    metadata?: {
      _type: "sanity.imageMetadata";
      blurHash?: string;
      dimensions: {
        _type: "sanity.imageDimensions";
        aspectRatio: number;
        height: number;
        width: number;
      };
      hasAlpha?: boolean;
      isOpaque?: boolean;
      lqip?: string;
    };
    mimeType?: string;
    originalFilename?: string;
    path?: string;
    sha1hash?: string;
    size?: number;
    uploadId?: string;
    url?: string;
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  _key?: string;
  _type?: "image";
}

export type SanityImageArray = SanityImage[];
