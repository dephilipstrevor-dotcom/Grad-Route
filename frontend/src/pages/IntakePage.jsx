import { useState, useCallback, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { debounce } from 'lodash'

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
   MODULE PANEL
   ============================== */
const ModulePanel = ({ title, icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-white/10 rounded-xl bg-[#0F172A] overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors border-b border-white/10"
      >
        <div className="flex items-center gap-3">
          <span className="text-brand-copper text-base">{icon}</span>
          <span className="font-semibold tracking-wide text-sm text-white">{title}</span>
        </div>
        <i className={`fa-solid fa-chevron-down text-gray-500 text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}></i>
      </button>
      
      <div className={`px-5 py-5 space-y-5 ${isOpen ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  )
}

/* ==============================
   LIVE HUD
   ============================== */
const LiveHUD = ({ formData, hudData }) => {
  const { cgpa, budget, backlogs, ielts, fieldOfStudy } = formData
  const { count = 0, feasibility = 0 } = hudData || {}

  const getGPAStatus = () => {
    if (!cgpa) return { text: 'AWAITING INPUT', color: 'text-gray-400', accent: 'border-gray-700' }
    if (cgpa >= 8.5) return { text: 'ELITE TIER', color: 'text-green-400', accent: 'border-green-500' }
    if (cgpa >= 7.5) return { text: 'STRONG', color: 'text-blue-400', accent: 'border-blue-500' }
    if (cgpa >= 6.5) return { text: 'STANDARD', color: 'text-yellow-400', accent: 'border-yellow-500' }
    return { text: 'LOW GPA', color: 'text-red-400', accent: 'border-red-500' }
  }

  const getBudgetStatus = () => {
    if (!budget) return { text: 'AWAITING BUDGET', color: 'text-gray-400', accent: 'border-gray-700' }
    if (budget >= 3500000) return { text: 'PREMIUM', color: 'text-green-400', accent: 'border-green-500' }
    if (budget >= 2000000) return { text: 'EU+CANADA', color: 'text-blue-400', accent: 'border-blue-500' }
    if (budget >= 1000000) return { text: 'GERMANY OPTIMAL', color: 'text-brand-copper', accent: 'border-brand-copper' }
    return { text: 'CONSTRAINED', color: 'text-red-400', accent: 'border-red-500' }
  }

  const getBacklogStatus = () => {
    if (backlogs === undefined || backlogs === null) return { text: 'PENDING', color: 'text-gray-400', accent: 'border-gray-700' }
    if (backlogs === 0) return { text: 'CLEAN', color: 'text-green-400', accent: 'border-green-500' }
    if (backlogs <= 2) return { text: 'MINOR BACKLOGS', color: 'text-yellow-400', accent: 'border-yellow-500' }
    return { text: 'HIGH RISK', color: 'text-red-400', accent: 'border-red-500' }
  }

  const getEnglishStatus = () => {
    if (!ielts) return { text: 'IELTS REQUIRED', color: 'text-gray-400', accent: 'border-gray-700' }
    if (ielts >= 7.0) return { text: 'THRESHOLD MET', color: 'text-green-400', accent: 'border-green-500' }
    return { text: 'IMPROVE SCORE', color: 'text-yellow-400', accent: 'border-yellow-500' }
  }

  const gpaStatus = getGPAStatus()
  const budgetStatus = getBudgetStatus()
  const backlogStatus = getBacklogStatus()
  const englishStatus = getEnglishStatus()

  return (
    <div className="bg-[#0A0F1C] border border-white/10 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Live Analysis</span>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-[10px] font-mono text-gray-400 tracking-wider">LIVE</span>
        </div>
      </div>

      <div className="space-y-5 font-mono">
        <div className={`border-l-2 ${gpaStatus.accent} pl-3`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-xs font-medium">ACADEMIC_VECTOR</p>
              <p className={`text-[11px] font-bold ${gpaStatus.color}`}>{gpaStatus.text}</p>
            </div>
            {cgpa && <span className="text-sm text-brand-copper font-bold">{cgpa}</span>}
          </div>
        </div>

        <div className={`border-l-2 ${budgetStatus.accent} pl-3`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-xs font-medium">FINANCIAL_VECTOR</p>
              <p className={`text-[11px] font-bold ${budgetStatus.color}`}>{budgetStatus.text}</p>
            </div>
            {budget && <span className="text-sm text-brand-copper font-bold">₹{(budget/100000).toFixed(1)}L/yr</span>}
          </div>
        </div>

        <div className={`border-l-2 ${backlogStatus.accent} pl-3`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-xs font-medium">BACKLOG_CHECK</p>
              <p className={`text-[11px] font-bold ${backlogStatus.color}`}>{backlogStatus.text}</p>
            </div>
            {backlogs !== undefined && backlogs !== null && (
              <span className="text-sm text-white font-bold">{backlogs}</span>
            )}
          </div>
        </div>

        <div className={`border-l-2 ${englishStatus.accent} pl-3`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-xs font-medium">LANGUAGE</p>
              <p className={`text-[11px] font-bold ${englishStatus.color}`}>{englishStatus.text}</p>
            </div>
            {ielts && <span className="text-sm text-white font-bold">{ielts}</span>}
          </div>
        </div>

        {fieldOfStudy && (
          <div className="border-l-2 border-brand-copper pl-3">
            <div>
              <p className="text-white text-xs font-medium">CAREER_VECTOR</p>
              <p className="text-[11px] text-gray-300 font-bold">{fieldOfStudy}</p>
            </div>
          </div>
        )}

        <div className="mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-600">Feasibility</span>
            <div className="flex items-center gap-3">
              <span className="text-white font-mono font-bold">{feasibility}%</span>
              <span className="text-[10px] text-gray-500">{count} matches</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==============================
   LOADING SEQUENCE
   ============================== */
const LoadingSequence = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const messages = [
    'Initializing constraint solver...',
    'Filtering 5,000+ global programs...',
    'Verifying PR timelines...',
    'Calculating budget deltas...',
    'Generating optimal routes...'
  ]

  useEffect(() => {
    let timeout
    const advanceStep = () => {
      setStep(prev => {
        const next = prev + 1
        if (next < messages.length) {
          timeout = setTimeout(advanceStep, 400)
        } else if (next === messages.length) {
          timeout = setTimeout(onComplete, 300)
        }
        return next
      })
    }
    timeout = setTimeout(advanceStep, 400)
    return () => clearTimeout(timeout)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]">
      <div className="bg-[#0f172a] border border-brand-copper/30 rounded-xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-brand-copper/20 flex items-center justify-center">
            <i className="fa-solid fa-microchip text-brand-copper"></i>
          </div>
          <span className="text-white font-mono text-sm uppercase tracking-widest">Engine Execution</span>
        </div>
        
        <div className="space-y-3 font-mono text-sm">
          {messages.slice(0, step).map((msg, i) => (
            <div key={i} className="flex items-center gap-2 text-green-400">
              <i className="fa-solid fa-check text-xs"></i>
              <span className="text-[#cbd5e1]">{msg}</span>
            </div>
          ))}
          {step < messages.length && (
            <div className="flex items-center gap-2 text-brand-copper">
              <i className="fa-solid fa-spinner fa-spin text-xs"></i>
              <span>{messages[step]}</span>
            </div>
          )}
        </div>
        
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div  
              className="h-full bg-gradient-to-r from-brand-copper to-orange-400 transition-all duration-400"
              style={{ width: `${(step / messages.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ==============================
   COUNTRY PILL TOGGLES
   ============================== */
const CountryToggles = ({ selected, onChange }) => {
  const countries = ['Germany', 'USA', 'UK', 'Canada', 'Australia', 'Netherlands', 'Sweden', 'Singapore']

  const toggle = (country) => {
    const updated = selected.includes(country)
      ? selected.filter(c => c !== country)
      : [...selected, country]
    onChange(updated)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {countries.map(country => (
        <button
          key={country}
          type="button"
          onClick={() => toggle(country)}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
            selected.includes(country)
              ? 'bg-brand-copper/20 border-brand-copper text-brand-copper'
              : 'bg-transparent border-white/10 text-gray-400 hover:border-white/30'
          }`}
        >
          {country}
        </button>
      ))}
    </div>
  )
}

/* ==============================
   INTAKE FORM
   ============================== */
const IntakeForm = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    degreeLevel: 'Masters',
    fieldOfStudy: '',
    cgpa: '',
    backlogs: '',
    ielts: '',
    budget: '',
    targetCountries: [],
    maxDuration: null,
    fastTrackPR: false
  })

  const [hudData, setHudData] = useState({ count: 0, feasibility: 0 })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    let processedValue = value
    if (type === 'number') {
      processedValue = value === '' ? '' : Number(value)
    }
    if (type === 'checkbox') processedValue = checked
    setFormData(prev => ({ ...prev, [name]: processedValue }))
  }

  const setTargetCountries = (countries) => {
    setFormData(prev => ({ ...prev, targetCountries: countries }))
  }

  const handleExecute = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const coreIntake = {
        degreeLevel: formData.degreeLevel,
        fieldOfStudy: formData.fieldOfStudy,
        cgpa: formData.cgpa,
        backlogs: formData.backlogs,
        ielts: formData.ielts,
        budget: formData.budget
      }

      const { error: intakeError } = await supabase
        .from('intake_data')
        .upsert({ user_id: user.id, ...coreIntake }, { onConflict: 'user_id' })

      if (intakeError) {
        console.error('Failed to save intake:', intakeError)
        setIsLoading(false)
        return
      }

      const token = (await supabase.auth.getSession()).data.session?.access_token
      const response = await fetch(`${API_BASE_URL}/routes/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate routes')
      }

      // ✅ Only navigate after success
      setIsLoading(false)
      navigate('/dashboard')
    } catch (error) {
      console.error('Route generation failed:', error)
      setIsLoading(false)
    }
  }

  const isFormValid = () => formData.cgpa && formData.budget && formData.fieldOfStudy

  const fetchEvaluation = async (data) => {
    if (!data.cgpa || !data.budget || !data.fieldOfStudy) return
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch(`${API_BASE_URL}/intake/evaluate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      })
      if (res.ok) {
        const result = await res.json()
        setHudData(result)
      }
    } catch (err) {
      console.error('Evaluation failed:', err)
    }
  }

  const debouncedEvaluate = useCallback(debounce(fetchEvaluation, 1500), [])

  useEffect(() => {
    debouncedEvaluate(formData)
    return () => debouncedEvaluate.cancel()
  }, [formData, debouncedEvaluate])

  return (
    <>
      <form onSubmit={handleExecute} className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_320px] gap-6">

          <div className="hidden lg:block">
            <div className="sticky top-32">
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-600">Progress</span>
              </div>
              <div className="border-l border-white/10 pl-4 space-y-0">
                {['Academic', 'Financial', 'Target'].map((step, i) => (
                  <div key={i} className="relative py-2">
                    <div className="absolute -left-[21px] top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 rounded-full border border-gray-700"></div>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <ModulePanel title="Academic Baseline" icon={<i className="fa-solid fa-graduation-cap"></i>} defaultOpen={true}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Degree Level</label>
                  <select name="degreeLevel" value={formData.degreeLevel} onChange={handleChange} disabled className="w-full px-4 py-3 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm opacity-70">
                    <option value="Masters">Master's</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Field of Study / Target Role</label>
                  <select name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} className="w-full px-4 py-3 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none" required>
                  <option value="">Select your domain</option>
                  <option value="AI & Big Data">AI & Big Data</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Tech Management">Tech Management</option>
                  <option value="Core Engineering">Core Engineering</option>
                  <option value="Systems & Computer Architecture">Systems & Computer Architecture</option>
                  <option value="Robotics & Embedded Systems">Robotics & Embedded Systems</option>
                  <option value="Cloud & Distributed Computing">Cloud & Distributed Computing</option>
                  <option value="Human-Computer Interaction (HCI)">Human-Computer Interaction (HCI)</option>
                  </select>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">CGPA <span className="text-brand-copper">*</span></label>
                  <input type="number" name="cgpa" value={formData.cgpa} onChange={handleChange} step="0.01" min="0" max="10" placeholder="8.25" className="w-full px-4 py-3 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" required />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Backlogs</label>
                  <input type="number" name="backlogs" value={formData.backlogs} onChange={handleChange} step="1" min="0" placeholder="0" className="w-full px-4 py-3 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">IELTS Score</label>
                  <input type="number" name="ielts" value={formData.ielts} onChange={handleChange} step="0.5" min="0" max="9" placeholder="7.0" className="w-full px-4 py-2.5 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" />
                </div>
              </div>
            </ModulePanel>

            <ModulePanel title="Financial Reality" icon={<i className="fa-solid fa-wallet"></i>}>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Budget per Year (INR) <span className="text-brand-copper">*</span></label>
                  <input type="number" name="budget" value={formData.budget} onChange={handleChange} min="500000" step="100000" placeholder="1,500,000" className="w-full px-4 py-3 rounded-lg bg-[#0A0F1C] border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-700" required />
                  {formData.budget && (
                    <p className="text-[10px] text-brand-copper mt-1 font-mono">
                      ≈ ₹{(formData.budget / 100000).toFixed(1)} Lakhs per year
                    </p>
                  )}
                </div>
              </div>
            </ModulePanel>

            <ModulePanel title="Precision Enhancers" icon={<i className="fa-solid fa-sliders"></i>}>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Target Country</label>
                  <CountryToggles selected={formData.targetCountries} onChange={setTargetCountries} />
                </div>

                <div>
                  <label className="block text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em] mb-2">Max Duration</label>
                  <div className="flex gap-4">
                    {['12', '24', 'Any'].map(opt => (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="maxDuration"
                          value={opt === 'Any' ? '' : opt}
                          checked={opt === 'Any' ? formData.maxDuration === null : formData.maxDuration === Number(opt)}
                          onChange={() => setFormData(prev => ({ ...prev, maxDuration: opt === 'Any' ? null : Number(opt) }))}
                          className="text-brand-copper focus:ring-brand-copper/20"
                        />
                        <span className="text-xs text-gray-300 font-mono">
                          {opt === 'Any' ? 'Any' : `${opt} Months`}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-[0.15em]">Prioritize Fast‑Track PR</p>
                    <p className="text-[8px] text-gray-600">Only show routes with PR &lt; 4 years</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="fastTrackPR"
                      checked={formData.fastTrackPR}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-700 peer-focus:ring-1 peer-focus:ring-brand-copper rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-brand-copper after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                  </label>
                </div>
              </div>
            </ModulePanel>

            <div className="pt-6 flex items-center justify-end gap-4">
              <button type="button" onClick={() => navigate('/dashboard')} className="px-6 py-3.5 rounded-xl bg-transparent border border-white/10 text-gray-400 text-sm font-medium hover:text-white hover:border-white/20 hover:bg-white/5 transition-all">
                Save Draft
              </button>
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`group relative px-12 py-3.5 rounded-xl font-bold text-white text-sm uppercase tracking-[0.2em] transition-all duration-300 overflow-hidden ${
                  isFormValid()
                    ? 'bg-gradient-to-r from-brand-copper via-orange-500 to-brand-copper bg-[length:200%_100%] hover:bg-right shadow-[0_0_20px_rgba(224,93,54,0.5)] hover:shadow-[0_0_30px_rgba(224,93,54,0.8)] hover:scale-[1.02] cursor-pointer'
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                }`}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative z-10 flex items-center gap-3">
                  Execute Engine
                  <i className="fa-solid fa-play text-xs group-hover:translate-x-1 transition-transform"></i>
                </span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <LiveHUD formData={formData} hudData={hudData} />
            </div>
          </div>
        </div>
      </form>

      {isLoading && <LoadingSequence onComplete={() => {}} />}
    </>
  )
}

const IntakePage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#020617] pt-24 pb-6 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_320px] gap-6 mb-6">
            <div className="hidden lg:block">
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-all duration-200 group"
              >
                <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
                <span>Back to dashboard</span>
              </Link>
            </div>
            <div className="lg:col-span-2 flex items-center justify-between">
              <Link 
                to="/dashboard" 
                className="lg:hidden inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-all duration-200 group"
              >
                <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
                <span>Back</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_320px] gap-6 mb-8">
            <div className="hidden lg:block"></div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-brand-copper/10 border border-brand-copper/30 mb-4">
                <span className="w-2 h-2 rounded-full bg-brand-copper animate-pulse"></span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-copper">Intake Engine v1.0</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
                Configure Your <span className="text-brand-copper">Parameters</span>
              </h1>
              <p className="text-[#94a3b8] text-sm max-w-2xl leading-relaxed">
                Feed the system your 9 hard constraints. The engine will mathematically eliminate unviable routes and surface only what's feasible.
              </p>
            </div>
            <div className="hidden lg:block"></div>
          </div>

          <IntakeForm />
        </div>
      </div>
    </>
  )
}

export default IntakePage