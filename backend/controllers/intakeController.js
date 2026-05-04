const { supabase } = require('../config/supabase')

const evaluateIntake = async (req, res) => {
  try {
    const {
      cgpa,
      backlogs = 0,
      ielts,
      budget,
      targetCountries = [],
      maxDuration,
      fastTrackPR,
      fieldOfStudy
    } = req.body

    const parsedCgpa = parseFloat(cgpa)
    const parsedBacklogs = parseInt(backlogs)
    const parsedBudget = parseInt(budget)
    const parsedIelts = ielts ? parseFloat(ielts) : null

    let query = supabase
      .from('universities')
      .select('id', { count: 'exact', head: true })
      .lte('minCgpa', parsedCgpa)
      .gte('maxBacklogs', parsedBacklogs)           // FIXED
      .lte('totalCostPerYear', parsedBudget)

    if (parsedIelts) query = query.lte('ieltsRequired', parsedIelts)
    if (targetCountries.length > 0) query = query.in('country', targetCountries)
    if (maxDuration) query = query.lte('duration_months', parseInt(maxDuration))
    if (fastTrackPR === true) query = query.lte('prTimelineMonths', 48)
    if (fieldOfStudy) query = query.ilike('roiVector', `%${fieldOfStudy}%`)

    const { count, error } = await query
    if (error) throw error

    const feasibility = Math.min(98, Math.max(20, Math.round((count / 10) * 100)))
    res.json({ count: count || 0, feasibility })
  } catch (err) {
    console.error('Evaluation error:', err)
    res.status(500).json({ error: err.message || 'Evaluation failed' })
  }
}

module.exports = { evaluateIntake }