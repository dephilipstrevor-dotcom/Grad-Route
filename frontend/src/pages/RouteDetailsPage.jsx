import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'
import { exportRouteToPDF } from '../utils/exportPDF'

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
   TARGET LOCK
   ============================== */
const TargetLock = ({ route }) => {
  const getMatchColor = (score) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-amber-500'
    return 'text-red-500'
  }

  const circumference = 2 * Math.PI * 45
  const offset = circumference - (route.feasibility / 100) * circumference

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            {route.university}
          </h1>
          <p className="text-gray-300 text-lg mb-1">{route.program}</p>
          <p className="text-gray-500 font-mono text-sm tracking-wider">{route.country}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="4" />
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke={route.feasibility >= 80 ? '#22c55e' : route.feasibility >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-mono font-bold ${getMatchColor(route.feasibility)}`}>
                {route.feasibility}%
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Feasibility Lock</p>
            <p className="text-xs text-gray-400">Match Confidence</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==============================
   ADMISSIONS CHECKLIST
   ============================== */
const AdmissionsChecklist = ({ route, userData }) => {
  const requirements = [
    {
      label: 'CGPA Requirement',
      required: 8.0,
      actual: userData.cgpa,
      status: userData.cgpa >= 8.0 ? 'cleared' : 'pending',
      message: userData.cgpa >= 8.0 
        ? `Your ${userData.cgpa} CGPA clears the historical 8.0 cutoff.` 
        : `Requires minimum 8.0 CGPA.`
    },
    {
      label: 'IELTS / English Proficiency',
      required: 6.5,
      actual: userData.ielts,
      status: userData.ielts ? (userData.ielts >= 6.5 ? 'cleared' : 'warning') : 'pending',
      message: userData.ielts 
        ? (userData.ielts >= 6.5 ? 'Language requirement satisfied.' : 'Score below threshold.')
        : 'IELTS 6.5 minimum required. You are currently marked as "Awaiting Test".'
    },
    {
      label: 'Aptitude Multiplier',
      required: 'GRE/GATE',
      actual: userData.gre,
      status: userData.gre ? 'multiplier' : 'pending',
      message: userData.gre 
        ? `Your GRE score of ${userData.gre} provides a 15% edge in final portfolio review.`
        : 'No standardized test score provided.'
    }
  ]

  const statusConfig = {
    cleared: { icon: 'fa-check-circle', color: 'text-green-500', border: 'border-green-500/20' },
    warning: { icon: 'fa-exclamation-triangle', color: 'text-amber-500', border: 'border-amber-500/20' },
    pending: { icon: 'fa-clock', color: 'text-gray-400', border: 'border-gray-500/20' },
    multiplier: { icon: 'fa-bolt', color: 'text-blue-400', border: 'border-blue-500/20' }
  }

  return (
    <div>
      <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">
        System Validation
      </h2>
      <div className="space-y-3">
        {requirements.map((req, idx) => {
          const config = statusConfig[req.status]
          return (
            <div key={idx} className={`border ${config.border} rounded-lg p-4 bg-transparent`}>
              <div className="flex items-start gap-3">
                <i className={`fa-solid ${config.icon} ${config.color} text-sm mt-0.5`}></i>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-mono text-sm">{req.label}</span>
                    <span className="text-[10px] font-mono text-gray-400">
                      Required: {typeof req.required === 'number' ? req.required : req.required}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs leading-relaxed">{req.message}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ==============================
   FINANCIAL LEDGER
   ============================== */
const FinancialLedger = ({ route, userData }) => {
  const ledgerItems = [
    { label: 'Tuition Fees', amount: route.tier === 'safe' ? 0 : 1500000 },
    { label: 'Blocked Account / Living Costs', amount: 1000000 },
    { label: 'Semester Contribution', amount: 30000 },
    { label: 'Health Insurance', amount: 90000 }
  ]

  const totalCost = ledgerItems.reduce((sum, item) => sum + item.amount, 0)
  const partTimeIncome = 800000
  const netCost = totalCost - partTimeIncome
  const budgetDelta = netCost - userData.budget

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
      <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">
        Financial Arbitrage
      </h2>

      <div className="mb-5">
        <div className="grid grid-cols-2 text-[10px] font-mono uppercase tracking-wider text-gray-500 pb-2 border-b border-white/5">
          <span>Item</span>
          <span className="text-right">Amount (₹)</span>
        </div>
        <div className="divide-y divide-white/5">
          {ledgerItems.map((item, idx) => (
            <div key={idx} className="grid grid-cols-2 py-2 text-sm">
              <span className="text-gray-300">{item.label}</span>
              <span className="text-right font-mono text-white">
                ₹{(item.amount / 100000).toFixed(1)}L
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Cost</span>
          <span className="font-mono text-white">₹{(totalCost / 100000).toFixed(1)}L</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Est. Part-time Income</span>
          <span className="font-mono text-green-400">- ₹{(partTimeIncome / 100000).toFixed(1)}L</span>
        </div>
        <div className="flex justify-between text-sm pt-2 border-t border-white/5">
          <span className="text-gray-300 font-medium">Net Requirement</span>
          <span className="font-mono text-white font-bold">₹{(netCost / 100000).toFixed(1)}L</span>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Budget Delta</span>
          <span className={`text-sm font-mono font-bold ${budgetDelta > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {budgetDelta > 0 ? '-' : '+'}₹{Math.abs(budgetDelta / 100000).toFixed(1)}L
          </span>
        </div>
        <div className="w-full h-1 bg-[#1e293b] rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${budgetDelta > 0 ? 'bg-red-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(100, (userData.budget / netCost) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}

/* ==============================
   ROI TRAJECTORY
   ============================== */
const ROITrajectory = () => {
  const data = [
    { month: 0, netWorth: -12.0, label: 'Day 1' },
    { month: 12, netWorth: -14.5, label: 'Y1 End' },
    { month: 24, netWorth: -11.2, label: 'Graduation' },
    { month: 28, netWorth: 0, label: 'Break‑even' },
    { month: 36, netWorth: 8.5, label: 'Y3 Work' },
    { month: 48, netWorth: 28.0, label: 'Y4 Work' },
    { month: 60, netWorth: 52.0, label: 'Y5 Work' },
  ]

  const formatTooltip = (value) => `₹${value.toFixed(1)}L`

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
      <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">
        5‑Year ROI Trajectory
      </h2>

      <div style={{ width: '100%', height: 250, minWidth: 300, minHeight: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#64748b" 
              tick={{ fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(value) => ['Day 1','','','','','Y2','','','','','Y3','','','','','Y4','','','','','Y5'][value/3] || ''}
            />
            <YAxis stroke="#64748b" tick={{ fontSize: 10, fontFamily: 'monospace' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0F172A', border: '1px solid #334155', borderRadius: '8px', fontFamily: 'monospace' }}
              formatter={(value) => [formatTooltip(value), 'Net Worth']}
            />
            <ReferenceLine y={0} stroke="#334155" strokeDasharray="3 3" />
            <Line type="monotone" dataKey="netWorth" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 3 }} activeDot={{ r: 5 }} />
            <ReferenceLine x={28} stroke="#f97316" strokeWidth={2} label={{ value: 'BREAK‑EVEN', position: 'top', fill: '#f97316', fontSize: 9, fontFamily: 'monospace', fontWeight: 'bold' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex justify-between text-[10px] font-mono text-gray-500">
        <span>Investment Phase (Red)</span>
        <span className="text-green-400">Profit Phase (Green)</span>
        <span>Break‑even: Month 28</span>
      </div>
    </div>
  )
}

/* ==============================
   LLM INSIGHT
   ============================== */
const LLMInsight = ({ route, userData }) => {
  const totalCost = route.total_cost || 0
  const userBudget = userData?.budget || 1500000
  const delta = totalCost - userBudget
  const absDeltaLakh = Math.abs(delta / 100000).toFixed(1)
  const isDeficit = delta > 0

  const baseWageEUR = {
    'Germany': 14,
    'Netherlands': 15,
    'Canada': 16,
    'United States': 18,
    'United Kingdom': 12,
    'Australia': 20,
    'Ireland': 14,
    'Sweden': 13,
    'Singapore': 15,
    'Switzerland': 25,
    'Austria': 14,
    'Italy': 12,
    'Spain': 11,
    'France': 13,
    'Denmark': 18,
    'Finland': 15,
    'Norway': 19,
    'New Zealand': 16,
    'Hong Kong (SAR)': 14,
    'Malaysia': 8,
    'Turkey': 7,
    'China': 10,
    'Israel': 15,
    'Portugal': 10,
    'Lithuania': 9,
    'Uzbekistan': 5,
    'United Arab Emirates': 12,
    'Hungary': 8,
    'Malta': 10,
    'Czech Republic': 9,
    'Thailand': 6,
    'South Africa': 8,
    'India': 6,
    'Pakistan': 5,
    'Ukraine': 7,
    'Northern Cyprus': 6,
    'Kazakhstan': 5,
    'Saudi Arabia': 11,
    'Brazil': 7,
    'Mexico': 8,
    'Argentina': 6,
    'Colombia': 6,
    'Chile': 8,
    'Peru': 6,
    'Japan': 15,
    'South Korea': 13,
    'Bangladesh': 4,
    'Egypt': 5,
    'Nigeria': 6,
    'Kenya': 6,
  }
  const hourlyEur = baseWageEUR[route.country] || 10
  const monthsToBreakeven = isDeficit ? Math.ceil(delta / (hourlyEur * 80 * 90)) : 0

  return (
    <div className="bg-gradient-to-br from-[#0F172A] to-[#0A0F1C] border border-orange-500/20 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-6 h-6 rounded bg-orange-500/20 flex items-center justify-center">
          <i className="fa-solid fa-robot text-orange-400 text-xs"></i>
        </div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400">LLM Insight</span>
      </div>

      {isDeficit ? (
        <p className="text-gray-200 text-sm leading-relaxed">
          System detects a <span className="text-red-400 font-mono font-bold">-₹{absDeltaLakh} Lakh</span> deficit.
          This is <span className="text-green-400">manageable</span>. A standard 20hr/week
          <span className="text-orange-400"> part‑time</span> role in {userData?.targetRole || route.roi_vector}
          {' '}can offset this gap within <span className="font-mono text-white">{monthsToBreakeven} months</span> at ~€{hourlyEur}/hr.
        </p>
      ) : (
        <p className="text-gray-200 text-sm leading-relaxed">
          Your budget <span className="text-green-400">covers the total cost</span> of this program.
          No deficit detected. Any part‑time income becomes direct savings.
        </p>
      )}

      <div className="mt-4 pt-4 border-t border-white/5">
        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-2">Recommended Action</p>
        <p className="text-gray-300 text-xs leading-relaxed">
          {isDeficit
            ? `Apply for student jobs 3 months before arrival.`
            : `Focus on securing internships and building your professional network in ${route.country}.`}
        </p>
      </div>
    </div>
  )
}

/* ==============================
   PR TIMELINE
   ============================== */
const PRTimeline = ({ route }) => {
  const studyMonths = route.duration_months || 24
  const totalPR = route.pr_timeline || 48
  const postStudyMonths = Math.max(0, totalPR - studyMonths)

  const phases = [
    { label: 'Arrival & Enrolment', duration: 'Day 1', color: 'border-gray-500', dot: 'bg-gray-500' },
    { label: 'Master\'s Program', duration: `${studyMonths} Months`, color: 'border-blue-500', dot: 'bg-blue-500' },
    { label: 'Post‑Study Work / Job Search', duration: `${postStudyMonths} Months`, color: 'border-amber-500', dot: 'bg-amber-500' },
    { label: 'Permanent Residency', duration: 'Eligible', color: 'border-green-500', dot: 'bg-green-500' }
  ]

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
      <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-6">
        PR Horizon · {route.country} Timeline
      </h2>

      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-white/10"></div>

        <div className="space-y-8">
          {phases.map((phase, idx) => (
            <div key={idx} className="relative flex items-start gap-6 pl-12">
              <div className={`absolute left-2 w-6 h-6 rounded-full border-2 ${phase.color} bg-[#0F172A] flex items-center justify-center shadow-[0_0_8px_rgba(249,115,22,0.2)]`}>
                <div className={`w-2 h-2 rounded-full ${phase.dot}`}>
                  {idx === phases.length - 1 && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-green-500 opacity-40"></span>
                  )}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="text-white font-mono text-sm font-bold">{phase.label}</h3>
                  <span className="text-xs font-mono text-gray-400">{phase.duration}</span>
                </div>
                {idx === 0 && <p className="text-gray-500 text-xs">Register at the university, secure accommodation.</p>}
                {idx === 1 && <p className="text-gray-500 text-xs">Complete coursework, thesis, and industrial internship.</p>}
                {idx === 2 && <p className="text-gray-500 text-xs">Work permit after graduation – find a qualified job.</p>}
                {idx === 3 && (
                  <p className="text-green-400 text-xs font-mono">
                    ✓ Eligible for permanent residency after {totalPR} months total stay.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between">
        <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Total to Settlement</span>
        <span className="font-mono text-white font-bold">~{totalPR} Months</span>
      </div>
    </div>
  )
}

/* ==============================
   TARGET OUTCOMES – dynamic salary
   ============================== */
const TargetOutcomes = ({ route, salaryRange }) => {
  const marketDemand = route.market_demand || 'Medium'

  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
      <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">
        Target Outcomes
      </h2>

      <div className="space-y-5">
        <div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Market Demand</div>
          <div className={`text-xl font-mono font-bold ${marketDemand.includes('High') || marketDemand.includes('Very High') ? 'text-green-500' : marketDemand.includes('Medium') ? 'text-amber-500' : 'text-red-500'}`}>
            {marketDemand}
          </div>
          <p className="text-gray-400 text-xs mt-1">Hiring velocity in {route.country} tech sector.</p>
        </div>

        <div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Career Vector</div>
          <div className="text-lg font-mono font-bold text-white">{route.roiVector || route.roi_vector}</div>
          <p className="text-gray-400 text-xs mt-1">
            Mission-Critical Backend • Low-Level Systems • Defense Tech
          </p>
        </div>

        <div>
          <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Salary Ceiling</div>
          <div className="text-xl font-mono font-bold text-orange-400">{salaryRange || 'N/A'}</div>
          <p className="text-gray-400 text-xs mt-1">Expected starting base compensation in {route.country}.</p>
        </div>
      </div>
    </div>
  )
}

/* ==============================
   DEPLOYMENT PROTOCOL
   ============================== */
const DeploymentProtocol = ({ route, userData }) => {
  const today = new Date()
  const thisYear = today.getFullYear()
  const nextFall = today.getMonth() < 6 ? thisYear : thisYear + 1
  const intake = `Fall ${nextFall}`
  const deadline = nextFall === thisYear ? `15th Jan ${thisYear}` : `15th Jan ${thisYear + 1}`
  const ieltsStatus = userData.ielts ? 'CLEARED' : 'AWAITING IELTS SCORE'

  return (
    <div className="bg-[#0F172A] border border-orange-500/20 rounded-xl p-6">
      <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400 mb-5">
        Deployment Protocol
      </h2>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Intake</span>
          <span className="text-white font-mono text-sm font-bold">{intake}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Application Deadline</span>
          <span className="text-white font-mono text-sm font-bold">{deadline}</span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-white/5">
          <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Status</span>
          <span className={`font-mono text-xs font-bold px-2 py-1 rounded ${userData.ielts ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
            {ieltsStatus}
          </span>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5">
          <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider mb-1">Next Action</p>
          <p className="text-gray-300 text-xs">
            {userData.ielts 
              ? 'Prepare statement of purpose and secure recommendation letters.' 
              : 'Schedule IELTS exam to meet language requirement.'}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ==============================
   ROUTE DETAILS PAGE
   ============================== */
const RouteDetailsPage = () => {
  const { routeId } = useParams()
  const { user } = useAuth()
  const [route, setRoute] = useState(null)
  const [userData, setUserData] = useState(null)
  const [salaryRange, setSalaryRange] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = (await supabase.auth.getSession()).data.session?.access_token
        const res = await fetch(`${API_BASE_URL}/routes/${routeId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const routeData = await res.json()
          setRoute(routeData)

          const roiVector = routeData.roiVector || routeData.roi_vector
          const country = routeData.country

          const { data: salaryData } = await supabase
            .from('salary_matrix')
            .select('min_salary, max_salary, currency')
            .eq('country', country)
            .eq('roiVector', roiVector)
            .maybeSingle()

          if (salaryData) {
            setSalaryRange(`${salaryData.currency} ${salaryData.min_salary.toLocaleString()} – ${salaryData.max_salary.toLocaleString()}`)
          }
        }

        const { data: intakeData } = await supabase
          .from('intake_data')
          .select('*')
          .eq('user_id', user.id)
          .single()
        setUserData({
          cgpa: intakeData?.cgpa || 8.0,
          ielts: intakeData?.ielts,
          gre: intakeData?.gre,
          budget: intakeData?.budget || 1500000,
          targetRole: intakeData?.targetRole || 'Systems Engineering'
        })
      } catch (err) {
        console.error('Failed to fetch route details:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [routeId, user])

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A0F1C] pt-24 flex items-center justify-center">
          <div className="text-gray-400 font-mono">LOADING...</div>
        </div>
      </>
    )
  }

  if (!route) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#0A0F1C] pt-24 flex items-center justify-center">
          <div className="text-gray-400 font-mono">ROUTE NOT FOUND</div>
        </div>
      </>
    )
  }

  const routeWithBudget = { ...route, userBudget: userData.budget }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0F1C] pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors group">
              <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
              <span className="font-mono tracking-wider">← ABORT TO MATRIX</span>
            </Link>

            <button
              onClick={() => exportRouteToPDF(route, userData, salaryRange)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-copper/10 border border-brand-copper/30 text-brand-copper text-sm font-medium rounded-lg hover:bg-brand-copper/20 transition-all"
            >
              <i className="fa-solid fa-file-pdf"></i>
              <span className="font-mono uppercase tracking-wider text-xs">EXPORT REPORT</span>
            </button>
          </div>

          <TargetLock route={route} />

          <div className="grid grid-cols-3 gap-6 mt-8 items-start">
            <div className="col-span-2 space-y-6">
              <AdmissionsChecklist route={route} userData={userData} />
              <FinancialLedger route={routeWithBudget} userData={userData} />
              <ROITrajectory />
            </div>
            <div className="col-span-1 space-y-6">
              <LLMInsight route={route} userData={userData} />
              <TargetOutcomes route={route} salaryRange={salaryRange} />
              <DeploymentProtocol route={route} userData={userData} />
            </div>
          </div>

          <div className="mt-16">
            <PRTimeline route={route} />
          </div>
        </div>
      </div>
    </>
  )
}

export default RouteDetailsPage