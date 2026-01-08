"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Capturar o código da URL
        const code = searchParams.get("code");
        
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error("Erro ao trocar código:", error);
            router.push("/login?error=callback_failed");
            return;
          }
        }

        // Verificar sessão
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const type = searchParams.get("type");
          
          if (type === "recovery") {
            router.push("/redefinir-senha");
          } else {
            const next = searchParams.get("next") || "/";
            router.push(next);
          }
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Erro no callback:", err);
        router.push("/login?error=unknown");
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="text-center">
      <div className="inline-block w-12 h-12 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 font-medium">Autenticando...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Suspense fallback={
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Carregando...</p>
        </div>
      }>
        <AuthCallbackContent />
      </Suspense>
    </main>
  );
}
