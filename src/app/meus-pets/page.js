"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { getPetById, updatePet, uploadPetImage } from "@/services/pets.service";

const ESPECIES = [
  { value: "cao", label: "Cão 🐕" },
  { value: "gato", label: "Gato 🐈" },
  { value: "ave", label: "Ave 🐦" },
  { value: "outro", label: "Outro 🐾" },
];

const PORTES = [
  { value: "pequeno", label: "Pequeno" },
  { value: "medio", label: "Médio" },
  { value: "grande", label: "Grande" },
];

const SEXOS = [
  { value: "macho", label: "Macho" },
  { value: "femea", label: "Fêmea" },
  { value: "indefinido", label: "Não sei" },
];

const STATUS_OPTIONS = [
  { value: "perdido", label: "🔴 Perdido", color: "bg-red-100 text-red-700" },
  { value: "encontrado", label: "🟢 Encontrado", color: "bg-green-100 text-green-700" },
  { value: "adocao", label: "🔵 Para Adoção", color: "bg-blue-100 text-blue-700" },
];

export default function EditarPetPage() {
  const params = useParams();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  
  const [imagePreview, setImagePreview] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: "",
    especie: "cao",
    raca: "",
    cor: "",
    porte: "medio",
    sexo: "indefinido",
    idade_aproximada: "",
    descricao: "",
    comportamento: "",
    status: "perdido",
    localizacao: "",
    data_ocorrencia: "",
    contato_nome: "",
    contato_telefone: "",
    contato_whatsapp: true,
  });

  // Carregar dados do pet
  useEffect(() => {
    async function loadPet() {
      try {
        setLoading(true);
        
        // Verificar autenticação
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push(`/login?redirect=/achados-e-perdidos/editar/${params.id}`);
          return;
        }

        // Buscar pet
        const pet = await getPetById(params.id);
        
        if (!pet) {
          setError("Pet não encontrado");
          return;
        }

        // Verificar se o usuário é o dono
        if (pet.user_id !== session.user.id) {
          setUnauthorized(true);
          return;
        }

        // Preencher formulário
        setFormData({
          nome: pet.nome || "",
          especie: pet.especie || "cao",
          raca: pet.raca || "",
          cor: pet.cor || "",
          porte: pet.porte || "medio",
          sexo: pet.sexo || "indefinido",
          idade_aproximada: pet.idade_aproximada || "",
          descricao: pet.descricao || "",
          comportamento: pet.comportamento || "",
          status: pet.status || "perdido",
          localizacao: pet.localizacao || "",
          data_ocorrencia: pet.data_ocorrencia ? pet.data_ocorrencia.split('T')[0] : "",
          contato_nome: pet.contato_nome || "",
          contato_telefone: pet.contato_telefone || "",
          contato_whatsapp: pet.contato_whatsapp ?? true,
        });

        if (pet.imagem_url) {
          setImagePreview(pet.imagem_url);
        }

      } catch (err) {
        console.error("Erro ao carregar pet:", err);
        setError("Erro ao carregar dados do pet");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadPet();
    }
  }, [params.id, router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("A imagem deve ter no máximo 5MB");
        return;
      }

      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      let imagemUrl = imagePreview;

      // Upload nova imagem se selecionada
      if (newImageFile) {
        const uploadedUrl = await uploadPetImage(newImageFile);
        if (uploadedUrl) {
          imagemUrl = uploadedUrl;
        }
      }

      // Atualizar pet
      await updatePet(params.id, {
        ...formData,
        imagem_url: imagemUrl,
      });

      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push(`/achados-e-perdidos/${params.id}`);
      }, 2000);

    } catch (err) {
      console.error("Erro ao atualizar:", err);
      setError("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Carregando...</p>
        </div>
      </main>
    );
  }

  // Não autorizado
  if (unauthorized) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 text-center py-20">
          <span className="text-6xl block mb-4">🚫</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Acesso negado</h1>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para editar este registro.
          </p>
          <Link
            href="/meus-pets"
            className="inline-block bg-[#20B2AA] text-white px-6 py-3 rounded-xl font-bold"
          >
            Ver Meus Pets
          </Link>
        </div>
      </main>
    );
  }

  // Erro
  if (error && !formData.nome) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 text-center py-20">
          <span className="text-6xl block mb-4">😿</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{error}</h1>
          <Link
            href="/achados-e-perdidos"
            className="inline-block bg-[#20B2AA] text-white px-6 py-3 rounded-xl font-bold"
          >
            Voltar para lista
          </Link>
        </div>
      </main>
    );
  }

  // Sucesso
  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto px-4 text-center py-20">
          <span className="text-6xl block mb-4">✅</span>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Alterações salvas!
          </h1>
          <p className="text-gray-600 mb-6">
            Redirecionando...
          </p>
          <div className="inline-block w-8 h-8 border-4 border-[#20B2AA] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/achados-e-perdidos/${params.id}`}
            className="inline-flex items-center text-gray-600 hover:text-[#20B2AA] font-medium mb-4"
          >
            ← Voltar
          </Link>
          <h1 className="text-3xl font-black text-gray-900">Editar Registro</h1>
          <p className="text-gray-500 mt-2">Atualize as informações do pet</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Erro */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Status do Registro</h2>
            <div className="flex flex-wrap gap-3">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, status: option.value }))}
                  className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${
                    formData.status === option.value
                      ? option.color + " ring-2 ring-offset-2 ring-gray-400"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Foto */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Foto do Pet</h2>
            
            <div className="flex items-center gap-6">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setNewImageFile(null);
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center">
                  <span className="text-4xl">📷</span>
                </div>
              )}

              <div className="flex-1">
                <label className="block">
                  <span className="bg-[#20B2AA] hover:bg-[#1a9e97] text-white px-4 py-2 rounded-lg font-bold cursor-pointer inline-block transition-all">
                    {imagePreview ? "Trocar foto" : "Adicionar foto"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  JPG, PNG até 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Dados do Pet */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Dados do Pet</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Pet
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Rex, Mimi..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Espécie *
                </label>
                <select
                  name="especie"
                  value={formData.especie}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                >
                  {ESPECIES.map((e) => (
                    <option key={e.value} value={e.value}>{e.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raça
                </label>
                <input
                  type="text"
                  name="raca"
                  value={formData.raca}
                  onChange={handleChange}
                  placeholder="Ex: Labrador, Siamês..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <input
                  type="text"
                  name="cor"
                  value={formData.cor}
                  onChange={handleChange}
                  placeholder="Ex: Caramelo, Preto e branco..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Porte
                </label>
                <select
                  name="porte"
                  value={formData.porte}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                >
                  {PORTES.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexo
                </label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                >
                  {SEXOS.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Idade aproximada
                </label>
                <input
                  type="text"
                  name="idade_aproximada"
                  value={formData.idade_aproximada}
                  onChange={handleChange}
                  placeholder="Ex: 2 anos, 6 meses..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comportamento
                </label>
                <input
                  type="text"
                  name="comportamento"
                  value={formData.comportamento}
                  onChange={handleChange}
                  placeholder="Ex: Dócil, Arisco, Brincalhão..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Características marcantes, coleira, comportamento..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Localização */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Localização e Data</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Local *
                </label>
                <input
                  type="text"
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Centro, Guarujá - SP"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  name="data_ocorrencia"
                  value={formData.data_ocorrencia}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Contato</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seu nome *
                </label>
                <input
                  type="text"
                  name="contato_nome"
                  value={formData.contato_nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone *
                </label>
                <input
                  type="tel"
                  name="contato_telefone"
                  value={formData.contato_telefone}
                  onChange={handleChange}
                  required
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="contato_whatsapp"
                    checked={formData.contato_whatsapp}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-[#20B2AA]"
                  />
                  <span className="text-gray-700">Este número tem WhatsApp</span>
                </label>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4">
            <Link
              href={`/achados-e-perdidos/${params.id}`}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold text-center transition-all"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#20B2AA] hover:bg-[#1a9e97] disabled:bg-gray-300 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Salvando...
                </>
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
