const { generateRoutes } = require('../services/filteringService')
const { supabase } = require('../config/supabase')

const generate = async (req, res) => {
  try {
    const userId = req.user.id
    await supabase.from('intake_data').upsert({ user_id: userId, ...req.body }, { onConflict: 'user_id' })
    const routes = await generateRoutes(userId, req.body)
    res.json({ success: true, count: routes.length })
  } catch (err) {
    console.error('Route generation error:', err)
    res.status(500).json({ error: err.message })
  }
}

const getAll = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('user_id', req.user.id)
      .order('feasibility', { ascending: false })
    if (error) throw error
    res.json(data || [])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const getOne = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('routes')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.user.id)
      .maybeSingle()
    if (error) throw error
    if (!data) return res.status(404).json({ error: 'Route not found' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const toggleSaved = async (req, res) => {
  try {
    const { id } = req.params
    const { saved } = req.body
    const { data, error } = await supabase
      .from('routes')
      .update({ saved })
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single()
    if (error) throw error
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { generate, getAll, getOne, toggleSaved }