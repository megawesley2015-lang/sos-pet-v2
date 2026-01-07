import { supabase } from '@/lib/supabase';

/**
 * Buscar todos os prestadores com filtros opcionais
 */
export async function getPrestadores({ categoria, search, cidade, verificado, emergencia24h } = {}) {
  let query = supabase
    .from('prestadores')
    .select('*')
    .order('media_avaliacoes', { ascending: false });

  if (categoria && categoria !== 'todos') {
    query = query.eq('categoria', categoria);
  }

  if (search) {
    query = query.or(`Nome.ilike.%${search}%,especialidades.ilike.%${search}%`);
  }

  if (cidade) {
    query = query.ilike('Endereco', `%${cidade}%`);
  }

  if (verificado) {
    query = query.eq('verificado', true);
  }

  if (emergencia24h) {
    query = query.eq('emergencia_24h', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar prestadores:', error);
    throw error;
  }

  return data;
}

/**
 * Buscar um prestador pelo ID
 */
export async function getPrestadorById(id) {
  const { data, error } = await supabase
    .from('prestadores')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar prestador:', error);
    throw error;
  }

  return data;
}

/**
 * Buscar um prestador pelo Slug
 */
export async function getPrestadorBySlug(slug) {
  const { data, error } = await supabase
    .from('prestadores')
    .select('*')
    .eq('Slug', slug)
    .single();

  if (error) {
    console.error('Erro ao buscar prestador:', error);
    throw error;
  }

  return data;
}

/**
 * Buscar avaliações de um prestador
 */
export async function getAvaliacoesByPrestador(prestadorId) {
  const { data, error } = await supabase
    .from('Avaliacões')
    .select('*')
    .eq('prestador_id', prestadorId)
    .order('Dados', { ascending: false });

  if (error) {
    console.error('Erro ao buscar avaliações:', error);
    throw error;
  }

  return data;
}

/**
 * Criar nova avaliação
 */
export async function criarAvaliacao({ prestador_id, usuario, nota, comentario }) {
  const { data, error } = await supabase
    .from('Avaliacões')
    .insert([{
      prestador_id,
      usuario,
      nota,
      comentario,
      Dados: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar avaliação:', error);
    throw error;
  }

  // Atualizar média do prestador
  await atualizarMediaAvaliacoes(prestador_id);

  return data;
}

/**
 * Atualizar média de avaliações do prestador
 */
async function atualizarMediaAvaliacoes(prestadorId) {
  const { data: avaliacoes } = await supabase
    .from('Avaliacões')
    .select('nota')
    .eq('prestador_id', prestadorId);

  if (avaliacoes && avaliacoes.length > 0) {
    const media = avaliacoes.reduce((acc, a) => acc + a.nota, 0) / avaliacoes.length;
    
    await supabase
      .from('prestadores')
      .update({ 
        media_avaliacoes: Math.round(media * 10) / 10,
        total_avaliacoes: avaliacoes.length 
      })
      .eq('id', prestadorId);
  }
}

/**
 * Buscar categorias únicas
 */
export async function getCategorias() {
  const { data, error } = await supabase
    .from('prestadores')
    .select('categoria');

  if (error) {
    console.error('Erro ao buscar categorias:', error);
    throw error;
  }

  // Retornar categorias únicas
  const categorias = [...new Set(data.map(p => p.categoria).filter(Boolean))];
  return categorias;
}
