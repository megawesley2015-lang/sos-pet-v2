import { supabase } from '@/lib/supabase';

/**
 * @typedef {Object} PrestadorFilters
 * @property {string} [categoria] - Categoria do prestador
 * @property {string} [search] - Termo de busca
 * @property {string} [cidade] - Cidade para filtrar
 * @property {boolean} [verificado] - Filtrar verificados
 * @property {boolean} [emergencia24h] - Filtrar emergência 24h
 * @property {boolean} [delivery] - Filtrar com delivery
 * @property {boolean} [agendamento] - Filtrar com agendamento online
 * @property {string} [status] - Status do prestador (aprovado, pendente)
 * @property {number} [limit] - Limite de resultados
 * @property {boolean} [destaque] - Apenas destaques
 */

/**
 * Buscar todos os prestadores com filtros opcionais
 * 
 * @param {PrestadorFilters} filters - Filtros opcionais
 * @returns {Promise<Array>} Lista de prestadores
 */
export async function getPrestadores(filters = {}) {
  const {
    categoria,
    search,
    cidade,
    verificado,
    emergencia24h,
    delivery,
    agendamento,
    status = 'aprovado',
    limit,
    destaque,
  } = filters;

  let query = supabase
    .from('prestadores')
    .select('*')
    .eq('status', status)
    .order('media_avaliacoes', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  // Filtro por categoria
  if (categoria && categoria !== 'todos' && categoria !== 'Todos') {
    query = query.ilike('categoria', `%${categoria}%`);
  }

  // Busca por texto
  if (search) {
    query = query.or(`nome.ilike.%${search}%,especialidades.ilike.%${search}%,descricao.ilike.%${search}%`);
  }

  // Filtro por cidade
  if (cidade && cidade !== 'todas') {
    query = query.ilike('cidade', `%${cidade}%`);
  }

  // Filtro verificados
  if (verificado === true || verificado === 'true') {
    query = query.eq('verificado', true);
  }

  // Filtro emergência 24h
  if (emergencia24h === true || emergencia24h === 'true') {
    query = query.eq('emergencia24h', true);
  }

  // Filtro delivery
  if (delivery === true || delivery === 'true') {
    query = query.eq('delivery', true);
  }

  // Filtro agendamento online
  if (agendamento === true || agendamento === 'true') {
    query = query.eq('agendamento_online', true);
  }

  // Apenas destaques (para home)
  if (destaque) {
    query = query.eq('destaque', true);
  }

  // Limite de resultados
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar prestadores:', error);
    throw error;
  }

  return data || [];
}

/**
 * Buscar prestadores em destaque para a home
 * 
 * @param {number} limit - Quantidade de prestadores
 * @returns {Promise<Array>} Lista de prestadores em destaque
 */
export async function getPrestadoresDestaque(limit = 3) {
  const { data, error } = await supabase
    .from('prestadores')
    .select('*')
    .eq('status', 'aprovado')
    .order('media_avaliacoes', { ascending: false, nullsFirst: false })
    .order('total_avaliacoes', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error) {
    console.error('Erro ao buscar prestadores destaque:', error);
    // Retorna array vazio em caso de erro para não quebrar a UI
    return [];
  }

  return data || [];
}

/**
 * Buscar um prestador pelo ID
 * 
 * @param {string} id - ID do prestador
 * @returns {Promise<Object>} Dados do prestador
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

  // Incrementar visualização (fire-and-forget)
  incrementarVisualizacao(id).catch(console.error);

  return data;
}

/**
 * Buscar um prestador pelo Slug
 * 
 * @param {string} slug - Slug do prestador
 * @returns {Promise<Object>} Dados do prestador
 */
export async function getPrestadorBySlug(slug) {
  const { data, error } = await supabase
    .from('prestadores')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Erro ao buscar prestador por slug:', error);
    throw error;
  }

  // Incrementar visualização (fire-and-forget)
  if (data?.id) {
    incrementarVisualizacao(data.id).catch(console.error);
  }

  return data;
}

/**
 * Incrementar contador de visualizações
 * 
 * @param {string} prestadorId - ID do prestador
 */
async function incrementarVisualizacao(prestadorId) {
  await supabase.rpc('incrementar_visualizacao_prestador', { 
    prestador_id: prestadorId 
  });
}

/**
 * Registrar clique no WhatsApp
 * 
 * @param {string} prestadorId - ID do prestador
 */
export async function registrarCliqueWhatsapp(prestadorId) {
  await supabase.rpc('incrementar_clique_whatsapp', { 
    prestador_id: prestadorId 
  });
}

/**
 * Buscar avaliações de um prestador
 * 
 * @param {string} prestadorId - ID do prestador
 * @returns {Promise<Array>} Lista de avaliações
 */
export async function getAvaliacoesByPrestador(prestadorId) {
  const { data, error } = await supabase
    .from('avaliacoes')
    .select('*')
    .eq('prestador_id', prestadorId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar avaliações:', error);
    return [];
  }

  return data || [];
}

/**
 * Criar nova avaliação
 * 
 * @param {Object} avaliacao - Dados da avaliação
 * @param {string} avaliacao.prestador_id - ID do prestador
 * @param {string} avaliacao.user_id - ID do usuário
 * @param {string} avaliacao.autor_nome - Nome do autor
 * @param {number} avaliacao.nota - Nota (1-5)
 * @param {string} [avaliacao.comentario] - Comentário opcional
 * @param {string} [avaliacao.servico_utilizado] - Serviço utilizado
 * @returns {Promise<Object>} Avaliação criada
 */
export async function criarAvaliacao({ prestador_id, user_id, autor_nome, nota, comentario, servico_utilizado }) {
  const { data, error } = await supabase
    .from('avaliacoes')
    .insert([{
      prestador_id,
      user_id,
      autor_nome,
      nota,
      comentario,
      servico_utilizado,
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
 * 
 * @param {string} prestadorId - ID do prestador
 */
async function atualizarMediaAvaliacoes(prestadorId) {
  const { data: avaliacoes } = await supabase
    .from('avaliacoes')
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
 * Buscar categorias únicas de prestadores aprovados
 * 
 * @returns {Promise<Array<string>>} Lista de categorias
 */
export async function getCategorias() {
  const { data, error } = await supabase
    .from('prestadores')
    .select('categoria')
    .eq('status', 'aprovado');

  if (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }

  // Retornar categorias únicas
  const categorias = [...new Set(data.map(p => p.categoria).filter(Boolean))];
  return categorias.sort();
}

/**
 * Buscar cidades com prestadores ativos
 * 
 * @returns {Promise<Array<string>>} Lista de cidades
 */
export async function getCidadesAtivas() {
  const { data, error } = await supabase
    .from('prestadores')
    .select('cidade')
    .eq('status', 'aprovado');

  if (error) {
    console.error('Erro ao buscar cidades:', error);
    return [];
  }

  const cidades = [...new Set(data.map(p => p.cidade).filter(Boolean))];
  return cidades.sort();
}
