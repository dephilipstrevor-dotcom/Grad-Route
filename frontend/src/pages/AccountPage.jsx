import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabaseClient'

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
   ACCOUNT PAGE
   ============================== */
const AccountPage = () => {
  const { user } = useAuth()
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savedRoutes, setSavedRoutes] = useState([])
  const [intakeData, setIntakeData] = useState(null)
  const [removingId, setRemovingId] = useState(null) // track which route is being removed

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: routesData } = await supabase
          .from('routes')
          .select('*')
          .eq('user_id', user.id)
          .eq('saved', true)
        setSavedRoutes(routesData || [])

        const { data: intake } = await supabase
          .from('intake_data')
          .select('*')
          .eq('user_id', user.id)
          .single()
        setIntakeData(intake)
      } catch (err) {
        console.error('Failed to fetch account data:', err)
      }
    }
    if (user) fetchUserData()
  }, [user])

  const handleResetPassword = async () => {
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    if (!error) setResetEmailSent(true)
    setLoading(false)
  }

  // Unsave (remove) a route from the saved list
  const handleRemoveSaved = async (routeId) => {
    setRemovingId(routeId)
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch(`${API_BASE_URL}/routes/${routeId}/saved`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ saved: false })
      })
      if (res.ok) {
        // Remove from local state
        setSavedRoutes(prev => prev.filter(r => r.id !== routeId))
      }
    } catch (err) {
      console.error('Failed to remove saved route:', err)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0F1C] pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors group mb-8">
            <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
            <span className="font-mono tracking-wider">← BACK TO DASHBOARD</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile & Security */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Profile</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                    <p className="text-white font-mono text-sm">{user?.email}</p>
                  </div>
                  {intakeData && (
                    <>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mt-4">CGPA</p>
                        <p className="text-white font-mono">{intakeData.cgpa}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Budget</p>
                        <p className="text-white font-mono">₹{(intakeData.budget / 100000).toFixed(1)}L</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Target Role</p>
                        <p className="text-white font-mono">{intakeData.targetRole || '—'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Security</h2>
                {resetEmailSent ? (
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 text-sm">Reset link sent to your email.</p>
                  </div>
                ) : (
                  <button
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-brand-copper/10 border border-brand-copper/30 text-brand-copper rounded-lg text-sm font-medium hover:bg-brand-copper/20 transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Password Reset Email'}
                  </button>
                )}
              </div>
            </div>

            {/* Right Column - Saved Routes */}
            <div className="lg:col-span-2">
              <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
                <h2 className="text-lg font-bold text-white mb-4">Saved Routes</h2>
                {savedRoutes.length === 0 ? (
                  <p className="text-gray-400 text-sm">No saved routes yet. Click the bookmark icon on any route card to save it.</p>
                ) : (
                  <div className="space-y-3">
                    {savedRoutes.map(route => (
                      <div key={route.id} className="flex items-center justify-between bg-[#0A0F1C] border border-white/5 rounded-lg p-4 hover:border-white/10 transition-all">
                        <Link to={`/report/${route.id}`} className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold truncate">{route.university}</h3>
                          <p className="text-gray-400 text-xs truncate">{route.program}</p>
                          <p className="text-gray-500 text-[10px] font-mono mt-1">{route.country}</p>
                        </Link>
                        <div className="flex items-center gap-3 ml-4">
                          <span className={`text-sm font-mono font-bold flex-shrink-0 ${route.tier === 'safe' ? 'text-green-400' : route.tier === 'moderate' ? 'text-amber-400' : 'text-red-400'}`}>
                            {route.feasibility}%
                          </span>
                          {/* Delete button – inline SVG trash icon */}
                          <button
                            onClick={() => handleRemoveSaved(route.id)}
                            disabled={removingId === route.id}
                            className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0"
                            title="Remove from saved"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AccountPage