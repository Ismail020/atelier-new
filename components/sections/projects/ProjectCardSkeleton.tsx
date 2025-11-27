import ProjectImageGridSkeleton from "./ProjectImageGridSkeleton";

export default function ProjectCardSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <ProjectImageGridSkeleton />

      <div className="grid grid-cols-3 md:grid-cols-5">
        {/* Project name skeleton */}
        <div className="h-5 w-24 animate-pulse rounded bg-gray-200"></div>

        {/* Date skeleton */}
        <div className="h-5 w-20 animate-pulse rounded bg-gray-200"></div>

        {/* Link/button skeleton */}
        <div className="flex justify-end md:col-span-3">
          <div className="flex items-center gap-3">
            <div className="hidden h-5 w-16 animate-pulse rounded bg-gray-200 md:block"></div>
            <div className="h-4 w-4 animate-pulse rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
