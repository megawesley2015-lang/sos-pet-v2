"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

/**
 * StatsSection - Componente de Estatísticas com Prova Social
 * 
 * Features:
 * - Contadores animados (count-up effect)
 * - Dados reais do Supabase
 * - Fallback para valores estáticos se DB falhar
 * - Intersection Observer para animar só quando visível
 * - Design responsivo e acessível
 * 
 * @returns {JSX.Element}
 */

/**
 * Hook para animação de contagem
 * @param {number} end - Valor final
 * @param {number} duration - Duração em ms
 * @param {boolean} start - Se deve iniciar
 */
function useCountUp(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    
    let startTime = null;
    const startValue = 0;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(easeOut * (end - startValue) + startValue);
      
      setCount(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}

/**
 * Componente individual de estatística
 */
function StatCard({ emoji, value, label, suffix = "", isVisible }) {
  const animatedValue = useCountUp(value, 2000, isVisible);

  return (
    <div className="text-center p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100">
      <span className="text-4xl mb-3 block" aria-hidden="true">
        {emoji}
      </span>
      <div className="text-4xl md:text-5xl font-black text-[#20B2AA] mb-2">
        {animatedValue.toLocaleString("pt-BR")}
        {suffix && <span className="text-2xl">{suffix}</span>}
      </div>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState({
    petsAjudados: 0,
    reencontros: 0,
    prestadores: 0,
    parceiros: 0,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const sectionRef = useRef(null);

  // Intersection Observer para animar quando visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  // Buscar estatísticas reais do banco
  useEffect(() => {
    async function fetchStats() {
      try {
        // Total de pets cadastrados (perdidos + encontrados)
        const { count: petsCount } = await supabase
          .from("pets")
          .select("*", { count: "exact", head: true });

        // Pets reencontrados (status = encontrado)
        const { count: reencontrosCount } = await supabase
          .from("pets")
          .select("*", { count: "exact", head: true })
          .eq("status", "encontrado");

        // Prestadores aprovados
        const { count: prestadoresCount } = await supabase
          .from("prestadores")
          .select("*", { count: "exact", head: true })
          .eq("status", "aprovado");

        // Parceiros (se a tabela existir)
        let parceirosCount = 0;
        try {
          const { count } = await supabase
            .from("parceiros")
            .select("*", { count: "exact", head: true })
            .eq("status", "aprovado");
          parceirosCount = count || 0;
        } catch {
          parceirosCount = 0;
        }

        setStats({
          petsAjudados: petsCount || 0,
          reencontros: reencontrosCount || 0,
          prestadores: prestadoresCount || 0,
          parceiros: parceirosCount || 0,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
        // Fallback para valores demonstrativos
        setStats({
          petsAjudados: 127,
          reencontros: 34,
          prestadores: 45,
          parceiros: 8,
        });
      } finally {
        setLoaded(true);
      }
    }

    fetchStats();
  }, []);

  // Configuração das estatísticas exibidas
  const statsConfig = [
    {
      emoji: "🐾",
      value: stats.petsAjudados,
      label: "Pets Cadastrados",
    },
    {
      emoji: "💚",
      value: stats.reencontros,
      label: "Reencontros Felizes",
    },
    {
      emoji: "🏥",
      value: stats.prestadores,
      label: "Prestadores Parceiros",
    },
    {
      emoji: "🤝",
      value: stats.parceiros,
      label: "ONGs Parceiras",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-16 bg-gradient-to-b from-gray-50 to-white"
      aria-labelledby="stats-heading"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            id="stats-heading"
            className="text-3xl md:text-4xl font-black text-gray-800 mb-4"
          >
            Fazendo a diferença juntos 🐶🐱
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cada número representa uma história de amor, cuidado e esperança. 
            Obrigado por fazer parte dessa comunidade!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {statsConfig.map((stat, index) => (
            <StatCard
              key={index}
              emoji={stat.emoji}
              value={stat.value}
              label={stat.label}
              suffix={stat.suffix}
              isVisible={isVisible && loaded}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-500 mb-4">
            Quer fazer parte dessa história?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/achados-e-perdidos/cadastrar"
              className="px-6 py-3 bg-[#FF6B35] hover:bg-[#e85a2a] text-white font-bold rounded-xl transition-all inline-flex items-center justify-center gap-2"
            >
              🔍 Cadastrar Pet
            </a>
            <a
              href="/parcerias"
              className="px-6 py-3 bg-[#20B2AA] hover:bg-[#1a9e97] text-white font-bold rounded-xl transition-all inline-flex items-center justify-center gap-2"
            >
              🤝 Seja Parceiro
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
