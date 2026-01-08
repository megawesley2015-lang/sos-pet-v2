"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const CATEGORIAS = [
  { value: "Veterinário", label: "Veterinário", emoji: "🏥" },
  { value: "Pet Shop", label: "Pet Shop", emoji: "🛍️" },
  { value: "Hotel", label: "Hotel Pet", emoji: "🏨" },
  { value: "Banho e Tosa", label: "Banho e Tosa", emoji: "✂️" },
  { value: "Adestramento", label: "Adestramento", emoji: "🎓" },
  { value: "Passeador", label: "Passeador", emoji: "🦮" },
  { value: "Creche", label: "Creche", emoji: "🏠" },
];

export default function CadastroPrestador() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    // Dados básicos
    Nome: "",
    categoria: "",
    especialidades: "",
    biografia: "",
    
    // Contato
    Email: "",
    telefone: "",
    WhatsApp: "",
    Site: "",
    Instagram: "",
    
    // Endereço
    CEP: "",
    Endereco: "",
    
    // Serviços
    Servicos: "",
    Horarios: "",
    emergencia_24h: false,
    aceita_plano: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const buscarCEP = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            Endereco: `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`,
          }));
        }
      } catch (err) {
        console.error("Erro ao buscar CEP:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Gerar slug único
      const slug = formData.Nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Inserir na tabela de cadastros pendentes
      const { error: insertError } = await supabase
        .from("cadastros_pendentes")
        .insert([{
          Nome: formData.Nome,
          Email: formData.Email,
          telefone: formData.telefone,
          WhatsApp: formData.WhatsApp,
          categoria: formData.categoria,
          CEP: formData.CEP,
          endereco_completo: formData.Endereco,
          biografia: formData.biografia,
          Site: formData.Site,
          Instagram: formData.Instagram,
          Status: "pendente",
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err) {
      console.error("Erro ao cadastrar:", err);
      setError("Erro ao enviar cadastro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <span className="text-6xl block mb-4">🎉</span>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Cadastro enviado com sucesso!
            </h1>
            <p className="text-gray-600 mb-6">
              Recebemos seus dados e entraremos em contato em breve para validar
              seu perfil. Você receberá um email em <strong>{formData.Email}</strong>.
            </p>
            <Link
              href="/"
              className="inline-block bg-[#20B2AA] hover:bg-[#1a9e97] text-white px-8 py-3 rounded-xl font-bold transition-all"
            >
              Voltar para o início
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-4xl">🐾</span>
            <span className="text-3xl font-black text-[#FF6B35]">SOS Pet</span>
          </Link>
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            Cadastre seu Negócio
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Conecte-se com milhares de tutores que buscam serviços de qualidade
            para seus pets
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= s
                      ? "bg-[#20B2AA] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 ${
                      step > s ? "bg-[#20B2AA]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Dados Básicos */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  📋 Dados do Negócio
                </h2>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Nome do Negócio *
                  </label>
                  <input
                    type="text"
                    name="Nome"
                    value={formData.Nome}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Clínica Veterinária Pet Feliz"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Categoria *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {CATEGORIAS.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, categoria: cat.value }))
                        }
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          formData.categoria === cat.value
                            ? "border-[#20B2AA] bg-[#20B2AA]/10"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{cat.emoji}</span>
                        <span className="font-medium text-sm">{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Especialidades
                  </label>
                  <input
                    type="text"
                    name="especialidades"
                    value={formData.especialidades}
                    onChange={handleChange}
                    placeholder="Ex: Cirurgia, Dermatologia, Cardiologia"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Sobre o Negócio
                  </label>
                  <textarea
                    name="biografia"
                    value={formData.biografia}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Conte um pouco sobre seu negócio, sua história e diferenciais..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none resize-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.Nome || !formData.categoria}
                  className="w-full bg-[#20B2AA] hover:bg-[#1a9e97] disabled:bg-gray-300 text-white py-4 rounded-xl font-bold transition-all"
                >
                  Continuar →
                </button>
              </div>
            )}

            {/* Step 2: Contato */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  📞 Informações de Contato
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                      required
                      placeholder="contato@seunegocio.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      name="telefone"
                      value={formData.telefone}
                      onChange={handleChange}
                      required
                      placeholder="(13) 3333-3333"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      WhatsApp
                    </label>
                    <input
                      type="tel"
                      name="WhatsApp"
                      value={formData.WhatsApp}
                      onChange={handleChange}
                      placeholder="(13) 99999-9999"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Instagram
                    </label>
                    <input
                      type="text"
                      name="Instagram"
                      value={formData.Instagram}
                      onChange={handleChange}
                      placeholder="@seunegocio"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Site
                    </label>
                    <input
                      type="url"
                      name="Site"
                      value={formData.Site}
                      onChange={handleChange}
                      placeholder="https://www.seunegocio.com.br"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold transition-all"
                  >
                    ← Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={!formData.Email || !formData.telefone}
                    className="flex-1 bg-[#20B2AA] hover:bg-[#1a9e97] disabled:bg-gray-300 text-white py-4 rounded-xl font-bold transition-all"
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Endereço e Serviços */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  📍 Localização e Serviços
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      CEP *
                    </label>
                    <input
                      type="text"
                      name="CEP"
                      value={formData.CEP}
                      onChange={(e) => {
                        handleChange(e);
                        buscarCEP(e.target.value);
                      }}
                      required
                      placeholder="00000-000"
                      maxLength={9}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Endereço Completo *
                    </label>
                    <input
                      type="text"
                      name="Endereco"
                      value={formData.Endereco}
                      onChange={handleChange}
                      required
                      placeholder="Rua, número, bairro, cidade - UF"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Serviços Oferecidos
                  </label>
                  <textarea
                    name="Servicos"
                    value={formData.Servicos}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Liste os principais serviços que você oferece..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Horário de Funcionamento
                  </label>
                  <input
                    type="text"
                    name="Horarios"
                    value={formData.Horarios}
                    onChange={handleChange}
                    placeholder="Ex: Seg a Sex: 8h às 18h | Sáb: 8h às 12h"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] outline-none"
                  />
                </div>

                <div className="flex flex-wrap gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="emergencia_24h"
                      checked={formData.emergencia_24h}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-[#20B2AA]"
                    />
                    <span className="text-gray-700 font-medium">
                      ⚡ Atendimento 24 horas
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="aceita_plano"
                      checked={formData.aceita_plano}
                      onChange={handleChange}
                      className="w-5 h-5 rounded border-gray-300 text-[#20B2AA]"
                    />
                    <span className="text-gray-700 font-medium">
                      💳 Aceita plano de saúde pet
                    </span>
                  </label>
                </div>

                <div className="border-t pt-6">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      className="w-5 h-5 mt-1 rounded border-gray-300 text-[#20B2AA]"
                    />
                    <span className="text-sm text-gray-600">
                      Declaro que as informações fornecidas são verdadeiras e
                      autorizo o SOS Pet a exibir meu negócio na plataforma.
                      Li e aceito os{" "}
                      <Link href="/termos" className="text-[#20B2AA] font-medium">
                        Termos de Uso
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-xl font-bold transition-all"
                  >
                    ← Voltar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#FF6B35] hover:bg-[#e85a2a] disabled:bg-gray-300 text-white py-4 rounded-xl font-bold transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Enviando...
                      </span>
                    ) : (
                      "Enviar Cadastro"
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 text-center">
            <span className="text-4xl block mb-3">🆓</span>
            <h3 className="font-bold text-gray-800 mb-2">100% Gratuito</h3>
            <p className="text-sm text-gray-500">
              Cadastre seu negócio sem nenhum custo
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <span className="text-4xl block mb-3">👀</span>
            <h3 className="font-bold text-gray-800 mb-2">Mais Visibilidade</h3>
            <p className="text-sm text-gray-500">
              Seja encontrado por milhares de tutores
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 text-center">
            <span className="text-4xl block mb-3">⭐</span>
            <h3 className="font-bold text-gray-800 mb-2">Avaliações</h3>
            <p className="text-sm text-gray-500">
              Receba feedback e construa reputação
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
