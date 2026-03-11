const ProfileSkeleton = () => (
  <div className="w-full space-y-6 animate-pulse">
    {/* Hero skeleton */}
    <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden">
      <div className="h-40 md:h-48 bg-gray-200" />
      <div className="px-6 md:px-8 pb-8 relative">
        <div className="flex flex-col sm:flex-row gap-6 md:gap-8 -mt-20 md:-mt-24 mb-6">
          <div className="flex justify-center sm:justify-start flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gray-300 border-6 border-white" />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-end pb-3 space-y-3">
            <div className="h-8 bg-gray-200 rounded-lg w-64" />
            <div className="h-5 bg-gray-200 rounded-lg w-48" />
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded-full w-28" />
              <div className="h-6 bg-gray-200 rounded-full w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Info skeleton */}
    <div className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 space-y-4">
      <div className="h-6 bg-gray-200 rounded-lg w-56 mb-6" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-20" />
            <div className="h-4 bg-gray-200 rounded w-40" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default ProfileSkeleton;
