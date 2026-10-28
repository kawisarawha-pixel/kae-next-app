"use client";

import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  function handleLogin() {
    router.push("/week07/login");
  }

  return (
    <button
      onClick={handleLogin}
      className="rounded bg-green-600 px-4 py-2 text-white m-2"
    >
      Login
    </button>
  );
}
