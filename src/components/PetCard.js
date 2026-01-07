import Link from 'next/link';

const STATUS_CONFIG = {
  perdido: {
    label: 'PERDIDO',
    bg: 'bg-red-100',
    text: 'text-red-600',
    icon: '❌'
  },
  encontrado: {
    label: 'ENCONTRADO',
    bg: 'bg-green-100',
    text: 'text-green-600',
    icon: '✓'
  },
  adocao: {
    label: 'ADOÇÃO',
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    icon: '💙'
  }
};

const ESPECIE_EMOJI = {
  cao: '🐕',
  gato: '🐈',
  ave: '🐦',
  outro: '🐾'
};

export default function PetCard({ pet }) {
  const statusConfig = STATUS_CONFIG[pet.status] || STATUS_CONFIG.perdido;
  const especieEmoji = ESPECIE_EMOJI[pet.especie] || '🐾';

  return (
    <Link href={`/achados-e-perdidos/${pet.id}`}>
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 hover:shadow-xl transition-all hover:border-[#20B2AA]/30 cursor-pointer">
        {/* Status Badge */}
        <div className={`${statusConfig.bg} ${statusConfig.text} text-xs font-bold px-3 py-1 rounded-full inline-block mb-4`}>
          {statusConfig.icon} {statusConfig.label}
        </div>

        {/* Imagem ou Emoji */}
        {pet.imagem_url ? (
          <div className="w-full h-48 mb-4 rounded-2xl overflow-hidden">
            <img 
              src={pet.imagem_url} 
              alt={pet.nome || 'Pet'} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="text-5xl md:text-6xl mb-4 text-center py-6">
            {especieEmoji}
          </div>
        )}

        {/* Info */}
        <h3 className="text-xl font-black mb-2 text-gray-800">
          {pet.nome || 'Sem nome'}
        </h3>
        
        <p className="text-sm text-gray-600 mb-1">
          {pet.especie === 'cao' ? 'Cão' : pet.especie === 'gato' ? 'Gato' : pet.especie}
          {pet.raca && ` - ${pet.raca}`}
        </p>
        
        <p className="text-sm text-gray-500 mb-3">
          📍 {pet.localizacao}
        </p>

        {/* Data */}
        <p className="text-xs text-gray-400">
          {new Date(pet.data_ocorrencia).toLocaleDateString('pt-BR')}
        </p>

        {/* CTA */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-[#20B2AA] font-bold text-sm">
            Saber mais →
          </span>
        </div>
      </div>
    </Link>
  );
}
