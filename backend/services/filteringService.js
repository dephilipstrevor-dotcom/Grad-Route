const { supabase } = require('../config/supabase')

// Keyword mapping for the four new domains
const DOMAIN_KEYWORDS = {
  'Systems & Computer Architecture': ['computer architecture', 'operating system', 'low-level', 'computer engineering'],
  'Robotics & Embedded Systems': ['robotics', 'embedded', 'mechatronics', 'control systems'],
  'Cloud & Distributed Computing': ['cloud', 'distributed computing', 'devops', 'cloud computing'],
  'Human-Computer Interaction (HCI)': ['hci', 'human-computer', 'user experience', 'ui/ux', 'interface design', 'interaction design']
}

const generateRoutes = async (userId, intake) => {
  const {
    cgpa,
    backlogs = 0,
    ielts,
    budget,
    targetCountries = [],
    maxDuration,
    fastTrackPR,
    fieldOfStudy
  } = intake

  console.log(`\n🔍 FILTERING for user ${userId} with:`, {
    cgpa, backlogs, ielts, budget,
    countries: targetCountries,
    maxDuration,
    fastTrackPR,
    fieldOfStudy
  })

  let query = supabase.from('universities').select('*')

  if (cgpa) query = query.lte('minCgpa', parseFloat(cgpa))
  if (backlogs !== undefined) query = query.gte('maxBacklogs', parseInt(backlogs))
  if (budget) query = query.lte('totalCostPerYear', parseInt(budget))
  if (ielts) query = query.lte('ieltsRequired', parseFloat(ielts))
  if (targetCountries.length > 0) query = query.in('country', targetCountries)
  if (maxDuration) query = query.lte('duration_months', parseInt(maxDuration))
  if (fastTrackPR) query = query.lte('prTimelineMonths', 48)

  // ---- Field of study handling ----
  if (fieldOfStudy) {
    const originalCategories = [
      'AI & Big Data',
      'Cybersecurity',
      'Software Engineering',
      'Tech Management',
      'Core Engineering'
    ]

    if (originalCategories.includes(fieldOfStudy)) {
      // Original behavior: filter by roiVector
      query = query.ilike('roiVector', `%${fieldOfStudy}%`)
    } else if (DOMAIN_KEYWORDS[fieldOfStudy]) {
      // New domain: build OR condition with keywords
      const keywords = DOMAIN_KEYWORDS[fieldOfStudy]
      const filterStr = keywords.map(k => `program.ilike.%${k}%`).join(',')
      query = query.or(filterStr)
    } else {
      // Unknown domain – fallback to literal program.ilike
      query = query.ilike('program', `%${fieldOfStudy}%`)
    }
  }

  query = query.order('totalCostPerYear', { ascending: true }).limit(50)

  const { data: universities, error: filterError } = await query
  if (filterError) {
    console.error('❌ University filter error:', filterError)
    throw new Error(filterError.message)
  }

  console.log(`✅ Universities matched: ${universities?.length || 0}`)

  const routes = (universities || []).map(uni => {
    const minCgpa = Number(uni.minCgpa || 0)
    const totalCost = Number(uni.totalCostPerYear || 0)
    const gpaMargin = (parseFloat(cgpa) || 0) - minCgpa
    const budgetDelta = (parseInt(budget) || 0) - totalCost

    let feasibility = 50
    feasibility += Math.min(30, gpaMargin * 15)
    feasibility += budgetDelta >= 0
      ? Math.min(20, (budgetDelta / 100000) * 5)
      : Math.max(-30, (budgetDelta / 100000) * 10)
    feasibility = Math.min(98, Math.max(15, Math.round(feasibility)))

    let tier = 'moderate'
    if (gpaMargin >= 0.5 && budgetDelta >= 0 && feasibility >= 75) tier = 'safe'
    else if (gpaMargin < 0.2 || budgetDelta < -200000 || feasibility < 50) tier = 'ambitious'

    return {
      user_id: userId,
      tier,
      university: uni.name,
      program: uni.program,
      country: uni.country,
      duration_months: uni.duration_months,
      minCgpa: uni.minCgpa,
      ieltsRequired: uni.ieltsRequired,
      feasibility,
      total_cost: totalCost,
      pr_timeline: uni.prTimelineMonths || 48,
      roi_vector: fieldOfStudy,       // user’s chosen domain
      market_demand: uni.marketDemand || 'Medium',
      saved: false
    }
  })

  routes.sort((a, b) => b.feasibility - a.feasibility)

  // Delete old routes
  const { error: deleteErr } = await supabase
    .from('routes')
    .delete()
    .eq('user_id', userId)

  if (deleteErr) {
    console.error('❌ Delete old routes error:', deleteErr)
    throw new Error(deleteErr.message)
  }
  console.log(`🗑️  Old routes deleted for user ${userId}`)

  // Insert new routes
  if (routes.length > 0) {
    const { data: inserted, error: insertErr } = await supabase
      .from('routes')
      .insert(routes)
      .select('id')

    if (insertErr) {
      console.error('❌ Insert error:', insertErr)
      throw new Error(insertErr.message)
    }
    console.log(`✅ Inserted ${inserted.length} routes for user ${userId}`)
  } else {
    console.log('⚠️  No routes to insert (0 matches)')
  }

  return routes
}

module.exports = { generateRoutes }