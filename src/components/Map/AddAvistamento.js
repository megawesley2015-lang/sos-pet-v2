"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "@/lib/supabase";

// Importar mapa dinamicamente (SSR desabilitado)
const PetMap = dynamic(() => import("./PetMap"), { 
  ssr: false,
  loading: () => (
    <div className="h-[300px] bg-gray-100 rounded-xl flex items-center justify-center">
      <p className="text-gray-500">Carregando mapa...</p>
    </div>
  ),
});

export default function AddAvistamento({ petId, petNome, onSuccess }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [data, setData] = useState(new Date().toISOString().split("T")[0]);
  const [hora, setHora] = useState(new Date().toTimeString().slice(0, 5));

  const handleMapClick = (lat, lng) => {
    setPosition({ lat, lng });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!position) {
      alert("Por favor, clique no mapa para marcar onde você viu o pet.");
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      const dataHora = new Date(`${data}T${hora}`);

      const { error } = await supabase
        .from("avistamentos")
        .insert({
          pet_id: petId,
          latitude: position.lat,
          longitude: position.lng,
          descricao: descricao || null,
          data_avistamento: dataHora.toISOString(),
          reportado_por: session?.user?.id || null,
          tipo: "avistamento",
        });

      if (error) throw error;

      alert("Avistamento registrado com sucesso! Obrigado por ajudar! 🐾");
      setIsOpen(false);
      setPosition(null);
      setDescricao("");
      
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error("Erro ao registrar avistamento:", err);
      alert("Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Erro ao obter localização:", err);
          alert("Não foi possível obter sua localização. Clique no mapa para marcar.");
        }
      );
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
      >
        👀 Eu vi esse pet!
      </button>
    );
  }

  return (
    <div className="bg-blue-50 rounded-2xl p-6 border-2 border-blue-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-blue-800">
          📍 Registrar Avistamento de {petNome}
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Mapa */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Onde você viu? *
            </label>
            <button
              type="button"
              onClick={handleGetLocation}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-lg"
            >
              📍 Usar minha localização
            </button>
          </div>
          <PetMap
            height="250px"
            clickMode={true}
            onMapClick={handleMapClick}
            avistamentos={position ? [{ 
              latitude: position.lat, 
              longitude: position.lng,
              tipo: "avistamento",
              data_avistamento: new Date().toISOString(),
            }] : []}
          />
          {position && (
            <p className="text-xs text-green-600 mt-2">
              ✓ Local selecionado: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
            </p>
          )}
        </div>

        {/* Data e Hora */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data *
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              required
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora aproximada *
            </label>
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-400 outline-none"
            />
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Detalhes (opcional)
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Estava perto da padaria, parecia assustado..."
            rows={3}
            className="w-full px-4 py-2 rounded-xl border-2 border-gray-200 focus:border-blue-400 outline-none resize-none"
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-xl font-bold"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !position}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Salvando...
              </>
            ) : (
              "Registrar Avistamento"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
