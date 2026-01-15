"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Hook contador animado
export function useCountUp(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start || end === 0) {
      if (start) setCount(end);
      return;
    }
    
    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration, start]);

  return count;
}

// Pain Point Card com micro-interação
export function PainPointCard({ icon, question, solution, delay }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative group cursor-pointer transition-all duration-500 ${isHovered ? 'scale-105' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute -inset-1 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-2xl blur-lg transition-opacity duration-500 ${isHovered ? 'opacity-30' : 'opacity-0'}`}></div>
      
      <div className="relative bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 h-full hover:border-cyan-500/50 transition-all duration-300">
        <div className={`absolute inset-0 rounded-2xl overflow-hidden ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent animate-scan"></div>
        </div>
        
        <div className="relative z-10">
          <div className={`w-14 h-14 bg-gradient-to-br from-orange-500/20 to-cyan-500/20 rounded-xl flex items-center justify-center mb-4 ${isHovered ? 'animate-heartbeat' : ''}`}>
            <span className="text-3xl">{icon}</span>
          </div>
          
          <h3 className="text-white font-bold text-lg mb-3 leading-tight">{question}</h3>
          
          <div className={`transition-all duration-500 ${isHovered ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'} overflow-hidden`}>
            <div className="flex items-start gap-2 text-cyan-400 text-sm">
              <span className="text-green-400 mt-0.5">✓</span>
              <p>{solution}</p>
            </div>
          </div>
          
          <p className={`text-gray-500 text-sm mt-3 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
            Passe o mouse para ver a solução →
          </p>
        </div>
      </div>
    </div>
  );
}

// Stat Card com contador animado
export function StatCard({ value, label, icon, isVisible }) {
  const animatedValue = useCountUp(value, 2000, isVisible);
  
  return (
    <div className="text-center group">
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <div className="text-3xl md:text-4xl font-black text-white mb-1">
        {animatedValue.toLocaleString("pt-BR")}+
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

// Testimonial Card
export function TestimonialCard({ name, role, text, image, rating, delay }) {
  return (
    <div 
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300 animate-fadeInUp"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-600"}>★</span>
        ))}
      </div>
      
      <p className="text-gray-300 mb-4 leading-relaxed">"{text}"</p>
      
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-2xl">
          {image}
        </div>
        <div>
          <p className="font-bold text-white">{name}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
}

// Compare Item (Antes/Depois)
export function CompareItem({ icon, text, type }) {
  const isOld = type === 'old';
  
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${isOld ? 'bg-red-500/10 border border-red-500/20' : 'bg-green-500/10 border border-green-500/20'}`}>
      <span className={`text-xl ${isOld ? 'text-red-400' : 'text-green-400'}`}>{icon}</span>
      <span className={`text-sm ${isOld ? 'text-red-300' : 'text-green-300'}`}>{text}</span>
    </div>
  );
}

// Phone Mockup
export function PhoneMockup() {
  return (
    <div className="relative z-10">
      <div className="relative w-64 md:w-72">
        <div className="bg-gradient-to-b from-slate-600 to-slate-800 rounded-[3rem] p-2 shadow-2xl shadow-black/50">
          <div className="bg-[#0a1628] rounded-[2.5rem] overflow-hidden">
            <div className="h-7 bg-[#0a1628] flex justify-center items-end pb-1">
              <div className="w-24 h-5 bg-black rounded-full"></div>
            </div>
            
            <div className="h-[400px] md:h-[450px] bg-gradient-to-b from-[#0f1a2e] via-[#0a1628] to-[#0f1a2e] flex flex-col items-center relative overflow-hidden">
              
              <div className="w-full px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🐾</span>
                  <span className="text-white font-bold text-sm">SOS Pet</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 text-xs">Online</span>
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center relative">
                <div className="absolute w-52 h-52 rounded-full border border-slate-700/30 animate-spin-slower">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400/40 rounded-full"></div>
                </div>
                <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20 animate-spin-slow-reverse">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
                </div>
                <div className="absolute w-36 h-36 rounded-full border border-cyan-500/30 animate-spin-slow">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/80"></div>
                </div>
                
                <Link href="/meus-pets" className="relative group">
                  <div className="absolute -inset-4 bg-cyan-500/20 rounded-full blur-xl group-hover:bg-cyan-500/30 transition-all"></div>
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-b from-slate-700/80 to-slate-900/90 border border-cyan-500/40 flex items-center justify-center shadow-2xl group-hover:scale-105 transition-all">
                    <svg className="w-14 h-14 md:w-16 md:h-16" viewBox="0 0 100 100" fill="none">
                      <ellipse cx="50" cy="65" rx="18" ry="15" fill="#f97316" />
                      <ellipse cx="28" cy="45" rx="10" ry="12" fill="#f97316" />
                      <ellipse cx="72" cy="45" rx="10" ry="12" fill="#f97316" />
                      <ellipse cx="38" cy="28" rx="8" ry="10" fill="#f97316" />
                      <ellipse cx="62" cy="28" rx="8" ry="10" fill="#f97316" />
                    </svg>
                  </div>
                </Link>
              </div>

              <div className="text-center mb-3">
                <p className="text-white font-bold">Meus Pets</p>
                <p className="text-gray-400 text-xs">Acesse o perfil dos seus pets</p>
              </div>

              <div className="w-full px-4 pb-5">
                <div className="bg-slate-800/60 backdrop-blur-xl rounded-xl p-3 border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <span>🔔</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Home do Tutor</p>
                        <p className="text-gray-400 text-xs">Vacinas • Perfil • Alertas</p>
                      </div>
                    </div>
                    <span className="text-cyan-400">→</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
