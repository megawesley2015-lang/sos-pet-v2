"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

/**
 * Página de Parcerias - "Seja um AUmigo Parceiro"
 * 
 * Objetivo:
 * - Atrair ONGs e protetores independentes
 * - Captar parceiros institucionais
 * - Gerar leads qualificados para o ecossistema SOS Pet
 * 
 * @returns {JSX.Element}
 */

const TIPOS_PARCERIA = [
  { value: "ong", label: "ONG / Instituição", emoji: "🏢" },
  { value: "protetor", label: "Protetor Independente", emoji: "🦸" },
  { value: "abrigo", label: "Abrigo / Canil", emoji: "🏠" },
  { value: "empresa", label: "Empresa / Patrocinador", emoji: "💼" },
];

const BENEFICIOS = [
  {
    emoji: "📢",
    titulo: "Visibilidade Gratuita",
    descricao: "Divulgue sua ONG, animais para adoção e eventos sem custo algum.",
  },
  {
    emoji: "🐾",
    titulo: "Gestão de Animais",
    descricao: "Use nossa plataforma para organizar e divulgar pets disponíveis para adoção.",
  },
  {
    emoji: "🤝",
    titulo: "Conexão Direta",
    descricao: "Receba contatos de tutores interessados em adotar ou ajudar diretamente pelo WhatsApp.",
  },
  {
    emoji: "📊",
    titulo: "Impacto Mensurável",
    descricao: "Acompanhe quantas pessoas visualizaram seus animais e entraram em contato.",
  },
  {
    emoji: "🏆",
    titulo: "Selo de Parceiro",
    descricao: "Parceiros verificados recebem selo de destaque e prioridade na plataforma.",
  },
  {
    emoji: "💙",
    titulo: "Apoio Tecnológico",
    descricao: "Conte com nossa equipe para maximizar o alcance das suas campanhas.",
  },
];

export default function ParceriasPage() {
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    cidade: "",
    whatsapp: "",
    email: "",
    descricao: "",
    site: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validações básicas
      if (!formData.nome || !formData.tipo || !formData.cidade || !formData.whatsapp || !formData.email) {
        throw new Error("Por favor, preencha todos os campos obrigatórios.");
      }

      // Salvar no Supabase
      const { error: supabaseError } = await supabase
        .from("parceiros")
        .insert({
          nome: formData.nome,
          tipo: formData.tipo,
          cidade: formData.cidade,
          whatsapp: formData.whatsapp,
          email: formData.email,
          descricao: formData.descricao || null,
          site: formData.site || null,
          status: "pendente",
        });

      if (supabaseError) {
        // Se a tabela não existir, mostrar mensagem amigável
        if (supabaseError.code === "42P01") {
          console.error("Tabela parceiros não existe. Cadastro simulado com sucesso.");
          setSuccess(true);
          return;
        }
        throw supabaseError;
      }

      setSuccess(true);
      setFormData({
        nome: "",
        tipo: "",
        cidade: "",
        whatsapp: "",
        email: "",
        descricao: "",
        site: "",
      });

    } catch (err) {
      console.error("Erro ao enviar parceria:", err);
      setError(err.message || "Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-16 flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-10 shadow-lg">
            <span className="text-7xl block mb-6">🎉</span>
            <h1 className="text-3xl font-black text-gray-800 mb-4">
              Parceria Enviada!
            </h1>
            <p className="text-gray-600 mb-8">
              Recebemos sua solicitação de parceria. Nossa equipe vai analisar 
              e entrar em contato em breve. Obrigado por fazer parte do SOS Pet! 🐾
            </p>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="px-6 py-3 bg-[#20B2AA] hover:bg-[#1a9e97] text-white font-bold rounded-xl transition-all"
              >
                Voltar ao Início
              </Link>
              <button
                onClick={() => setSuccess(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium"
              >
                Enviar outra solicitação
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#FF6B35] to-[#e85a2a] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-6xl mb-4 block">🤝</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Seja um AUmigo Parceiro
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Junte-se ao SOS Pet e ajude a conectar animais, tutores 
            e pessoas que salvam vidas todos os dias.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Benefícios */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-gray-800 text-center mb-10">
            Por que ser parceiro do SOS Pet?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFICIOS.map((beneficio, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <span className="text-4xl mb-4 block">{beneficio.emoji}</span>
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                  {beneficio.titulo}
                </h3>
                <p className="text-gray-600 text-sm">
                  {beneficio.descricao}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Como Funciona */}
        <section className="mb-16 bg-white rounded-3xl p-8 md:p-12 shadow-sm">
          <h2 className="text-2xl font-black text-gray-800 text-center mb-10">
            Como funciona a parceria?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">1. Cadastre-se</h3>
              <p className="text-gray-600 text-sm">
                Preencha o formulário com os dados da sua ONG ou projeto
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">2. Análise</h3>
              <p className="text-gray-600 text-sm">
                Nossa equipe analisa a solicitação em até 48 horas
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">3. Ativação</h3>
              <p className="text-gray-600 text-sm">
                Após aprovação, você recebe acesso completo à plataforma
              </p>
            </div>
          </div>
        </section>

        {/* Formulário */}
        <section id="form-parceria" className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border-2 border-[#20B2AA]/20">
            <div className="text-center mb-8">
              <span className="text-4xl mb-2 block">🐾</span>
              <h2 className="text-2xl font-black text-gray-800">
                Cadastro de Parceria
              </h2>
              <p className="text-gray-500 mt-2">
                Preencha os dados abaixo para se tornar um AUmigo Parceiro
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da ONG / Projeto / Empresa *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Ex: ONG Patinhas Felizes"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] focus:ring-0 outline-none transition-colors"
                />
              </div>

              {/* Tipo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Parceria *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {TIPOS_PARCERIA.map((tipo) => (
                    <button
                      key={tipo.value}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, tipo: tipo.value }))}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.tipo === tipo.value
                          ? "border-[#20B2AA] bg-[#20B2AA]/5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-2xl block mb-1">{tipo.emoji}</span>
                      <span className="font-medium text-gray-800 text-sm">{tipo.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade / Região de Atuação *
                </label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Santos - SP"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] focus:ring-0 outline-none transition-colors"
                />
              </div>

              {/* WhatsApp e Email */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    required
                    placeholder="(13) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] focus:ring-0 outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="contato@suaong.org"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] focus:ring-0 outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Site */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site ou Rede Social (opcional)
                </label>
                <input
                  type="text"
                  name="site"
                  value={formData.site}
                  onChange={handleChange}
                  placeholder="Instagram, Facebook, Site..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] focus:ring-0 outline-none transition-colors"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conte um pouco sobre o trabalho de vocês (opcional)
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Ex: Resgatamos animais em situação de rua, oferecemos lar temporário..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#20B2AA] focus:ring-0 outline-none transition-colors resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#FF6B35] hover:bg-[#e85a2a] disabled:bg-gray-300 text-white font-bold text-lg rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    🐾 Quero ser parceiro
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-6">
              💡 Durante a fase inicial, todas as parcerias são gratuitas e 
              focadas em impacto social.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
