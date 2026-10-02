import { useAuth } from "../../hooks/useAuth";
import { Button } from "../common/Button";
import { initials } from "../../utils/format";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
            CR
          </div>
          <span className="text-sm font-semibold text-gray-900">
            Client Requests
          </span>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-medium text-gray-700">
              {initials(user.name)}
            </div>
            <span className="hidden text-sm text-gray-700 sm:inline">{user.name}</span>
            <Button variant="secondary" onClick={logout} className="text-xs">
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}