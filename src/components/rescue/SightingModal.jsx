"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/**
 * SightingModal - Modal de Avistamento com Câmera e GPS
 * 
 * Este é um dos componentes mais complexos do sistema. Ele permite que qualquer
 * pessoa que tenha visto um pet perdido possa reportar o avistamento de forma
 * rápida e completa, incluindo:
 * 
 * 1. FOTO: Captura direta da câmera ou upload da galeria
 * 2. LOCALIZAÇÃO: GPS automático com endereço aproximado
 * 3. DESCRIÇÃO: Campo opcional para observações
 * 
 * O fluxo é dividido em 3 etapas (steps):
 * - "photo": Captura ou seleção da foto
 * - "location": Obtenção automática do GPS
 * - "confirm": Revisão e envio final
 * 
 * Props:
 * - isOpen: boolean que controla visibilidade do modal
 * - onClose: função para fechar o modal
 * - onSubmit: função assíncrona que recebe os dados do avistamento
 * - petInfo: objeto com { id, name, photoUrl } do pet sendo reportado
 */

export default function SightingModal({
  isOpen,
  onClose,
  onSubmit,
  petInfo,
}) {
  // ========== ESTADOS PRINCIPAIS ==========
  
  // Controla em qual etapa o usuário está
  const [step, setStep] = useState("photo"); // "photo" | "location" | "confirm"
  
  // URL da preview da foto (base64 para exibição)
  const [photoPreview, setPhotoPreview] = useState(null);
  
  // Arquivo da foto (File object para upload)
  const [photoFile, setPhotoFile] = useState(null);
  
  // Texto de descrição/observações
  const [description, setDescription] = useState("");
  
  // Flag de envio em andamento
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Flag se a câmera está ativa
  const [cameraActive, setCameraActive] = useState(false);
  
  // Estado da geolocalização
  const [location, setLocation] = useState({
    status: "idle", // "idle" | "loading" | "success" | "error"
    coords: null,   // { lat: number, lng: number }
    address: null,  // string com endereço aproximado
    error: null,    // mensagem de erro, se houver
  });

  // ========== REFS (referências para elementos DOM) ==========
  
  // Referência para o elemento <video> (preview da câmera)
  const videoRef = useRef(null);
  
  // Referência para o <canvas> (usado para capturar frame do vídeo)
  const canvasRef = useRef(null);
  
  // Referência para o <input type="file"> oculto
  const fileInputRef = useRef(null);
  
  // Referência para o stream de mídia (permite parar a câmera depois)
  const streamRef = useRef(null);

  // ========== FUNÇÕES DE CÂMERA ==========

  /**
   * Inicia a câmera do dispositivo.
   * 
   * Usa getUserMedia para acessar a câmera traseira (environment) do dispositivo.
   * Se falhar (permissão negada, câmera não disponível), abre o seletor de arquivos
   * como fallback.
   */
  const startCamera = useCallback(async () => {
    try {
      // Solicita acesso à câmera com configurações otimizadas
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment", // Prefere câmera traseira (melhor para fotos)
          width: { ideal: 1280 },    // Resolução ideal
          height: { ideal: 720 }
        },
        audio: false, // Não precisamos de áudio
      });

      // Conecta o stream ao elemento <video>
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error("Erro ao acessar câmera:", error);
      // Se falhar, oferece upload de arquivo como alternativa
      fileInputRef.current?.click();
    }
  }, []);

  /**
   * Para a câmera e libera os recursos.
   * 
   * É importante chamar esta função quando não precisamos mais da câmera,
   * para liberar recursos do sistema e parar de usar a câmera do usuário.
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      // Para todas as tracks (vídeo) do stream
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  /**
   * Captura uma foto do vídeo da câmera.
   * 
   * O processo funciona assim:
   * 1. Pega o frame atual do vídeo
   * 2. Desenha no canvas (elemento invisível)
   * 3. Converte o canvas para um arquivo de imagem
   * 4. Salva o arquivo e a preview
   * 5. Avança para a próxima etapa
   */
  const capturePhoto = useCallback(() => {
    // Verifica se temos os elementos necessários
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Define as dimensões do canvas iguais ao vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Desenha o frame atual do vídeo no canvas
    context.drawImage(video, 0, 0);

    // Converte o canvas para um blob (arquivo binário) de imagem
    canvas.toBlob((blob) => {
      if (blob) {
        // Cria um objeto File a partir do blob
        const file = new File([blob], `sighting-${Date.now()}.jpg`, { 
          type: "image/jpeg" 
        });
        
        // Salva o arquivo e a preview (URL base64)
        setPhotoFile(file);
        setPhotoPreview(canvas.toDataURL("image/jpeg"));
        
        // Para a câmera e avança para a próxima etapa
        stopCamera();
        setStep("location");
      }
    }, "image/jpeg", 0.8); // Qualidade 80% (bom balanço entre tamanho e qualidade)
  }, [stopCamera]);

  /**
   * Processa o upload de um arquivo de imagem da galeria.
   * 
   * Alternativa para quando a câmera não está disponível ou
   * o usuário prefere enviar uma foto já existente.
   */
  const handleFileUpload = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Valida se é realmente uma imagem
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione uma imagem válida.");
      return;
    }

    // Lê o arquivo e cria uma preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result);
      setPhotoFile(file);
      setStep("location"); // Avança para a próxima etapa
    };
    reader.readAsDataURL(file);
  }, []);

  // ========== FUNÇÕES DE GEOLOCALIZAÇÃO ==========

  /**
   * Obtém a localização atual do usuário via GPS.
   * 
   * Esta função:
   * 1. Solicita permissão de localização ao navegador
   * 2. Obtém as coordenadas (latitude/longitude)
   * 3. Tenta obter o endereço aproximado via geocodificação reversa
   * 
   * A geocodificação reversa usa a API gratuita do OpenStreetMap (Nominatim).
   */
  const getLocation = useCallback(async () => {
    // Atualiza status para "carregando"
    setLocation(prev => ({ ...prev, status: "loading" }));

    // Verifica se o navegador suporta geolocalização
    if (!navigator.geolocation) {
      setLocation({
        status: "error",
        coords: null,
        address: null,
        error: "Geolocalização não suportada neste navegador.",
      });
      return;
    }

    // Solicita a posição ao navegador
    navigator.geolocation.getCurrentPosition(
      // Callback de SUCESSO
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // Tenta obter o endereço a partir das coordenadas
        let address = null;
        try {
          // Usa a API do Nominatim (OpenStreetMap) - gratuita e sem API key
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
          );
          const data = await response.json();
          address = data.display_name || null;
        } catch (error) {
          // Se falhar a geocodificação, não é crítico - temos as coordenadas
          console.warn("Erro ao obter endereço:", error);
        }

        // Salva os dados de localização
        setLocation({
          status: "success",
          coords,
          address,
          error: null,
        });
      },
      // Callback de ERRO
      (error) => {
        // Mensagens de erro amigáveis para cada tipo de problema
        let errorMessage = "Erro ao obter localização.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Permissão de localização negada. Por favor, permita o acesso à localização nas configurações do navegador.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Localização indisponível. Verifique se o GPS está ativado.";
            break;
          case error.TIMEOUT:
            errorMessage = "Tempo esgotado ao obter localização. Tente novamente.";
            break;
        }

        setLocation({
          status: "error",
          coords: null,
          address: null,
          error: errorMessage,
        });
      },
      // Opções de configuração do GPS
      {
        enableHighAccuracy: true, // Solicita a melhor precisão possível
        timeout: 10000,           // Timeout de 10 segundos
        maximumAge: 60000,        // Aceita posição em cache de até 1 minuto
      }
    );
  }, []);

  // ========== FUNÇÕES DE ENVIO ==========

  /**
   * Envia o avistamento para o backend.
   * 
   * Coleta todos os dados (foto, localização, descrição, timestamp) e
   * chama a função onSubmit passada via props.
   */
  const handleSubmit = useCallback(async () => {
    // Validação: precisa ter foto e localização
    if (!photoFile || !location.coords) return;

    setIsSubmitting(true);

    try {
      // Monta o objeto com todos os dados do avistamento
      const sightingData = {
        petId: petInfo.id,
        photo: photoFile,
        photoPreview,
        location: {
          lat: location.coords.lat,
          lng: location.coords.lng,
          address: location.address || undefined,
        },
        description,
        timestamp: new Date(),
      };

      // Envia para o backend
      await onSubmit(sightingData);
      
      // Reseta o formulário e fecha o modal
      resetForm();
      onClose();
    } catch (error) {
      console.error("Erro ao enviar avistamento:", error);
      alert("Erro ao enviar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }, [photoFile, photoPreview, location, description, petInfo.id, onSubmit, onClose]);

  /**
   * Reseta todos os estados do formulário para os valores iniciais.
   */
  const resetForm = useCallback(() => {
    setStep("photo");
    setPhotoPreview(null);
    setPhotoFile(null);
    setDescription("");
    setLocation({ status: "idle", coords: null, address: null, error: null });
    stopCamera();
  }, [stopCamera]);

  // ========== EFEITOS ==========

  /**
   * Busca localização automaticamente quando chega na etapa de localização.
   * Isso economiza um clique do usuário.
   */
  useEffect(() => {
    if (step === "location" && location.status === "idle") {
      getLocation();
    }
  }, [step, location.status, getLocation]);

  /**
   * Para a câmera quando o modal é fechado.
   * Importante para liberar recursos do sistema.
   */
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
    }
  }, [isOpen, stopCamera]);

  // Se o modal não está aberto, não renderiza nada
  if (!isOpen) return null;

  // ========== RENDERIZAÇÃO ==========

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* ========== BACKDROP (fundo escuro) ========== */}
      {/* Clicável para fechar o modal */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ========== MODAL PRINCIPAL ========== */}
      <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
        
        {/* ========== HEADER DO MODAL ========== */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            {/* Ícone */}
            <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <span className="text-xl">👁️</span>
            </div>
            {/* Título e info do pet */}
            <div>
              <h2 className="font-bold text-white">Reportar Avistamento</h2>
              <p className="text-sm text-gray-400">
                Pet: <span className="text-cyan-400">{petInfo.name}</span>
              </p>
            </div>
          </div>
          
          {/* Botão de fechar */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* ========== INDICADOR DE PROGRESSO ========== */}
        {/* Mostra em qual das 3 etapas o usuário está */}
        <div className="flex items-center px-4 py-3 bg-slate-800/50 gap-2">
          {["photo", "location", "confirm"].map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              {/* Círculo numerado */}
              <div className={`
                w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                ${step === s 
                  ? 'bg-cyan-500 text-white'           // Etapa atual
                  : i < ["photo", "location", "confirm"].indexOf(step)
                    ? 'bg-green-500 text-white'        // Etapa completa
                    : 'bg-slate-700 text-gray-400'}    // Etapa futura
              `}>
                {/* Se já passou desta etapa, mostra check. Senão, mostra número */}
                {i < ["photo", "location", "confirm"].indexOf(step) ? "✓" : i + 1}
              </div>
              {/* Linha conectora entre etapas */}
              {i < 2 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  i < ["photo", "location", "confirm"].indexOf(step)
                    ? 'bg-green-500'   // Linha verde se etapa completa
                    : 'bg-slate-700'   // Linha cinza se não
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* ========== CONTEÚDO (varia por etapa) ========== */}
        <div className="p-4">
          
          {/* ==================== ETAPA 1: FOTO ==================== */}
          {step === "photo" && (
            <div className="space-y-4">
              <p className="text-gray-400 text-center">
                Tire uma foto do pet que você viu ou selecione da galeria
              </p>

              {/* Área de preview da câmera / placeholder */}
              <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden">
                {cameraActive ? (
                  // Se a câmera está ativa, mostra o vídeo
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay com marcações de enquadramento */}
                    <div className="absolute inset-4 border-2 border-white/30 rounded-lg pointer-events-none">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 rounded-tl" />
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-cyan-400 rounded-tr" />
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-cyan-400 rounded-bl" />
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-cyan-400 rounded-br" />
                    </div>
                  </>
                ) : (
                  // Se não, mostra placeholder
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                    <span className="text-5xl mb-2">📷</span>
                    <p>Câmera não ativada</p>
                  </div>
                )}
              </div>

              {/* Canvas oculto (usado para capturar frame do vídeo) */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Botões de ação */}
              <div className="grid grid-cols-2 gap-3">
                {cameraActive ? (
                  // Se câmera ativa: botões para cancelar ou capturar
                  <>
                    <button
                      onClick={stopCamera}
                      className="py-3 rounded-xl font-medium text-gray-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={capturePhoto}
                      className="py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
                    >
                      📸 Capturar
                    </button>
                  </>
                ) : (
                  // Se câmera não ativa: botões para abrir câmera ou galeria
                  <>
                    <button
                      onClick={startCamera}
                      className="py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 transition-all flex items-center justify-center gap-2"
                    >
                      📷 Abrir Câmera
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="py-3 rounded-xl font-medium text-gray-300 bg-slate-800 hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                    >
                      🖼️ Da Galeria
                    </button>
                  </>
                )}
              </div>

              {/* Input de arquivo oculto (para upload da galeria) */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* ==================== ETAPA 2: LOCALIZAÇÃO ==================== */}
          {step === "location" && (
            <div className="space-y-4">
              {/* Preview da foto capturada */}
              {photoPreview && (
                <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden">
                  <img
                    src={photoPreview}
                    alt="Foto capturada"
                    className="w-full h-full object-cover"
                  />
                  {/* Botão para refazer a foto */}
                  <button
                    onClick={() => {
                      setPhotoPreview(null);
                      setPhotoFile(null);
                      setStep("photo");
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                  >
                    ↺
                  </button>
                  {/* Badge de confirmação */}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-500/80 rounded text-xs text-white font-medium">
                    ✓ Foto capturada
                  </div>
                </div>
              )}

              {/* Status da localização */}
              <div className={`
                p-4 rounded-xl border
                ${location.status === "success" 
                  ? 'bg-green-500/10 border-green-500/30'
                  : location.status === "error"
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-slate-800/50 border-slate-700'}
              `}>
                <div className="flex items-center gap-3">
                  {/* Estado: Carregando */}
                  {location.status === "loading" && (
                    <>
                      <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <div>
                        <p className="text-white font-medium">Obtendo localização...</p>
                        <p className="text-sm text-gray-400">Isso pode levar alguns segundos</p>
                      </div>
                    </>
                  )}

                  {/* Estado: Sucesso */}
                  {location.status === "success" && (
                    <>
                      <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xl">📍</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-green-400 font-medium">Localização obtida!</p>
                        <p className="text-sm text-gray-400 line-clamp-1">
                          {/* Mostra endereço se disponível, senão mostra coordenadas */}
                          {location.address || `${location.coords?.lat.toFixed(6)}, ${location.coords?.lng.toFixed(6)}`}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Estado: Erro */}
                  {location.status === "error" && (
                    <>
                      <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                        <span className="text-xl">⚠️</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-red-400 font-medium">{location.error}</p>
                        <button
                          onClick={getLocation}
                          className="text-sm text-cyan-400 hover:underline"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Campo de descrição/observações */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Observações (opcional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Vi o pet perto do parque, parecia assustado..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-500 focus:border-cyan-500 outline-none resize-none transition-colors"
                />
              </div>

              {/* Botões de navegação */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStep("photo")}
                  className="py-3 rounded-xl font-medium text-gray-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  disabled={location.status !== "success"}
                  className="py-3 rounded-xl font-bold text-white bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {/* ==================== ETAPA 3: CONFIRMAÇÃO ==================== */}
          {step === "confirm" && (
            <div className="space-y-4">
              {/* Mensagem de confirmação */}
              <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-center">
                <span className="text-4xl block mb-2">🎯</span>
                <h3 className="text-white font-bold text-lg">Pronto para enviar!</h3>
                <p className="text-gray-400 text-sm">
                  Sua contribuição pode ajudar a reunir {petInfo.name} com sua família
                </p>
              </div>

              {/* Resumo dos dados */}
              <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
                {/* Preview da foto */}
                <div className="flex items-center gap-3">
                  {photoPreview && (
                    <img src={photoPreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium">Foto capturada</p>
                    <p className="text-xs text-gray-400">
                      {new Date().toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                {/* Localização */}
                <div className="flex items-start gap-2 text-sm">
                  <span className="text-red-400">📍</span>
                  <p className="text-gray-400 flex-1">
                    {location.address || `${location.coords?.lat.toFixed(4)}, ${location.coords?.lng.toFixed(4)}`}
                  </p>
                </div>

                {/* Descrição (se houver) */}
                {description && (
                  <div className="flex items-start gap-2 text-sm">
                    <span className="text-yellow-400">💬</span>
                    <p className="text-gray-400 flex-1">{description}</p>
                  </div>
                )}
              </div>

              {/* Botões finais */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStep("location")}
                  disabled={isSubmitting}
                  className="py-3 rounded-xl font-medium text-gray-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="py-3 rounded-xl font-bold text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      ✓ Enviar Avistamento
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
