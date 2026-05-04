const { getAIResponse } = require('../services/llmService')
const { supabase } = require('../config/supabase')

const sendMessage = async (req, res) => {
  try {
    const { conversationId, message } = req.body
    const userId = req.user.id

    if (!conversationId || !message) {
      return res.status(400).json({ error: 'conversationId and message required' })
    }

    const [intakeRes, routesRes] = await Promise.all([
      supabase.from('intake_data').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('routes').select('*').eq('user_id', userId).order('feasibility', { ascending: false }).limit(8)
    ])

    const userContext = {
      intake: intakeRes.data || null,
      routes: routesRes.data || []
    }

    // Save user message
    const { error: userMsgErr } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'user',
      content: message
    })
    if (userMsgErr) console.error('Error saving user message:', userMsgErr)

    const { reply, module } = await getAIResponse(message, userContext)

    // Save assistant message
    const { error: asstMsgErr } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      role: 'assistant',
      content: reply,
      module: module || null
    })
    if (asstMsgErr) console.error('Error saving assistant message:', asstMsgErr)

    res.json({ reply, module })
  } catch (err) {
    console.error('Chat error:', err)
    res.status(500).json({ error: err.message || 'Chat failed' })
  }
}

const deleteConversation = async (req, res) => {
  try {
    const { id } = req.params
    const userId = req.user.id

    const { data: conv, error: fetchErr } = await supabase
      .from('conversations')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single()

    if (fetchErr || !conv) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    await supabase.from('messages').delete().eq('conversation_id', id)
    await supabase.from('conversations').delete().eq('id', id)

    res.json({ success: true })
  } catch (err) {
    console.error('Delete conversation error:', err)
    res.status(500).json({ error: err.message || 'Deletion failed' })
  }
}

module.exports = { sendMessage, deleteConversation }