import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

/* ==============================
   PASSWORD STRENGTH LOGIC
   ============================== */
const passwordRules = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'One digit', test: (pw) => /[0-9]/.test(pw) },
]

const PasswordChecks = ({ password }) => {
  if (!password) return null
  return (
    <div className="mt-2 space-y-1">
      {passwordRules.map((rule, i) => {
        const passed = rule.test(password)
        return (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className={`w-3 h-3 rounded-full flex items-center justify-center ${passed ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-500'}`}>
              {passed ? '✓' : '✗'}
            </span>
            <span className={passed ? 'text-green-400' : 'text-gray-500'}>{rule.label}</span>
          </div>
        )
      })}
    </div>
  )
}

const isPasswordValid = (pw) => passwordRules.every(r => r.test(pw))

/* ==============================
   SOCIAL AUTH (Google)
   ============================== */
const SocialAuth = () => {
  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/intake' }
    })
  }

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-[#111827] px-4 text-gray-400 font-bold tracking-wider">Or continue with</span>
        </div>
      </div>
      <button onClick={handleGoogleSignIn} className="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 bg-white rounded-lg text-gray-700 font-medium text-sm hover:bg-gray-100 transition-colors border border-gray-200">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>
    </div>
  )
}

/* ==============================
   LOGIN FORM
   ============================== */
const LoginForm = ({ onToggle }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/intake')
    }
  }

  return (
    <div className="w-full">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-slate transition-all duration-200 group mb-4">
        <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
        <span>Back to home</span>
      </Link>

      <div className="bg-[#111827] border border-white/10 rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] p-6 md:p-7">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to access your precision routes</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-600" placeholder="you@example.com" required disabled={loading} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-600 pr-10"
                placeholder="••••••••"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 rounded border-gray-600 bg-transparent text-brand-copper focus:ring-brand-copper/20" disabled={loading} />
              <span className="text-xs text-gray-400">Remember for 30 days</span>
            </label>
            <Link to="/forgot-password" className="text-xs font-medium text-brand-copper hover:underline">Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-brand-copper to-orange-500 text-white font-bold rounded-lg transition-all duration-200 shadow-[0_8px_20px_rgba(224,93,54,0.3)] hover:shadow-[0_12px_30px_rgba(224,93,54,0.5)] hover:-translate-y-0.5 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <SocialAuth />

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <span className="flex items-center gap-1"><i className="fa-regular fa-clock text-xs"></i> 2 min</span>
          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
          <span>No spam</span>
          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
          <span>Instant results</span>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          New to GradRoute?{' '}
          <button onClick={onToggle} className="text-brand-copper font-bold hover:underline">Create an account</button>
        </p>
      </div>
    </div>
  )
}

/* ==============================
   SIGNUP FORM (with password constraints)
   ============================== */
const SignupForm = ({ onToggle }) => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isPasswordValid(password)) {
      setError('Please meet all password requirements.')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    if (data.user) {
      navigate('/intake')
    } else {
      setError('Account created. Check your inbox for the confirmation email, then sign in.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-slate transition-all duration-200 group mb-4">
        <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
        <span>Back to home</span>
      </Link>

      <div className="bg-[#111827] border border-white/10 rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.3)] p-6 md:p-7">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Get started</h1>
          <p className="text-gray-400 text-sm">Create your free account</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Full name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-600" placeholder="John Doe" required disabled={loading} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Email address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-600" placeholder="you@example.com" required disabled={loading} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none placeholder:text-gray-600 pr-10"
                placeholder="Create a strong password"
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
            <PasswordChecks password={password} />
          </div>
          <div className="flex items-start gap-2">
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 w-4 h-4 rounded border-gray-600 bg-transparent text-brand-copper focus:ring-brand-copper/20" required disabled={loading} />
            <span className="text-xs text-gray-400">I agree to the <a href="/terms" className="text-brand-copper hover:underline">Terms</a> and <a href="/privacy" className="text-brand-copper hover:underline">Privacy</a></span>
          </div>
          <button type="submit" disabled={loading || !isPasswordValid(password)} className="w-full py-3 bg-gradient-to-r from-brand-copper to-orange-500 text-white font-bold rounded-lg transition-all duration-200 shadow-[0_8px_20px_rgba(224,93,54,0.3)] hover:shadow-[0_12px_30px_rgba(224,93,54,0.5)] hover:-translate-y-0.5 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <SocialAuth />

        <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-gray-500">
          <span className="flex items-center gap-1"><i className="fa-regular fa-clock text-xs"></i> 2 min</span>
          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
          <span>No spam</span>
          <span className="w-1 h-1 rounded-full bg-gray-600"></span>
          <span>Instant results</span>
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          Already have an account?{' '}
          <button onClick={onToggle} className="text-brand-copper font-bold hover:underline">Sign in</button>
        </p>
      </div>
    </div>
  )
}

/* ==============================
   AUTH LAYOUT
   ============================== */
const AuthLayout = ({ children }) => {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-[#0A0F1C] via-[#111827] to-black relative overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-copper/20 blur-[140px] rounded-full"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/10 blur-[100px] rounded-full"></div>
        
        <div className="relative z-10 flex flex-col w-full p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
              {!imgError ? (
                <img 
                  src="/logo.svg" 
                  alt="GradRoute" 
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="40" height="40" rx="10" fill="#E05D36" fillOpacity="0.15"/>
                  <path d="M12 28V14L20 20L28 14V28H24V22.5L20 19.5L16 22.5V28H12Z" fill="#E05D36"/>
                </svg>
              )}
            </div>
            <span className="text-white font-bold tracking-tight text-2xl">GradRoute</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm">
              <svg className="w-full h-auto" viewBox="0 0 400 250" fill="none">
                <g>
                  <animateTransform attributeName="transform" type="rotate" from="0 200 125" to="360 200 125" dur="20s" repeatCount="indefinite" />
                  <circle cx="200" cy="125" r="75" stroke="#E05D36" strokeWidth="1.5" strokeOpacity="0.2" strokeDasharray="4 6" />
                  <circle cx="200" cy="125" r="50" stroke="#E05D36" strokeWidth="1.5" strokeOpacity="0.35" strokeDasharray="4 6" />
                </g>
                <g>
                  <animateTransform attributeName="transform" type="rotate" from="360 200 125" to="0 200 125" dur="15s" repeatCount="indefinite" />
                  <circle cx="200" cy="125" r="28" stroke="#E05D36" strokeWidth="2" strokeOpacity="0.6" strokeDasharray="4 6" />
                </g>
                <circle cx="200" cy="125" r="8" fill="#E05D36">
                  <animate attributeName="r" values="6;11;6" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="200" cy="125" r="20" fill="#E05D36" fillOpacity="0.1" stroke="#E05D36" strokeWidth="1">
                  <animate attributeName="r" values="16;26;16" dur="2s" repeatCount="indefinite" />
                </circle>
                {[[130,80], [270,90], [250,180], [150,185]].map(([cx, cy], i) => (
                  <g key={i}>
                    <line x1="200" y1="125" x2={cx} y2={cy} stroke="#E05D36" strokeWidth="1" strokeOpacity="0.3">
                      <animate attributeName="stroke-opacity" values="0.1;0.6;0.1" dur={`${3 + i}s`} repeatCount="indefinite" />
                    </line>
                    <circle cx={cx} cy={cy} r="4" fill="#E05D36" fillOpacity="0.6">
                      <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${2.5 + i}s`} repeatCount="indefinite" />
                    </circle>
                  </g>
                ))}
              </svg>
            </div>

            <div className="mt-6 w-full max-w-sm bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-[0_10px_30px_rgba(224,93,54,0.1)]">
              <div className="flex items-center gap-2 mb-3 text-brand-copper">
                <i className="fa-solid fa-microchip text-xs"></i>
                <span className="text-[10px] font-bold uppercase tracking-widest">System Live State</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">Evaluating constraints...</span>
                  <span className="flex gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-copper/60 animate-pulse"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-copper/40"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-copper/20"></span>
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-green-400 text-[10px]"></i>
                    <span className="text-white text-xs">GPA → Valid</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-check text-green-400 text-[10px]"></i>
                    <span className="text-white text-xs">Budget → Optimized</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-white/10 mt-3 pt-2">
                <p className="text-brand-copper/80 text-[11px] font-medium flex items-center gap-1">
                  <i className="fa-solid fa-route text-[9px]"></i>
                  14 viable pathways computed
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-2xl font-semibold text-white/90 mb-1">Precision mapping</p>
            <p className="text-xs text-white/40 leading-relaxed max-w-xs">
              Every route is calculated against hard constraints—GPA, budget, and PR timelines.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[45%] flex items-center justify-center p-4 md:p-6 bg-gradient-to-b from-white to-[#f1f5f9] overflow-y-auto">
        <div className="w-full max-w-md py-4">
          {children}
        </div>
      </div>
    </div>
  )
}

/* ==============================
   AUTH PAGE
   ============================== */
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <AuthLayout>
      {isLogin ? (
        <LoginForm onToggle={() => setIsLogin(false)} />
      ) : (
        <SignupForm onToggle={() => setIsLogin(true)} />
      )}
    </AuthLayout>
  )
}

export default AuthPage