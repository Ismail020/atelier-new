export default function ProjectImageGridSkeleton() {
  const renderSkeletonGrid = (isMobile: boolean) => {
    const skeletonCount = isMobile ? 3 : 4;

    return Array.from({ length: skeletonCount }).map((_, index) => {
      const isLastDesktopSkeleton = !isMobile && index === skeletonCount - 1;
      const colSpan = isLastDesktopSkeleton ? "col-span-2" : "col-span-1";
      const aspectRatio = isLastDesktopSkeleton ? "" : "aspect-[0.740]";

      return (
        <div
          key={`skeleton-${isMobile ? "mobile" : "desktop"}-${index}`}
          className={`${colSpan} ${aspectRatio} animate-pulse rounded-sm bg-gray-200`}
        />
      );
    });
  };

  return (
    <>
      {/* Mobile Loading Grid - 3 columns */}
      <div className="grid grid-cols-3 gap-1.5 md:hidden">{renderSkeletonGrid(true)}</div>

      {/* Desktop Loading Grid - 5 columns */}
      <div className="hidden gap-1.5 md:grid md:grid-cols-5">{renderSkeletonGrid(false)}</div>
    </>
  );
}
