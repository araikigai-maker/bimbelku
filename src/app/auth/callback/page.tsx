"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const data = searchParams.get("data");
    const error = searchParams.get("error");

    if (error) {
      router.push(`/login?error=${error}`);
      return;
    }

    if (!data) {
      router.push("/login?error=no_data");
      return;
    }

    try {
      const json = JSON.parse(atob(decodeURIComponent(data)));
      localStorage.setItem("user", JSON.stringify(json));
      router.push("/dashboard");
    } catch {
      router.push("/login?error=invalid_data");
    }
  }, [searchParams, router]);

  return (
    <div className="text-center">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
      <p className="text-gray-600">Memproses masuk...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">Memproses masuk...</p>
        </div>
      }>
        <CallbackContent />
      </Suspense>
    </div>
  );
}
