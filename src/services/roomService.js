import { supabase } from '../lib/supabaseClient'

export const getRooms = async ({ location, minPrice, maxPrice, type, tenant }) => {
    let query = supabase.from('rooms').select('*')

    if (location) query = query.ilike('location', `%${location}%`)
    if (minPrice) query = query.gte('rent', minPrice)
    if (maxPrice) query = query.lte('rent', maxPrice)
    if (type) query = query.eq('property_type', type)
    if (tenant) query = query.eq('tenant_preference', tenant)

    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
}

export const getOwnerRooms = async (ownerId) => {
    const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false })
    return { data, error }
}

export const getRoomById = async (id) => {
    const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', id)
        .single()
    return { data, error }
}

export const createRoom = async (roomData) => {
    const { data, error } = await supabase.from('rooms').insert([roomData]).select()
    return { data, error }
}

export const updateRoom = async (id, roomData) => {
    const { data, error } = await supabase
        .from('rooms')
        .update(roomData)
        .eq('id', id)
        .select()
    return { data, error }
}

export const deleteRoom = async (id) => {
    const { data, error } = await supabase.from('rooms').delete().eq('id', id)
    return { data, error }
}

export const uploadImage = async (file) => {
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
    const { data, error } = await supabase.storage
        .from('room-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (error) return { data: null, error }

    const { data: { publicUrl } } = supabase.storage
        .from('room-images')
        .getPublicUrl(fileName)

    return { data: publicUrl, error: null }
}
