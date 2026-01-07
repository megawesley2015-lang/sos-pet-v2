"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getPrestadorBySlug, getPrestadorById, getAvaliacoesByPrestador } from "@/services/prestadores.service";

const CATEGORIA_EMOJI = {
  'Veterinário': '🏥',
  'Pet Shop': '🛍️',
  'Hotel': '🏨',
  'Banho e Tosa': '✂️',
  'Adestramento': '🎓',
  'Passeador': '🦮',
  'Creche': '🏠',
};

export default function PrestadorDetalhes() {
  const params = useParams();
  const [prestador, setPrestador] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPrestador() {
      try {
        setLoading(true);
        
        // Tentar buscar por slug primeiro, depois por ID
        let data;
        try {
          data = await getPrestadorBySlug(params.slug);
        } catch {
          data = await getPrestadorById(params.slug);
        }
        
        setPrestador(data);

        // Buscar avaliações
        if (data?.id) {
          const avs = await getAvaliacoesByPrestador(data.id);
          setAvaliacoes(avs || []);
        }
      } catch (err) {
        console.error("Erro ao carregar prestador:", err);
        setError("Prestador não encontrado");
      } finally {
        setLoading(false);
      }
    }

    if (params.slug) {
      fetchPrestador();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Carregando...</p>
        </div>
      </main>
    );
  }

  if (error || !prestador) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <span className="text-6xl block mb-4">😿</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Prestador não encontrado</h1>
          <Link href="/prestadores" className="text-[#20B2AA] font-bold">
            ← Voltar para a lista
          </Link>
        </div>
      </main>
    );
  }

  const emoji = CATEGORIA_EMOJI[prestador.categoria] || '🐾';
  
  const whatsappLink = prestador.WhatsApp 
    ? `https://wa.me/55${prestador.WhatsApp.replace(/\D/g, '')}?text=Olá! Vi seu perfil no SOS Pet e gostaria de mais informações.`
    : null;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Voltar */}
        <Link
          href="/prestadores"
          className="inline-flex items-center text-gray-600 hover:text-[#20B2AA] font-medium mb-8"
        >
          ← Voltar para a lista
        </Link>

        {/* Card Principal */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg mb-8">
          {/* Header com Avatar */}
          <div className="bg-gradient-to-br from-[#20B2AA] to-[#1a9e97] p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {prestador.Avatar ? (
                <img
                  src={prestador.Avatar}
                  alt={prestador.Nome}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-white/20"
                />
              ) : (
                <div className="w-32 h-32 bg-white/20 rounded-2xl flex items-center justify-center">
                  <span className="text-5xl">{emoji}</span>
                </div>
              )}

              <div className="text-center md:text-left">
                {/* Badges */}
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-3">
                  {prestador.verificado && (
                    <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ✓ Verificado
                    </span>
                  )}
                  {prestador.emergencia_24h && (
                    <span className="bg-[#FF6B35] text-white text-xs font-bold px-3 py-1 rounded-full">
                      ⚡ 24h
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-black mb-2">{prestador.Nome}</h1>
                <p className="text-white/90 font-semibold">{prestador.categoria}</p>

                {/* Rating */}
                <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                  <span className="text-yellow-400 text-xl">⭐</span>
                  <span className="font-black text-xl">
                    {prestador.media_avaliacoes?.toFixed(1) || '0.0'}
                  </span>
                  <span className="text-white/70">
                    ({prestador.total_avaliacoes || 0} avaliações)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-8">
            {/* Especialidades */}
            {prestador.especialidades && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Especialidades</h3>
                <p className="text-gray-600">{prestador.especialidades}</p>
              </div>
            )}

            {/* Biografia */}
            {prestador.biografia && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Sobre</h3>
                <p className="text-gray-600">{prestador.biografia}</p>
              </div>
            )}

            {/* Serviços */}
            {prestador.Servicos && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Serviços</h3>
                <p className="text-gray-600">{prestador.Servicos}</p>
              </div>
            )}

            {/* Horários */}
            {prestador.Horarios && (
              <div className="mb-6">
                <h3 className="font-bold text-gray-800 mb-2">Horários de Funcionamento</h3>
                <p className="text-gray-600">{prestador.Horarios}</p>
              </div>
            )}

            {/* Informações de Contato */}
            <div className="border-t pt-6 mt-6">
              <h3 className="font-bold text-gray-800 mb-4">Contato e Localização</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {prestador.Endereco && (
                  <div className="flex items-start gap-2">
                    <span>📍</span>
                    <span className="text-gray-600">{prestador.Endereco}</span>
                  </div>
                )}

                {prestador.telefone && (
                  <div className="flex items-center gap-2">
                    <span>📞</span>
                    <a href={`tel:${prestador.telefone}`} className="text-[#20B2AA] font-medium">
                      {prestador.telefone}
                    </a>
                  </div>
                )}

                {prestador.Email && (
                  <div className="flex items-center gap-2">
                    <span>✉️</span>
                    <a href={`mailto:${prestador.Email}`} className="text-[#20B2AA] font-medium">
                      {prestador.Email}
                    </a>
                  </div>
                )}

                {prestador.Site && (
                  <div className="flex items-center gap-2">
                    <span>🌐</span>
                    <a href={prestador.Site} target="_blank" rel="noopener noreferrer" className="text-[#20B2AA] font-medium">
                      Site
                    </a>
                  </div>
                )}
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-col sm:flex-row gap-4">
                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                )}

                {prestador.telefone && (
                  <a
                    href={`tel:${prestador.telefone}`}
                    className="flex-1 bg-[#20B2AA] hover:bg-[#1a9e97] text-white py-4 px-6 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2"
                  >
                    📞 Ligar
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Avaliações */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h2 className="text-2xl font-black text-gray-800 mb-6">
            Avaliações ({avaliacoes.length})
          </h2>

          {avaliacoes.length > 0 ? (
            <div className="space-y-6">
              {avaliacoes.map((avaliacao, index) => (
                <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">
                      {avaliacao.usuario || "Anônimo"}
                    </span>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < avaliacao.nota ? "text-yellow-500" : "text-gray-300"}>
                          ⭐
                        </span>
                      ))}
                    </div>
                  </div>
                  {avaliacao.comentario && (
                    <p className="text-gray-600">{avaliacao.comentario}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(avaliacao.Dados).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <span className="text-4xl block mb-2">💬</span>
              <p>Nenhuma avaliação ainda</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
