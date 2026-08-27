export default function Loading() {
  // Return your custom skeleton or spinner component
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <p className="ml-3 text-lg font-semibold">Loading...</p>
    </div>
  );
}