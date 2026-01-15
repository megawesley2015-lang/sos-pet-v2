"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const TIPOS_PARCERIA = [
  { value: "ong", label: "ONG / Instituicao", emoji: "🏢" },
  { value: "protetor", label: "Protetor Independente", emoji: "🦸" },
  { value: "abrigo", label: "Abrigo / Canil", emoji: "🏠" },
  { value: "empresa", label: "Empresa / Patrocinador", emoji: "💼" },
];

const BENEFICIOS = [
  { emoji: "📢", titulo: "Visibilidade Gratuita", descricao: "Divulgue sua ONG, animais para adocao e eventos sem custo algum." },
  { emoji: "🐾", titulo: "Gestao de Animais", descricao: "Use nossa plataforma para organizar e divulgar pets disponiveis para adocao." },
  { emoji: "🤝", titulo: "Conexao Direta", descricao: "Receba contatos de tutores interessados em adotar ou ajudar diretamente pelo WhatsApp." },
  { emoji: "📊", titulo: "Impacto Mensuravel", descricao: "Acompanhe quantas pessoas visualizaram seus animais e entraram em contato." },
  { emoji: "🏆", titulo: "Selo de Parceiro", descricao: "Parceiros verificados recebem selo de destaque e prioridade na plataforma." },
  { emoji: "💙", titulo: "Apoio Tecnologico", descricao: "Conte com nossa equipe para maximizar o alcance das suas campanhas." },
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
      if (!formData.nome || !formData.tipo || !formData.cidade || !formData.whatsapp || !formData.email) {
        throw new Error("Por favor, preencha todos os campos obrigatorios.");
      }

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
        if (supabaseError.code === "42P01") {
          setSuccess(true);
          return;
        }
        throw supabaseError;
      }

      setSuccess(true);
      setFormData({ nome: "", tipo: "", cidade: "", whatsapp: "", email: "", descricao: "", site: "" });
    } catch (err) {
      setError(err.message || "Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-slate-950 pt-24 pb-16 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="relative z-10 max-w-md mx-auto px-4 text-center">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-green-500/30 rounded-3xl p-10">
            <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">🎉</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-4">Parceria Enviada!</h1>
            <p className="text-gray-400 mb-8">
              Recebemos sua solicitacao de parceria. Nossa equipe vai analisar 
              e entrar em contato em breve. Obrigado por fazer parte do SOS Pet! 🐾
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-bold rounded-xl transition-all">
                Voltar ao Inicio
              </Link>
              <button onClick={() => setSuccess(false)} className="px-6 py-3 text-gray-400 hover:text-white font-medium transition-colors">
                Enviar outra solicitacao
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 pt-24 pb-16">
      <style jsx global>{`
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-glow { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% 100%; }
      `}</style>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-cyan-500/10"></div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500/20 rounded-full blur-[100px] animate-pulse-glow"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse-glow" style={{animationDelay: '1.5s'}}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="inline-block mb-6">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-500 to-cyan-500 rounded-2xl blur-xl opacity-30"></div>
              <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">🤝</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Seja um <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-cyan-400">AUmigo Parceiro</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Junte-se ao SOS Pet e ajude a conectar animais, tutores 
            e pessoas que salvam vidas todos os dias.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Beneficios */}
        <section className="mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-10">
            Por que ser parceiro do <span className="text-cyan-400">SOS Pet</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFICIOS.map((beneficio, index) => (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/30 transition-all animate-float group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">{beneficio.emoji}</span>
                </div>
                <h3 className="font-bold text-lg text-white mb-2">{beneficio.titulo}</h3>
                <p className="text-gray-400 text-sm">{beneficio.descricao}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Como Funciona */}
        <section className="mb-16">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/10 to-cyan-500/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-12">
              <h2 className="text-2xl font-black text-white text-center mb-10">
                Como funciona a parceria?
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute -inset-2 bg-orange-500/20 rounded-2xl blur-lg"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                      <span className="text-3xl">📝</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 border border-orange-500 rounded-full flex items-center justify-center text-orange-400 font-bold text-sm">1</div>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">Cadastre-se</h3>
                  <p className="text-gray-400 text-sm">Preencha o formulario com os dados da sua ONG ou projeto</p>
                </div>
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute -inset-2 bg-cyan-500/20 rounded-2xl blur-lg"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                      <span className="text-3xl">✅</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 border border-cyan-500 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm">2</div>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">Analise</h3>
                  <p className="text-gray-400 text-sm">Nossa equipe analisa a solicitacao em ate 48 horas</p>
                </div>
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <div className="absolute -inset-2 bg-green-500/20 rounded-2xl blur-lg"></div>
                    <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                      <span className="text-3xl">🚀</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-800 border border-green-500 rounded-full flex items-center justify-center text-green-400 font-bold text-sm">3</div>
                  </div>
                  <h3 className="font-bold text-lg text-white mb-2">Ativacao</h3>
                  <p className="text-gray-400 text-sm">Apos aprovacao, voce recebe acesso completo a plataforma</p>
                </div>
              </div>

              {/* Connection line */}
              <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-orange-500 via-cyan-500 to-green-500 opacity-30" style={{transform: 'translateY(20px)'}}></div>
            </div>
          </div>
        </section>

        {/* Formulario */}
        <section id="form-parceria" className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 via-cyan-500/20 to-green-500/20 rounded-3xl blur-xl"></div>
            <div className="relative bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🐾</span>
                </div>
                <h2 className="text-2xl font-black text-white">Cadastro de Parceria</h2>
                <p className="text-gray-400 mt-2">Preencha os dados abaixo para se tornar um AUmigo Parceiro</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Nome */}
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Nome da ONG / Projeto / Empresa *</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Ex: ONG Patinhas Felizes"
                    className="w-full px-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-500 outline-none text-white placeholder-gray-500 transition-all"
                  />
                </div>

                {/* Tipo */}
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Tipo de Parceria *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {TIPOS_PARCERIA.map((tipo) => (
                      <button
                        key={tipo.value}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, tipo: tipo.value }))}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          formData.tipo === tipo.value
                            ? "border-cyan-500 bg-cyan-500/10"
                            : "border-slate-700 hover:border-slate-600 bg-slate-800/50"
                        }`}
                      >
                        <span className="text-2xl block mb-1">{tipo.emoji}</span>
                        <span className={`font-medium text-sm ${formData.tipo === tipo.value ? 'text-cyan-400' : 'text-gray-300'}`}>
                          {tipo.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cidade */}
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Cidade / Regiao de Atuacao *</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    required
                    placeholder="Ex: Santos - SP"
                    className="w-full px-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-500 outline-none text-white placeholder-gray-500 transition-all"
                  />
                </div>

                {/* WhatsApp e Email */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">WhatsApp *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">📱</span>
                      <input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleChange}
                        required
                        placeholder="(13) 99999-9999"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-500 outline-none text-white placeholder-gray-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2">Email *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">✉️</span>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="contato@suaong.org"
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-500 outline-none text-white placeholder-gray-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Site */}
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Site ou Rede Social (opcional)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔗</span>
                    <input
                      type="text"
                      name="site"
                      value={formData.site}
                      onChange={handleChange}
                      placeholder="Instagram, Facebook, Site..."
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-500 outline-none text-white placeholder-gray-500 transition-all"
                    />
                  </div>
                </div>

                {/* Descricao */}
                <div>
                  <label className="block text-sm font-bold text-gray-400 mb-2">Conte um pouco sobre o trabalho de voces (opcional)</label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Ex: Resgatamos animais em situacao de rua, oferecemos lar temporario..."
                    className="w-full px-4 py-4 rounded-xl bg-slate-800 border border-slate-700 focus:border-cyan-500 outline-none text-white placeholder-gray-500 transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold text-lg rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Enviando...
                    </>
                  ) : (
                    <>🐾 Quero ser parceiro</>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                <p className="text-center text-cyan-400 text-sm flex items-center justify-center gap-2">
                  <span>💡</span>
                  Durante a fase inicial, todas as parcerias sao gratuitas e focadas em impacto social.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
