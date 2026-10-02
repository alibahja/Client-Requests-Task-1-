import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "../common/Spinner";

export function ProtectedRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  // While we verify the token with the backend, show a spinner
  // (prevents a flash of redirect-to-login on refresh)
  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    // `replace` so the login page isn't in history as a forward-navigable step
    // `state.from` lets login send the user back where they were
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}