import React from "react";
import { ArrayOfObjectsInputProps, set } from "sanity";
import { StarIcon } from "@sanity/icons";
import { useClient } from "sanity";
import imageUrlBuilder from "@sanity/image-url";

interface PreviewImage {
  _key: string;
  _type: "image";
  asset?: {
    _ref: string;
    _type: "reference";
  };
  isFeatured?: boolean;
  showOnMobile?: boolean;
  isFeaturedMobile?: boolean;
}

function getImageUrl(
  client: ReturnType<typeof useClient>,
  source: PreviewImage
) {
  if (!source.asset) return null;
  const builder = imageUrlBuilder(client);
  return builder.image(source).width(200).height(150).url();
}

export function PreviewImagesInput(props: ArrayOfObjectsInputProps) {
  const { value = [], onChange, renderDefault } = props;
  const images = value as PreviewImage[];
  const client = useClient({ apiVersion: "2023-05-03" });

  const handleFeaturedClick = (imageKey: string, isMobile = false) => {
    const fieldName = isMobile ? 'isFeaturedMobile' : 'isFeatured';
    const updatedImages = images.map((img) => ({
      ...img,
      [fieldName]: img._key === imageKey ? !img[fieldName] : false, // Only one can be featured
    }));
    onChange(set(updatedImages));
  };

  const handleMobileToggle = (imageKey: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      showOnMobile: img._key === imageKey ? !img.showOnMobile : img.showOnMobile,
    }));
    onChange(set(updatedImages));
  };

  const renderGrid = (isMobile: boolean) => {
    const gridClass = isMobile ? "grid-cols-3" : "grid-cols-5";
    
    // For mobile, filter images that should be shown on mobile
    const displayImages = isMobile 
      ? images.filter(img => img.showOnMobile !== false).slice(0, 3)
      : images.slice(0, 4);

    return (
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">
          {isMobile ? `Mobile Preview (${displayImages.length}/3 selected)` : "Desktop Preview (4 images)"}
        </h4>
        <div
          className={`grid ${gridClass} gap-1.5 p-4 border rounded-lg bg-gray-50`}
        >
          {displayImages.map((image) => {
            const isFeatured = isMobile ? image.isFeaturedMobile : image.isFeatured;
            return (
              <div
                key={`${isMobile ? "mobile" : "desktop"}-${image._key}`}
                onClick={() => handleFeaturedClick(image._key, isMobile)}
                className={`relative overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all ${
                  isFeatured
                    ? "col-span-2 ring-2 ring-yellow-400"
                    : "col-span-1 aspect-[0.740]"
                } bg-gray-200 rounded-sm min-h-20`}
              >
                {image.asset ? (
                  <div className="w-full h-full relative">
                    {(() => {
                      const imageUrl = getImageUrl(client, image);
                      return imageUrl ? (
                        <div
                          className="w-full h-full bg-cover bg-center rounded-sm"
                          style={{ backgroundImage: `url(${imageUrl})` }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      );
                    })()}
                    {isFeatured && (
                      <div className="absolute top-1 right-1 bg-yellow-400 rounded-full p-1">
                        <StarIcon className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-xs text-gray-400 text-center">
                      No image
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="space-y-4">{renderDefault(props)}</div>

      <div className="mb-6 mt-2">
        {/* Mobile Grid Preview */}
        {renderGrid(true)}
        {/* Desktop Grid Preview */}
        {renderGrid(false)}
        
        {/* Mobile Selection Controls */}
        {images.length > 0 && (
          <div className="mt-4 p-4 border rounded-lg space-y-4">
            <h4 className="text-sm font-medium">Mobile Settings</h4>
            
            <div className="space-y-2">
              <p className="text-xs text-gray-600">Select which images to show on mobile (max 3):</p>
              {images.map((image, index) => (
                <label key={`mobile-${image._key}`} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={image.showOnMobile !== false}
                    onChange={() => handleMobileToggle(image._key)}
                    className="form-checkbox"
                  />
                  <span className="text-sm">Image {index + 1}</span>
                </label>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-600">Featured image on mobile:</p>
              {images.filter(img => img.showOnMobile !== false).map((image) => (
                <label key={`mobile-featured-${image._key}`} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="featured-mobile"
                    checked={image.isFeaturedMobile || false}
                    onChange={() => handleFeaturedClick(image._key, true)}
                    className="form-radio"
                  />
                  <span className="text-sm">
                    Image {images.indexOf(image) + 1} {image.isFeaturedMobile ? "⭐" : ""}
                  </span>
                </label>
              ))}
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="featured-mobile"
                  checked={!images.some(img => img.isFeaturedMobile)}
                  onChange={() => {
                    const updatedImages = images.map(img => ({ ...img, isFeaturedMobile: false }));
                    onChange(set(updatedImages));
                  }}
                  className="form-radio"
                />
                <span className="text-sm">None (all normal size)</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
