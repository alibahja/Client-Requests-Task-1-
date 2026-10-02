import { RegisterForm } from "../components/auth/RegisterForm";

export function RegisterPage() {
  return (
    <div className="bg-image flex min-h-screen items-center justify-center bg-cover bg-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="mb-6 text-sm text-gray-600">
          Start managing client requests in seconds
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}