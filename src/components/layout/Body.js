import Login from "../auth/Login";
import Browse from "../browse/Browse";
import MovieDetails from "../movies/MovieDetails";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuthSync } from "../../hooks/useAuthSync";

const FullscreenLoader = () => (
  <div className="min-h-screen bg-black text-white flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent" />
      <p className="text-sm text-white/80">Loading…</p>
    </div>
  </div>
);

const Body = () => {
  useAuthSync();
  const user = useSelector((store) => store.user);
  const authChecked = useSelector((store) => store.ui.authChecked);

  const RequireAuth = ({ children }) => {
    if (!authChecked) return <FullscreenLoader />;
    if (!user) return <Navigate to="/" replace />;
    return children;
  };

  const RequireGuest = ({ children }) => {
    if (!authChecked) return <FullscreenLoader />;
    if (user) return <Navigate to="/browse" replace />;
    return children;
  };

  const appRouter = createBrowserRouter([
    { path: "/", element: <RequireGuest><Login /></RequireGuest> },
    { path: "/browse", element: <RequireAuth><Browse /></RequireAuth> },
    { path: "/browse/movie/:movieId", element: <RequireAuth><MovieDetails /></RequireAuth> },
  ]);
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default Body;

