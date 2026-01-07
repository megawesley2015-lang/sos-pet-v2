"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getPetById } from "@/services/pets.service";

const STATUS_CONFIG = {
  perdido: {
    label: "PERDIDO",
    bg: "bg-red-100",
    text: "text-red-600",
    description: "Este pet está perdido. Se você o viu, entre em contato!"
  },
  encontrado: {
    label: "ENCONTRADO",
    bg: "bg-green-100", 
    text: "text-green-600",
    description: "Este pet foi encontrado. Se é seu, entre em contato!"
  },
  adocao: {
    label: "PARA ADOÇÃO",
    bg: "bg-blue-100",
    text: "text-blue-600",
    description: "Este pet está disponível para adoção."
  }
};

const ESPECIE_EMOJI = {
  cao: "🐕",
  gato: "🐈",
  ave: "🐦",
  outro: "🐾"
};

export default function PetDetalhes() {
  const params = useParams();
  const router = useRouter();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPet() {
      try {
        setLoading(true);
        const data = await getPetById(params.id);
        setPet(data);
      } catch (err) {
        console.error("Erro ao carregar pet:", err);
        setError("Pet não encontrado");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      fetchPet();
    }
  }, [params.id]);

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

  if (error || !pet) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-20">
          <span className="text-6xl block mb-4">😿</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pet não encontrado</h1>
          <Link href="/achados-e-perdidos" className="text-[#20B2AA] font-bold">
            ← Voltar para a lista
          </Link>
        </div>
      </main>
    );
  }

  const statusConfig = STATUS_CONFIG[pet.status] || STATUS_CONFIG.perdido;
  const especieEmoji = ESPECIE_EMOJI[pet.especie] || "🐾";
  
  const whatsappLink = `https://wa.me/55${pet.contato_telefone.replace(/\D/g, '')}?text=Olá! Vi o anúncio do pet "${pet.nome || 'sem nome'}" no SOS Pet e gostaria de mais informações.`;

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Voltar */}
        <Link 
          href="/achados-e-perdidos" 
          className="inline-flex items-center text-gray-600 hover:text-[#20B2AA] font-medium mb-8"
        >
          ← Voltar para a lista
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
          
          {/* Imagem */}
          {pet.imagem_url ? (
            <div className="w-full h-80 md:h-96">
              <img 
                src={pet.imagem_url} 
                alt={pet.nome || "Pet"} 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
              <span className="text-8xl">{especieEmoji}</span>
            </div>
          )}

          <div className="p-8">
            {/* Status Badge */}
            <div className={`${statusConfig.bg} ${statusConfig.text} text-sm font-bold px-4 py-2 rounded-full inline-block mb-4`}>
              {statusConfig.label}
            </div>

            {/* Nome e Info Básica */}
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              {pet.nome || "Sem nome"}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              {pet.especie === "cao" ? "Cão" : pet.especie === "gato" ? "Gato" : pet.especie}
              {pet.raca && ` • ${pet.raca}`}
              {pet.cor && ` • ${pet.cor}`}
            </p>

            {/* Alerta */}
            <div className={`${statusConfig.bg} ${statusConfig.text} p-4 rounded-xl mb-8`}>
              <p className="font-medium">{statusConfig.description}</p>
            </div>

            {/* Informações Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 border-b pb-2">Informações do Pet</h3>
                
                {pet.porte && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Porte</span>
                    <span className="font-medium capitalize">{pet.porte}</span>
                  </div>
                )}
                
                {pet.sexo && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sexo</span>
                    <span className="font-medium capitalize">{pet.sexo === 'macho' ? 'Macho' : 'Fêmea'}</span>
                  </div>
                )}
                
                {pet.idade_aproximada && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Idade aproximada</span>
                    <span className="font-medium">{pet.idade_aproximada}</span>
                  </div>
                )}

                {pet.comportamento && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Comportamento</span>
                    <span className="font-medium capitalize">{pet.comportamento}</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 border-b pb-2">Localização e Data</h3>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">📍 Local</span>
                  <span className="font-medium">{pet.localizacao}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-500">📅 Data</span>
                  <span className="font-medium">
                    {new Date(pet.data_ocorrencia).toLocaleDateString("pt-BR")}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">🕐 Cadastrado em</span>
                  <span className="font-medium">
                    {new Date(pet.created_at).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            </div>

            {/* Descrição */}
            {pet.descricao && (
              <div className="mb-8">
                <h3 className="font-bold text-gray-800 mb-3">Descrição</h3>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">
                  {pet.descricao}
                </p>
              </div>
            )}

            {/* Contato */}
            <div className="border-t pt-8">
              <h3 className="font-bold text-gray-800 mb-4">Entre em Contato</h3>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {pet.contato_whatsapp ? (
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
                ) : null}
                
                <a
                  href={`tel:${pet.contato_telefone}`}
                  className="flex-1 bg-[#20B2AA] hover:bg-[#1a9e97] text-white py-4 px-6 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2"
                >
                  📞 Ligar: {pet.contato_telefone}
                </a>
              </div>

              <p className="text-sm text-gray-500 mt-4 text-center">
                Responsável: {pet.contato_nome}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
