import Link from 'next/link';

const CATEGORIA_EMOJI = {
  'Veterinário': '🏥',
  'Pet Shop': '🛍️',
  'Hotel': '🏨',
  'Banho e Tosa': '✂️',
  'Adestramento': '🎓',
  'Passeador': '🦮',
  'Creche': '🏠',
};

export default function PrestadorCard({ prestador }) {
  const emoji = CATEGORIA_EMOJI[prestador.categoria] || '🐾';
  
  return (
    <Link href={`/prestadores/${prestador.Slug || prestador.id}`}>
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 hover:shadow-xl transition-all hover:border-[#20B2AA]/30 cursor-pointer h-full flex flex-col">
        
        {/* Avatar/Imagem */}
        {prestador.Avatar ? (
          <div className="w-full h-48 mb-4 rounded-2xl overflow-hidden">
            <img 
              src={prestador.Avatar} 
              alt={prestador.Nome} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-gradient-to-br from-[#E0F7F6] to-[#B2DFDB] rounded-2xl flex items-center justify-center mb-4">
            <span className="text-5xl">{emoji}</span>
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {prestador.verificado && (
            <span className="bg-[#20B2AA]/10 text-[#20B2AA] text-xs font-bold px-2 py-1 rounded-full">
              ✓ Verificado
            </span>
          )}
          {prestador.emergencia_24h && (
            <span className="bg-[#FF6B35]/10 text-[#FF6B35] text-xs font-bold px-2 py-1 rounded-full">
              ⚡ 24h
            </span>
          )}
        </div>

        {/* Info */}
        <h3 className="text-lg font-black mb-1 text-gray-800 line-clamp-2">
          {prestador.Nome}
        </h3>
        
        <p className="text-sm text-[#20B2AA] font-semibold mb-2">
          {prestador.categoria}
        </p>

        {prestador.especialidades && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
            {prestador.especialidades}
          </p>
        )}

        {/* Endereço */}
        {prestador.Endereco && (
          <p className="text-sm text-gray-500 mb-3 flex items-start gap-1">
            <span>📍</span>
            <span className="line-clamp-1">{prestador.Endereco}</span>
          </p>
        )}

        {/* Rating - sempre no final */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-black text-gray-800">
              {prestador.media_avaliacoes?.toFixed(1) || '0.0'}
            </span>
            <span className="text-gray-400 text-sm">
              ({prestador.total_avaliacoes || 0})
            </span>
          </div>
          
          <span className="text-[#20B2AA] font-bold text-sm">
            Ver mais →
          </span>
        </div>
      </div>
    </Link>
  );
}
