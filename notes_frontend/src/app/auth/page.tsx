"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, register, error, clearError } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    if (isRegister) {
      await register(email, password);
    } else {
      await login(email, password);
    }
    router.replace("/");
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-screen">
      <form
        className="flex flex-col gap-3 w-80 shadow-lg bg-white dark:bg-neutral-900 p-8 rounded"
        onSubmit={handleSubmit}
      >
        <h1 className="font-bold text-xl mb-2">
          {isRegister ? "Register" : "Login"}
        </h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-2 rounded border"
          required
        />
        <input
          type="password"
          minLength={8}
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 rounded border"
          required
        />
        <button
          type="submit"
          className="bg-primary text-white rounded p-2 font-semibold"
        >
          {isRegister ? "Create Account" : "Login"}
        </button>
        <button
          type="button"
          className="underline text-xs mt-2"
          onClick={() => {
            clearError();
            setIsRegister(!isRegister);
          }}
        >
          {isRegister
            ? "Already have an account? Sign in"
            : "No account? Register"}
        </button>
        {error && <div className="text-red-500 text-xs">{error}</div>}
      </form>
    </div>
  );
}
