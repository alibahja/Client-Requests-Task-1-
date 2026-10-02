import { LoginForm } from "../components/auth/LoginForm";

export function LoginPage() {
  return (
    <div
      className="bg-image flex min-h-screen items-center justify-center bg-cover bg-center p-4"
    >
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mb-6 text-sm text-gray-600">
          Sign in to the Client Requests dashboard
        </p>
        <LoginForm />
      </div>
    </div>
  );
}