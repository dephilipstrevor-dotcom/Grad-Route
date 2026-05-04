import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/common/Navbar'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const ComparePage = () => {
  const { user } = useAuth()
  const [routes, setRoutes] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [compareRoutes, setCompareRoutes] = useState([])

  useEffect(() => {
    const fetchRoutes = async () => {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch(`${API_BASE_URL}/routes`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setRoutes(data)
      }
    }
    fetchRoutes()
  }, [])

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

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0F1C] pt-24 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-400 transition-colors group mb-8">
            <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
            <span className="font-mono tracking-wider">← BACK TO DASHBOARD</span>
          </Link>

          <h1 className="text-3xl font-bold text-white mb-6">Compare Routes</h1>

          {/* Selection Panel */}
          <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Select up to 3 routes</h2>
              <div className="flex gap-3">
                <button
                  onClick={handleCompare}
                  disabled={selectedIds.length < 2}
                  className="px-6 py-2.5 bg-brand-copper text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Compare ({selectedIds.length})
                </button>
                {compareRoutes.length > 0 && (
                  <button onClick={clearComparison} className="px-6 py-2.5 border border-white/10 text-gray-400 rounded-lg text-sm hover:text-white">
                    Clear
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto p-1">
              {routes.map(route => (
                <div
                  key={route.id}
                  onClick={() => toggleSelect(route.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedIds.includes(route.id)
                      ? 'border-brand-copper bg-brand-copper/10'
                      : 'border-white/10 bg-[#0A0F1C] hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold text-sm">{route.university}</h3>
                      <p className="text-gray-400 text-xs">{route.program}</p>
                      <p className="text-gray-500 text-[10px] font-mono mt-1">{route.country}</p>
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
          </div>

          {/* Comparison Table */}
          {compareRoutes.length > 0 && (
            <div className="bg-[#0F172A] border border-white/5 rounded-xl p-6 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Metric</th>
                    {compareRoutes.map(r => (
                      <th key={r.id} className="text-left py-3 px-4 text-white font-semibold">{r.university}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-3 px-4 text-gray-400">Program</td>
                    {compareRoutes.map(r => <td key={r.id} className="py-3 px-4 text-white">{r.program}</td>)}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-400">Country</td>
                    {compareRoutes.map(r => <td key={r.id} className="py-3 px-4 text-white">{r.country}</td>)}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-400">Feasibility</td>
                    {compareRoutes.map(r => (
                      <td key={r.id} className={`py-3 px-4 font-mono font-bold ${
                        r.feasibility >= 80 ? 'text-green-400' : r.feasibility >= 60 ? 'text-amber-400' : 'text-red-400'
                      }`}>
                        {r.feasibility}%
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-400">Total Cost</td>
                    {compareRoutes.map(r => <td key={r.id} className="py-3 px-4 text-white font-mono">₹{(r.total_cost/100000).toFixed(1)}L</td>)}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-400">PR Timeline</td>
                    {compareRoutes.map(r => <td key={r.id} className="py-3 px-4 text-white font-mono">{r.pr_timeline} months</td>)}
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-gray-400">ROI Vector</td>
                    {compareRoutes.map(r => <td key={r.id} className="py-3 px-4 text-orange-400 font-mono text-xs">{r.roi_vector}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ComparePage