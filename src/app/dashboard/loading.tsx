export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome Text Skeleton */}
      <div className="h-10 bg-gray-200 rounded w-1/3"></div>

      {/* Overall Progress Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Subject Progress Skeleton */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-md">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-14 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  );
} 