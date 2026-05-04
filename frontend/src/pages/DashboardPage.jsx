import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

/* ==============================
   NAVBAR (inlined)
   ============================== */
const Navbar = () => {
  const { user, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-full px-6 py-3 flex justify-between items-center z-50">
      <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3 font-bold text-sm tracking-widest uppercase text-white">
        <div className="w-8 h-8 bg-brand-copper/20 rounded-lg flex items-center justify-center border border-brand-copper/30 overflow-hidden">
          <img src="/logo.svg" alt="GradRoute" className="w-full h-full object-cover" />
        </div>
        <span>GRADROUTE <span className="text-brand-copper font-black"></span></span>
      </Link>

      <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest text-gray-300 uppercase">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/intake" className="hover:text-white transition-colors">Intake</Link>
            <Link to="/chat" className="hover:text-white transition-colors">Mentor</Link>
          </>
        ) : (
          <>
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#process" className="hover:text-white transition-colors">Process</a>
            <a href="#outcomes" className="hover:text-white transition-colors">Outcomes</a>
          </>
        )}
      </div>

      {user ? (
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 text-white"
          >
            <div className="w-8 h-8 rounded-full bg-brand-copper/20 border border-brand-copper/30 flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-copper" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0F172A] border border-white/10 rounded-xl shadow-xl py-1 z-50">
              <Link
                to="/account"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                onClick={() => setDropdownOpen(false)}
              >
                Account Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/5"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/auth"
          className="bg-brand-copper hover:bg-brand-copper/90 text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest px-6 py-3 rounded-full transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(224,93,54,0.3)] hover:shadow-[0_0_30px_rgba(224,93,54,0.5)]"
        >
          Initialize Engine <i className="fa-solid fa-arrow-right"></i>
        </Link>
      )}
    </nav>
  )
}

/* ==============================
   CONSTRAINT HUD
   ============================== */
const ConstraintHUD = ({ data }) => {
  const { cgpa, backlogs, budget, targetRole, degreeLevel, fieldOfStudy } = data

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <i className="fa-solid fa-terminal text-gray-600 text-[10px]"></i>
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500">Global Probability Stack</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 gap-y-3">
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-0.5">CGPA</div>
          <div className="font-mono text-gray-200 text-sm font-medium">{cgpa || '—'}</div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-0.5">BACKLOGS</div>
          <div className="font-mono text-gray-200 text-sm font-medium">{backlogs || '0'}</div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-0.5">BUDGET</div>
          <div className="font-mono text-gray-200 text-sm font-medium">₹{(budget/100000).toFixed(1)}L</div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-0.5">VECTOR</div>
          <div className="font-mono text-gray-200 text-sm font-medium truncate max-w-[120px]">{targetRole || fieldOfStudy || 'ENG'}</div>
        </div>
        <div>
          <div className="text-[9px] font-mono uppercase tracking-[0.15em] text-gray-500 mb-0.5">DEGREE</div>
          <div className="font-mono text-gray-200 text-sm font-medium">{degreeLevel || 'MS'}</div>
        </div>
      </div>
    </div>
  )
}

/* ==============================
   FEASIBILITY GAUGE
   ============================== */
const FeasibilityGauge = ({ score }) => {
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-4 flex items-center gap-4">
      <div className="relative w-14 h-14">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="36" fill="none" stroke="#1e293b" strokeWidth="3" />
          <circle
            cx="50" cy="50" r="36"
            fill="none"
            stroke="#f97316"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-mono font-bold text-white">{score}%</span>
        </div>
      </div>
      <div>
        <p className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-gray-500 mb-0.5">Global Feasibility</p>
        <p className="text-[10px] text-gray-400 leading-relaxed max-w-[160px]">
          Extraction probability to Tier-1 economy.
        </p>
      </div>
    </div>
  )
}

/* ==============================
   ROUTE CARD (with inline SVG bookmark)
   ============================== */
const RouteCard = ({ route, tier, tierConfig, isBestMatch = false, onToggleSaved }) => {
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [budgetWidth, setBudgetWidth] = useState(0)
  const [prWidth, setPrWidth] = useState(0)
  const [saved, setSaved] = useState(route.saved || false)
  const [saving, setSaving] = useState(false)

  const budgetDelta = route.total_cost - (route.userBudget || 1500000)
  const isDeficit = budgetDelta > 0
  const budgetPercent = Math.min(100, ((route.userBudget || 1500000) / route.total_cost) * 100)
  const prPercent = Math.min(100, (60 / (route.pr_timeline || 48)) * 100)

  useEffect(() => {
    const budgetTimer = setTimeout(() => setBudgetWidth(budgetPercent), 100)
    const prTimer = setTimeout(() => setPrWidth(prPercent), 200)
    return () => {
      clearTimeout(budgetTimer)
      clearTimeout(prTimer)
    }
  }, [budgetPercent, prPercent])

  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-red-500'
  }

  const handleToggleSave = async (e) => {
    e.stopPropagation()
    if (saving) return
    setSaving(true)
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch(`${API_BASE_URL}/routes/${route.id}/saved`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ saved: !saved })
      })
      if (res.ok) {
        setSaved(!saved)
        if (onToggleSaved) onToggleSaved(route.id, !saved)
      }
    } catch (err) {
      console.error('Failed to toggle save:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className={`relative bg-[#0f172a] border ${isBestMatch ? 'border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/5'} rounded-xl p-6 transition-all duration-300 cursor-pointer group hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:border-white/15`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/report/${route.id}`)}
    >
      {/* Best Match Badge */}
      {isBestMatch && (
        <div className="absolute -top-2 left-4 bg-transparent text-green-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-green-500/40 tracking-wider backdrop-blur-sm">
          ⚡ SYSTEM PICK
        </div>
      )}

      {/* SAVE BOOKMARK BUTTON (inline SVG, always visible) */}
      <button
        onClick={handleToggleSave}
        disabled={saving}
        className={`absolute top-4 right-4 z-10 text-lg transition-all ${
          saved ? 'text-brand-copper' : 'text-gray-500 hover:text-brand-copper'
        }`}
        title={saved ? 'Remove from saved' : 'Save route'}
      >
        {saved ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={0.5}>
            <path d="M5 3h14v18l-7-4-7 4V3z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h14v18l-7-4-7 4V3z" />
          </svg>
        )}
      </button>

      <div className="flex items-start justify-between mb-4 pr-8">
        <div>
          <h4 className="text-white font-semibold text-base mb-0.5">{route.university}</h4>
          <p className="text-gray-300 text-xs leading-tight">{route.program}</p>
          <p className="text-gray-500 text-[10px] font-mono uppercase tracking-wider mt-1.5">{route.country}</p>
        </div>
        <div className="text-right">
          <span className={`text-2xl font-mono font-bold transition-all duration-300 ${getMatchColor(route.feasibility)} ${isHovered ? 'scale-110 inline-block' : ''}`}>
            {route.feasibility}%
          </span>
          <span className="text-[9px] text-gray-500 block font-mono tracking-wider">MATCH</span>
        </div>
      </div>

      {/* Budget Delta */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Budget Delta</span>
          <span className={`text-xs font-mono font-bold ${isDeficit ? 'text-red-500' : 'text-green-500'}`}>
            {isDeficit ? '-' : '+'}₹{Math.abs(budgetDelta / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ease-out ${isDeficit ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${budgetWidth}%` }}
          ></div>
        </div>
      </div>

      {/* PR Horizon */}
      <div className="mb-5">
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1.5">
          <span>PR Horizon</span>
          <span>~{route.pr_timeline} MO</span>
        </div>
        <div className="relative h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
          <div 
            className="absolute h-full bg-orange-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${prWidth}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[8px] font-mono text-gray-600 mt-1.5">
          <span>STUDY</span>
          <span>WORK</span>
          <span>PR</span>
        </div>
      </div>

      {/* ROI Vector */}
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">ROI Vector:</span>
          <span className="text-[10px] text-orange-400 font-mono font-medium">{route.roi_vector}</span>
        </div>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Market Demand:</span>
          <span className={`text-[10px] font-mono font-bold ${route.market_demand === 'High' ? 'text-green-500' : 'text-amber-500'}`}>
            {route.market_demand}
          </span>
        </div>
      </div>

      {/* Decrypt Button */}
      <button 
        className={`w-full py-2.5 rounded-lg bg-[#0F172A] text-gray-300 text-[11px] font-mono uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center gap-2 border ${tierConfig.borderAccent} hover:bg-[#1e293b] hover:text-white hover:shadow-[0_0_10px_rgba(249,115,22,0.3)]`}
      >
        DECRYPT FULL PATHWAY
        <i className="fa-solid fa-arrow-right text-[9px]"></i>
      </button>
    </div>
  )
}

/* ==============================
   TIER CONFIG & ROUTE MATRIX (unchanged)
   ============================== */
const TIER_CONFIG = {
  safe: { label: 'SAFE', accent: 'text-green-400', borderAccent: 'border-green-500/30', desc: 'High feasibility · within budget' },
  moderate: { label: 'MODERATE', accent: 'text-amber-400', borderAccent: 'border-amber-500/30', desc: 'Balanced risk · stretch within reach' },
  ambitious: { label: 'AMBITIOUS', accent: 'text-red-400', borderAccent: 'border-red-500/30', desc: 'High leverage · requires upside' }
}

const RouteMatrix = ({ routes = [], intakeData = null }) => {
  const userBudget = Number(intakeData?.budget) || 1500000
  const tiers = ['safe', 'moderate', 'ambitious']

  const grouped = tiers.reduce((acc, t) => {
    acc[t] = routes.filter(r => (r?.tier || 'moderate') === t)
    return acc
  }, {})

  const bestId = routes.length
    ? [...routes].sort((a, b) => (b.feasibility || 0) - (a.feasibility || 0))[0]?.id
    : null

  if (routes.length === 0) {
    return (
      <div className="bg-[#0f172a] border border-white/5 rounded-xl p-10 text-center">
        <div className="text-gray-400 font-mono text-sm mb-2">NO ROUTES IN MATRIX</div>
        <div className="text-gray-500 text-xs">
          Adjust intake parameters or seed the universities catalog, then re-run.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {tiers.map(tier => {
        const list = grouped[tier]
        if (!list || list.length === 0) return null
        const cfg = TIER_CONFIG[tier]
        return (
          <section key={tier}>
            <div className="flex items-baseline gap-3 mb-4">
              <h3 className={`text-xs font-mono font-bold tracking-[0.2em] ${cfg.accent}`}>
                {cfg.label} ROUTES
              </h3>
              <span className="text-[10px] font-mono text-gray-500">/ {cfg.desc}</span>
              <span className="ml-auto text-[10px] font-mono text-gray-500">
                {list.length} PATH{list.length !== 1 ? 'S' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {list.map(r => (
                <RouteCard
                  key={r.id}
                  route={{ ...r, userBudget }}
                  tier={tier}
                  tierConfig={cfg}
                  isBestMatch={r.id === bestId}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

/* ==============================
   COMPARE PANEL (inlined)
   ============================== */
const ComparePanel = ({ routes }) => {
  const [selectedIds, setSelectedIds] = useState([])
  const [compareRoutes, setCompareRoutes] = useState([])
  const [showPanel, setShowPanel] = useState(false)

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id].slice(0, 3)
    )
  }

  const handleCompare = () => {
    const selected = routes.filter(r => selectedIds.includes(r.id))
    setCompareRoutes(selected)
  }

  const clearComparison = () => {
    setCompareRoutes([])
    setSelectedIds([])
  }

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="px-4 py-2 bg-brand-copper/10 border border-brand-copper/30 text-brand-copper rounded-lg text-sm font-medium hover:bg-brand-copper/20 transition-all"
      >
        <i className="fa-solid fa-code-compare mr-2"></i>
        Compare Routes
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#0F172A] border border-white/10 rounded-xl p-6 max-w-5xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Compare Routes (up to 3)</h2>
          <div className="flex gap-3">
            <button
              onClick={handleCompare}
              disabled={selectedIds.length < 2}
              className="px-4 py-2 bg-brand-copper text-white rounded-lg text-sm font-medium disabled:opacity-50"
            >
              Compare ({selectedIds.length})
            </button>
            {compareRoutes.length > 0 && (
              <button onClick={clearComparison} className="px-4 py-2 border border-white/10 text-gray-400 rounded-lg text-sm hover:text-white">
                Clear
              </button>
            )}
            <button onClick={() => setShowPanel(false)} className="px-4 py-2 border border-white/10 text-gray-400 rounded-lg text-sm hover:text-white">
              Close
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto mb-4">
          {routes.map(route => (
            <div
              key={route.id}
              onClick={() => toggleSelect(route.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                selectedIds.includes(route.id)
                  ? 'border-brand-copper bg-brand-copper/10'
                  : 'border-white/10 bg-[#0A0F1C] hover:border-white/20'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold text-xs">{route.university}</h3>
                  <p className="text-gray-400 text-[10px]">{route.program}</p>
                  <p className="text-gray-500 text-[8px] font-mono">{route.country}</p>
                </div>
                <span className={`text-sm font-mono font-bold ${
                  route.tier === 'safe' ? 'text-green-400' : route.tier === 'moderate' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {route.feasibility}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {compareRoutes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Metric</th>
                  {compareRoutes.map(r => (
                    <th key={r.id} className="text-left py-2 px-3 text-white font-semibold">{r.university}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-2 px-3 text-gray-400">Program</td>
                  {compareRoutes.map(r => <td key={r.id} className="py-2 px-3 text-white">{r.program}</td>)}
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-400">Country</td>
                  {compareRoutes.map(r => <td key={r.id} className="py-2 px-3 text-white">{r.country}</td>)}
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-400">Feasibility</td>
                  {compareRoutes.map(r => (
                    <td key={r.id} className={`py-2 px-3 font-mono font-bold ${
                      r.feasibility >= 80 ? 'text-green-400' : r.feasibility >= 60 ? 'text-amber-400' : 'text-red-400'
                    }`}>{r.feasibility}%</td>
                  ))}
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-400">Total Cost</td>
                  {compareRoutes.map(r => <td key={r.id} className="py-2 px-3 text-white font-mono">₹{(r.total_cost/100000).toFixed(1)}L</td>)}
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-400">PR Timeline</td>
                  {compareRoutes.map(r => <td key={r.id} className="py-2 px-3 text-white font-mono">{r.pr_timeline} months</td>)}
                </tr>
                <tr>
                  <td className="py-2 px-3 text-gray-400">ROI Vector</td>
                  {compareRoutes.map(r => <td key={r.id} className="py-2 px-3 text-orange-400 font-mono">{r.roi_vector}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

/* ==============================
   DASHBOARD PAGE – Supabase direct fetch
   ============================== */
const DashboardPage = () => {
  const { user } = useAuth()
  const [intakeData, setIntakeData] = useState(null)
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      if (!user) return
      try {
        // Fetch intake
        const { data: intake } = await supabase.from('intake_data').select('*').eq('user_id', user.id).single()
        if (!cancelled) setIntakeData(intake || { budget: 1500000, cgpa: 8.0, targetRole: 'Engineering', degreeLevel: 'Masters', fieldOfStudy: 'AI & Big Data', backlogs: 0 })

        // Fetch routes directly from Supabase
        const { data: routesData, error: routesError } = await supabase
          .from('routes')
          .select('*')
          .eq('user_id', user.id)
          .order('feasibility', { ascending: false })

        if (routesError) throw routesError
        if (!cancelled) setRoutes(routesData || [])
      } catch (err) {
        console.error('Dashboard fetch error:', err)
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => { cancelled = true }
  }, [user])

  const avgFeasibility = routes.length
    ? Math.round(routes.reduce((sum, r) => sum + (r.feasibility || 0), 0) / routes.length)
    : 0
  const systemStatus = routes.length > 0 ? 'ACTIVE' : 'NO ROUTES'

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A0F1C] pt-24 flex items-center justify-center">
          <div className="text-gray-400 font-mono text-sm">LOADING ROUTE MATRIX...</div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A0F1C] pt-24 flex items-center justify-center">
          <div className="text-red-400 font-mono text-sm">ERROR: {error}</div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0F1C] pt-24 pb-6 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/intake" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors group">
              <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
              <span className="font-mono">← BACK TO INTAKE</span>
            </Link>
            <div className="flex items-center gap-4">
              <ComparePanel routes={routes} />
              <div className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full ${routes.length > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-gray-500">{systemStatus}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 mb-8">
            <ConstraintHUD data={intakeData} />
            <FeasibilityGauge score={avgFeasibility} />
          </div>

          <RouteMatrix routes={routes} intakeData={intakeData} />
        </div>
      </div>
    </>
  )
}

export default DashboardPage