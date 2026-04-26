import { useSelector } from "react-redux";

const GlobalLoader = () => {
  const pendingRequests = useSelector((store) => store.ui.pendingRequests);

  if (!pendingRequests) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65">
      <div className="flex flex-col items-center rounded-xl bg-zinc-900/90 px-8 py-6 shadow-2xl">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
        <p className="mt-4 text-sm font-medium tracking-wide text-white">
          
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;
