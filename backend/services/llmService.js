const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

const handleGreeting = (message) => {
  const m = message.trim().toLowerCase()
  if (m === 'hi' || m === 'hello' || m === 'yo' || m === 'hey' || m === 'hlo')
    return "Hello! Ask me about your best routes, specific countries, costs, or PR timelines."
  return null
}

const getAIResponse = async (message, userContext) => {
  const intake = userContext?.intake
  const routes = userContext?.routes || []

  if (!intake) {
    return { reply: 'No intake profile. Please run the engine first.', module: null }
  }

  if (!process.env.GROQ_API_KEY) {
    return { reply: 'AI engine offline. Set GROQ_API_KEY.', module: null }
  }

  const greetingReply = handleGreeting(message)
  if (greetingReply) return { reply: greetingReply, module: null }

  // ---- Instant offline check for missing regions ----
  const lowerMsg = message.toLowerCase()
  const regions = ['arab', 'middle east', 'gulf', 'saudi', 'uae', 'dubai', 'qatar', 'kuwait', 'egypt', 'morocco', 'africa', 'asia', 'south america']
  const hasRegion = regions.some(r => lowerMsg.includes(r))
  const hasMatchingRoutes = routes.some(r => regions.some(reg => r.country?.toLowerCase().includes(reg)))
  if (hasRegion && !hasMatchingRoutes) {
    return { reply: "I don't have any routes for that location.", module: null }
  }

  // ---- Build AI context ----
  const topRoutes = routes.slice(0, 6).map(r => ({
    university: r.university,
    program: r.program,
    country: r.country,
    feasibility: r.feasibility,
    cost_inr: r.total_cost,
    pr_months: r.pr_timeline,
    duration_months: r.duration_months
  }))

  const contextBlock = {
    profile: {
      cgpa: intake.cgpa,
      budget_inr: intake.budget,
      ielts: intake.ielts,
      target: intake.fieldOfStudy,
      backlogs: intake.backlogs
    },
    available_routes: topRoutes
  }

  const systemMessage = `You are GRADROUTE ENGINE, a strict data‑based advisor.
- ONLY answer from the "available_routes" array.
- NEVER mention a university, program, country, cost, or number not in that array.
- If the user asks about a specific country or region that has no routes in the data, say: "I don't have any routes for that location."
- Keep answers under 4 sentences. No thinking tags, no chain‑of‑thought.
- Do not use <think> tags. Do not explain your reasoning. Just answer.`

  const userMessage = `DATA: ${JSON.stringify(contextBlock)}\n\nUSER: ${message}`

  try {
    const completion = await groq.chat.completions.create({
      model: 'qwen/qwen3-32b',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.1,
      max_tokens: 250,
    })

    let reply = completion.choices[0]?.message?.content?.trim()
      || 'I didn\'t get a response.'

    reply = reply.replace(/<think[\s\S]*?<\/think>/g, '').trim()

    return { reply, module: null }
  } catch (err) {
    console.error('Groq error:', err)
    return { reply: 'AI engine unavailable.', module: null }
  }
}

module.exports = { getAIResponse }