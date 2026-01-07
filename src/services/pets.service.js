import { supabase } from '@/lib/supabase';

/**
 * Buscar todos os pets com filtros opcionais
 */
export async function getPets({ status, especie, localizacao } = {}) {
  let query = supabase
    .from('pets')
    .select('*')
    .eq('ativo', true)
    .order('created_at', { ascending: false });

  if (status && status !== 'todos') {
    query = query.eq('status', status);
  }

  if (especie && especie !== 'todos') {
    query = query.eq('especie', especie);
  }

  if (localizacao) {
    query = query.ilike('localizacao', `%${localizacao}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Erro ao buscar pets:', error);
    throw error;
  }

  return data;
}

/**
 * Buscar um pet pelo ID
 */
export async function getPetById(id) {
  const { data, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Erro ao buscar pet:', error);
    throw error;
  }

  return data;
}

/**
 * Criar novo pet
 */
export async function createPet(petData) {
  // Pegar user_id se estiver logado
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('pets')
    .insert([{
      ...petData,
      user_id: user?.id || null
    }])
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar pet:', error);
    throw error;
  }

  return data;
}

/**
 * Atualizar pet existente
 */
export async function updatePet(id, petData) {
  const { data, error } = await supabase
    .from('pets')
    .update(petData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao atualizar pet:', error);
    throw error;
  }

  return data;
}

/**
 * Deletar pet (soft delete - marca como inativo)
 */
export async function deletePet(id) {
  const { error } = await supabase
    .from('pets')
    .update({ ativo: false })
    .eq('id', id);

  if (error) {
    console.error('Erro ao deletar pet:', error);
    throw error;
  }

  return true;
}

/**
 * Upload de imagem do pet
 */
export async function uploadPetImage(file) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = `pets/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('pets')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Erro ao fazer upload:', uploadError);
    throw uploadError;
  }

  // Retornar URL pública
  const { data } = supabase.storage
    .from('pets')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Marcar pet como encontrado/resolvido
 */
export async function marcarComoResolvido(id) {
  const { data, error } = await supabase
    .from('pets')
    .update({ status: 'resolvido', ativo: false })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Erro ao marcar como resolvido:', error);
    throw error;
  }

  return data;
}
