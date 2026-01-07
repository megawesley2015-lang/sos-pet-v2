"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPet, uploadPetImage } from "@/services/pets.service";

export default function CadastrarPet() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    status: "perdido",
    nome: "",
    especie: "cao",
    raca: "",
    cor: "",
    porte: "medio",
    sexo: "",
    idade_aproximada: "",
    descricao: "",
    comportamento: "",
    localizacao: "",
    data_ocorrencia: new Date().toISOString().split("T")[0],
    contato_nome: "",
    contato_telefone: "",
    contato_whatsapp: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imagem_url = null;

      // Upload da imagem se existir
      if (imageFile) {
        imagem_url = await uploadPetImage(imageFile);
      }

      // Criar pet
      await createPet({
        ...formData,
        imagem_url,
      });

      // Redirecionar para lista
      router.push("/achados-e-perdidos?success=true");
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      setError("Erro ao cadastrar o pet. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Voltar */}
        <Link
          href="/achados-e-perdidos"
          className="inline-flex items-center text-gray-600 hover:text-[#20B2AA] font-medium mb-8"
        >
          ← Voltar para a lista
        </Link>

        <div className="bg-white rounded-3xl p-8 shadow-lg">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Cadastrar Animal
          </h1>
          <p className="text-gray-500 mb-8">
            Preencha as informações abaixo para cadastrar um pet perdido,
            encontrado ou para adoção.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Status */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Tipo de Cadastro *
              </label>
              <div className="flex flex-wrap gap-3">
                {[
                  { value: "perdido", label: "🔴 Perdido", color: "red" },
                  { value: "encontrado", label: "🟢 Encontrado", color: "green" },
                  { value: "adocao", label: "💙 Para Adoção", color: "blue" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, status: option.value }))}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      formData.status === option.value
                        ? `bg-${option.color}-100 text-${option.color}-600 border-2 border-${option.color}-300`
                        : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                Foto do Pet
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#20B2AA] transition-all">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full font-bold"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer">
                    <span className="text-4xl block mb-2">📷</span>
                    <span className="text-gray-500">Clique para adicionar uma foto</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Informações do Pet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nome do Pet
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Ex: Rex, Miau..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Espécie *
                </label>
                <select
                  name="especie"
                  value={formData.especie}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                >
                  <option value="cao">Cão</option>
                  <option value="gato">Gato</option>
                  <option value="ave">Ave</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Raça
                </label>
                <input
                  type="text"
                  name="raca"
                  value={formData.raca}
                  onChange={handleChange}
                  placeholder="Ex: Poodle, Siamês..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Cor Predominante *
                </label>
                <input
                  type="text"
                  name="cor"
                  value={formData.cor}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Branco, Caramelo..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Porte *
                </label>
                <select
                  name="porte"
                  value={formData.porte}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                >
                  <option value="pequeno">Pequeno</option>
                  <option value="medio">Médio</option>
                  <option value="grande">Grande</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Sexo
                </label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                >
                  <option value="">Não sei</option>
                  <option value="macho">Macho</option>
                  <option value="femea">Fêmea</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Idade Aproximada
                </label>
                <input
                  type="text"
                  name="idade_aproximada"
                  value={formData.idade_aproximada}
                  onChange={handleChange}
                  placeholder="Ex: 2 anos, Filhote..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Comportamento
                </label>
                <select
                  name="comportamento"
                  value={formData.comportamento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                >
                  <option value="">Selecione...</option>
                  <option value="docil">Dócil</option>
                  <option value="arisco">Arisco</option>
                  <option value="brincalhao">Brincalhão</option>
                  <option value="calmo">Calmo</option>
                  <option value="machucado">Machucado</option>
                </select>
              </div>
            </div>

            {/* Localização e Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Localização (Bairro/Cidade) *
                </label>
                <input
                  type="text"
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Pitangueiras, Guarujá"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
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

            {/* Descrição */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                placeholder="Descreva características importantes, onde foi visto pela última vez, se usa coleira, etc..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none resize-none"
              />
            </div>

            {/* Contato */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Informações de Contato
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    name="contato_nome"
                    value={formData.contato_nome}
                    onChange={handleChange}
                    required
                    placeholder="Nome completo"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Telefone/WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="contato_telefone"
                    value={formData.contato_telefone}
                    onChange={handleChange}
                    required
                    placeholder="(13) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="contato_whatsapp"
                    checked={formData.contato_whatsapp}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-gray-300 text-[#20B2AA] focus:ring-[#20B2AA]"
                  />
                  <span className="text-gray-700">
                    Este número tem WhatsApp
                  </span>
                </label>
              </div>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B35] hover:bg-[#e85a2a] disabled:bg-gray-300 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Cadastrando...
                </span>
              ) : (
                "Cadastrar Animal"
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
