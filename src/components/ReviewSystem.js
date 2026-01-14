"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

/**
 * ReviewSystem - Sistema completo de avaliações para prestadores
 * 
 * Features:
 * - Exibição de avaliações existentes
 * - Formulário para nova avaliação (usuários logados)
 * - Rating com estrelas (1-5)
 * - Média e contagem de avaliações
 * - Ordenação por data/nota
 * 
 * @param {Object} props
 * @param {string} props.prestadorId - ID do prestador
 * @param {boolean} props.showForm - Se deve mostrar formulário de avaliação
 * @returns {JSX.Element}
 */

/**
 * Componente de estrelas interativas
 */
function StarRating({ rating, onRate, readonly = false, size = "md" }) {
  const [hover, setHover] = useState(0);
  
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRate && onRate(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
          className={`${sizeClasses[size]} transition-colors ${
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          }`}
          aria-label={`${star} estrela${star > 1 ? "s" : ""}`}
        >
          {(hover || rating) >= star ? "⭐" : "☆"}
        </button>
      ))}
    </div>
  );
}

/**
 * Card individual de avaliação
 */
function ReviewCard({ review }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#20B2AA] rounded-full flex items-center justify-center text-white font-bold">
            {review.autor_nome?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-bold text-gray-800">{review.autor_nome || "Usuário"}</p>
            <p className="text-xs text-gray-400">{formatDate(review.created_at)}</p>
          </div>
        </div>
        <StarRating rating={review.nota} readonly size="sm" />
      </div>
      
      {review.comentario && (
        <p className="text-gray-600 text-sm leading-relaxed">
          {review.comentario}
        </p>
      )}
      
      {review.servico_utilizado && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Serviço: </span>
          <span className="text-xs font-medium text-gray-600">{review.servico_utilizado}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Sumário de avaliações (média, distribuição)
 */
function ReviewSummary({ reviews }) {
  if (!reviews || reviews.length === 0) return null;

  const total = reviews.length;
  const media = reviews.reduce((acc, r) => acc + r.nota, 0) / total;
  
  // Distribuição por estrelas
  const distribuicao = [5, 4, 3, 2, 1].map((estrela) => ({
    estrela,
    count: reviews.filter((r) => r.nota === estrela).length,
    percent: (reviews.filter((r) => r.nota === estrela).length / total) * 100,
  }));

  return (
    <div className="bg-gray-50 rounded-2xl p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Média */}
        <div className="text-center">
          <div className="text-5xl font-black text-gray-800">{media.toFixed(1)}</div>
          <StarRating rating={Math.round(media)} readonly size="md" />
          <p className="text-sm text-gray-500 mt-1">{total} avaliação{total !== 1 ? "ões" : ""}</p>
        </div>

        {/* Distribuição */}
        <div className="flex-1 w-full">
          {distribuicao.map(({ estrela, count, percent }) => (
            <div key={estrela} className="flex items-center gap-2 mb-1">
              <span className="text-sm text-gray-500 w-12">{estrela} ⭐</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Formulário de nova avaliação
 */
function ReviewForm({ prestadorId, onSuccess }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [servico, setServico] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError("Você precisa estar logado para avaliar.");
      return;
    }

    if (nota === 0) {
      setError("Por favor, selecione uma nota.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { error: insertError } = await supabase.from("avaliacoes").insert({
        prestador_id: prestadorId,
        user_id: user.id,
        autor_nome: user.user_metadata?.nome || user.email?.split("@")[0],
        nota,
        comentario: comentario.trim() || null,
        servico_utilizado: servico.trim() || null,
      });

      if (insertError) throw insertError;

      setNota(0);
      setComentario("");
      setServico("");
      onSuccess?.();
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      setError("Erro ao enviar avaliação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gray-50 rounded-2xl p-6 text-center">
        <p className="text-gray-600 mb-4">Faça login para deixar sua avaliação</p>
        <a
          href="/login"
          className="inline-block px-6 py-2 bg-[#20B2AA] hover:bg-[#1a9e97] text-white font-bold rounded-xl transition-all"
        >
          Entrar
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-6">
      <h3 className="font-bold text-lg text-gray-800 mb-4">Deixe sua avaliação</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Nota */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sua nota *
        </label>
        <StarRating rating={nota} onRate={setNota} size="lg" />
      </div>

      {/* Serviço */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Serviço utilizado
        </label>
        <input
          type="text"
          value={servico}
          onChange={(e) => setServico(e.target.value)}
          placeholder="Ex: Consulta, Banho e Tosa, Vacina..."
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-colors"
        />
      </div>

      {/* Comentário */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comentário
        </label>
        <textarea
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Conte como foi sua experiência..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none transition-colors resize-none"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || nota === 0}
        className="w-full py-3 bg-[#FF6B35] hover:bg-[#e85a2a] disabled:bg-gray-300 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Enviando...
          </>
        ) : (
          <>
            ⭐ Enviar Avaliação
          </>
        )}
      </button>
    </form>
  );
}

/**
 * Componente principal do sistema de avaliações
 */
export default function ReviewSystem({ prestadorId, showForm = true }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent"); // recent, highest, lowest

  const fetchReviews = async () => {
    try {
      let query = supabase
        .from("avaliacoes")
        .select("*")
        .eq("prestador_id", prestadorId);

      if (sortBy === "recent") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "highest") {
        query = query.order("nota", { ascending: false });
      } else if (sortBy === "lowest") {
        query = query.order("nota", { ascending: true });
      }

      const { data, error } = await query;

      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error("Erro ao carregar avaliações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (prestadorId) {
      fetchReviews();
    }
  }, [prestadorId, sortBy]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 mt-2">Carregando avaliações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sumário */}
      {reviews.length > 0 && <ReviewSummary reviews={reviews} />}

      {/* Formulário */}
      {showForm && (
        <ReviewForm prestadorId={prestadorId} onSuccess={fetchReviews} />
      )}

      {/* Lista de avaliações */}
      {reviews.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-gray-800">
              Avaliações ({reviews.length})
            </h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none"
            >
              <option value="recent">Mais recentes</option>
              <option value="highest">Maior nota</option>
              <option value="lowest">Menor nota</option>
            </select>
          </div>

          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}

      {/* Estado vazio */}
      {reviews.length === 0 && !showForm && (
        <div className="text-center py-8 bg-gray-50 rounded-2xl">
          <span className="text-4xl block mb-2">⭐</span>
          <p className="text-gray-500">Nenhuma avaliação ainda</p>
        </div>
      )}
    </div>
  );
}

/**
 * Componente simplificado para exibir apenas média e estrelas
 */
export function ReviewBadge({ prestadorId }) {
  const [stats, setStats] = useState({ media: 0, total: 0 });

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data } = await supabase
          .from("avaliacoes")
          .select("nota")
          .eq("prestador_id", prestadorId);

        if (data && data.length > 0) {
          const media = data.reduce((acc, r) => acc + r.nota, 0) / data.length;
          setStats({ media, total: data.length });
        }
      } catch (err) {
        console.error("Erro ao buscar stats:", err);
      }
    }

    if (prestadorId) fetchStats();
  }, [prestadorId]);

  if (stats.total === 0) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-yellow-500">⭐</span>
      <span className="font-bold">{stats.media.toFixed(1)}</span>
      <span className="text-gray-400 text-sm">({stats.total})</span>
    </div>
  );
}
