"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Capturar o código da URL (para magic link / reset password)
        const code = searchParams.get("code");
        
        if (code) {
          // Trocar o código por uma sessão
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          
          if (error) {
            console.error("Erro ao trocar código:", error);
            router.push("/login?error=callback_failed");
            return;
          }
        }

        // Verificar se há sessão ativa
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Verificar se veio de recuperação de senha
          const type = searchParams.get("type");
          
          if (type === "recovery") {
            // Redirecionar para página de redefinir senha
            router.push("/redefinir-senha");
          } else {
            // Redirecionar para home ou página anterior
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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-medium">Autenticando...</p>
      </div>
    </main>
  );
}
