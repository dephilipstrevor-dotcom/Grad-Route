import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

/* ==============================
   FORGOT PASSWORD PAGE (self‑contained)
   ============================== */
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Password reset link sent to your email.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A0F1C] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <Link to="/auth" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors group mb-8">
          <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
          <span className="font-mono tracking-wider">← BACK TO LOGIN</span>
        </Link>

        <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6">
          <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-gray-400 text-sm mb-6">Enter your email to receive a reset link.</p>

          {message && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">{message}</div>}
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-transparent border border-white/10 text-white text-sm focus:border-brand-copper focus:ring-1 focus:ring-brand-copper/50 outline-none" placeholder="you@example.com" required disabled={loading} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-brand-copper to-orange-500 text-white font-bold rounded-lg transition-all duration-200 shadow-[0_8px_20px_rgba(224,93,54,0.3)] hover:shadow-[0_12px_30px_rgba(224,93,54,0.5)] text-sm uppercase tracking-wider disabled:opacity-50">
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage