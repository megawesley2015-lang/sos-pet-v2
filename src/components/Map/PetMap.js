"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Ícones customizados de patinha
const createPawIcon = (color) => {
  return L.divIcon({
    html: `
      <div style="
        font-size: 28px;
        filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.3));
        transform: rotate(-20deg);
      ">
        🐾
      </div>
      <div style="
        position: absolute;
        bottom: -5px;
        left: 50%;
        transform: translateX(-50%);
        width: 12px;
        height: 12px;
        background: ${color};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    className: "paw-marker",
    iconSize: [40, 50],
    iconAnchor: [20, 50],
    popupAnchor: [0, -50],
  });
};

// Cores por tipo/tempo
const MARKER_COLORS = {
  perdido: "#dc2626",      // Vermelho - onde foi perdido
  avistamento_recente: "#3b82f6",  // Azul - visto recentemente
  avistamento_antigo: "#f59e0b",   // Laranja - visto há mais tempo
  avistamento_frio: "#9ca3af",     // Cinza - sem relatos há muito tempo
  encontrado: "#16a34a",   // Verde - onde foi encontrado
};

// Determinar cor baseado no tempo
const getColorByAge = (dataAvistamento) => {
  const agora = new Date();
  const data = new Date(dataAvistamento);
  const diasPassados = (agora - data) / (1000 * 60 * 60 * 24);

  if (diasPassados <= 1) return MARKER_COLORS.avistamento_recente;  // Até 1 dia
  if (diasPassados <= 7) return MARKER_COLORS.avistamento_antigo;   // Até 1 semana
  return MARKER_COLORS.avistamento_frio;  // Mais de 1 semana
};

export default function PetMap({ 
  avistamentos = [], 
  petInfo = null,
  center = [-23.9934, -46.2567], // Guarujá por padrão
  zoom = 13,
  height = "400px",
  onMapClick = null,
  clickMode = false,
}) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const [selectedPosition, setSelectedPosition] = useState(null);

  useEffect(() => {
    // Inicializar mapa
    if (!mapInstanceRef.current && mapRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(center, zoom);

      // Tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Click handler para adicionar avistamento
      if (clickMode && onMapClick) {
        mapInstanceRef.current.on("click", (e) => {
          setSelectedPosition([e.latlng.lat, e.latlng.lng]);
          onMapClick(e.latlng.lat, e.latlng.lng);
        });
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Atualizar marcadores quando avistamentos mudam
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Limpar marcadores anteriores
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    if (polylineRef.current) {
      polylineRef.current.remove();
      polylineRef.current = null;
    }

    if (avistamentos.length === 0) return;

    // Ordenar por data
    const sortedAvistamentos = [...avistamentos].sort(
      (a, b) => new Date(a.data_avistamento) - new Date(b.data_avistamento)
    );

    const coordinates = [];

    // Adicionar marcadores
    sortedAvistamentos.forEach((av, index) => {
      const isFirst = index === 0;
      const isLast = index === sortedAvistamentos.length - 1;
      
      let color;
      if (av.tipo === "perdido") {
        color = MARKER_COLORS.perdido;
      } else if (av.tipo === "encontrado") {
        color = MARKER_COLORS.encontrado;
      } else {
        color = getColorByAge(av.data_avistamento);
      }

      const icon = createPawIcon(color);
      
      const marker = L.marker([av.latitude, av.longitude], { icon })
        .addTo(mapInstanceRef.current);

      // Popup com informações
      const popupContent = `
        <div style="min-width: 200px; font-family: system-ui;">
          <strong style="font-size: 14px; color: ${color};">
            ${av.tipo === "perdido" ? "📍 Local onde foi perdido" : 
              av.tipo === "encontrado" ? "✅ Local onde foi encontrado" : 
              "👀 Avistamento"}
          </strong>
          <p style="margin: 8px 0 4px; color: #374151; font-size: 13px;">
            ${av.descricao || "Sem descrição"}
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
            📅 ${new Date(av.data_avistamento).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit", 
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
      coordinates.push([av.latitude, av.longitude]);
    });

    // Desenhar linha conectando os pontos (trajeto)
    if (coordinates.length > 1) {
      polylineRef.current = L.polyline(coordinates, {
        color: "#20B2AA",
        weight: 3,
        opacity: 0.7,
        dashArray: "10, 10",
      }).addTo(mapInstanceRef.current);
    }

    // Ajustar bounds para mostrar todos os marcadores
    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [avistamentos]);

  // Marcador de seleção (quando em modo click)
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPosition) return;

    const tempMarker = L.marker(selectedPosition, {
      icon: L.divIcon({
        html: `<div style="font-size: 30px;">📍</div>`,
        className: "temp-marker",
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      }),
    }).addTo(mapInstanceRef.current);

    return () => {
      tempMarker.remove();
    };
  }, [selectedPosition]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height, width: "100%", borderRadius: "16px", zIndex: 1 }}
      />
      
      {/* Legenda */}
      <div className="absolute bottom-4 left-4 bg-white rounded-xl p-3 shadow-lg z-[1000]">
        <p className="text-xs font-bold text-gray-700 mb-2">Legenda:</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: MARKER_COLORS.perdido }}></span>
            <span>Onde foi perdido</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: MARKER_COLORS.avistamento_recente }}></span>
            <span>Visto recentemente</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: MARKER_COLORS.avistamento_antigo }}></span>
            <span>Visto há dias</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: MARKER_COLORS.avistamento_frio }}></span>
            <span>Sem relatos recentes</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ background: MARKER_COLORS.encontrado }}></span>
            <span>Encontrado</span>
          </div>
        </div>
      </div>

      {clickMode && (
        <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-xl px-4 py-2 shadow-lg z-[1000]">
          <p className="text-sm font-medium">📍 Clique no mapa para marcar o local</p>
        </div>
      )}
    </div>
  );
}
