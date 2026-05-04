import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
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
   MEMORY PANEL – with larger back button, prominent + New Chat, inline renamable titles
   ============================== */
const MemoryPanel = ({ userContext, conversations, activeId, onSelect, onDelete, onNewChat, onRename }) => {
  const truncateTarget = (target) => target.length > 14 ? target.slice(0,11)+'…' : target
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const startRename = (conv) => {
    setEditingId(conv.id)
    setEditTitle(conv.title)
  }

  const commitRename = () => {
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle('')
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* ---- LARGE BACK BUTTON ---- */}
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 bg-brand-copper/10 border border-brand-copper/30 text-brand-copper text-sm font-medium rounded-lg hover:bg-brand-copper/20 transition-all"
      >
        <i className="fa-solid fa-arrow-left text-base"></i>
        <span className="font-mono uppercase tracking-wider text-xs">← MATRIX</span>
      </Link>

      <div>
        <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-3">Active Variables</div>
        <div className="bg-[#0F172A] border border-white/5 rounded-lg p-3 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-500">TARGET</div><div className="text-orange-400 text-right truncate">{truncateTarget(userContext.target)}</div>
            <div className="text-gray-500">BUDGET</div><div className="text-white text-right">{userContext.budget}</div>
            <div className="text-gray-500">DEFICIT</div><div className="text-red-400 text-right">{userContext.deficit}</div>
            <div className="text-gray-500">CGPA</div><div className="text-green-400 text-right">{userContext.cgpa}</div>
            <div className="text-gray-500">IELTS</div><div className={`text-right ${userContext.ielts ? 'text-green-400' : 'text-amber-400'}`}>{userContext.ielts || 'AWAITING'}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Session Logs</span>
          {/* Prominent + New Chat button */}
          <button
            onClick={onNewChat}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-copper/15 border border-brand-copper/30 text-brand-copper text-xs font-semibold hover:bg-brand-copper/25 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>
        <div className="space-y-1">
          {conversations.map(conv => (
            <div key={conv.id} className={`flex items-center rounded transition-colors ${activeId === conv.id ? 'bg-orange-500/10 border-l-2 border-orange-500' : 'hover:bg-white/5'}`}>
              {/* Conversation title – double click to rename */}
              <button
                onClick={() => onSelect(conv.id)}
                onDoubleClick={() => startRename(conv)}
                className="flex-1 text-left pl-0 pr-1 py-2 min-w-0"
              >
                {editingId === conv.id ? (
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => e.key === 'Enter' && commitRename()}
                    autoFocus
                    className="w-full bg-transparent text-xs text-white outline-none border-b border-brand-copper"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className={`text-xs truncate block ${activeId === conv.id ? 'text-white' : 'text-gray-400'}`}>
                    {conv.title}
                  </span>
                )}
              </button>
              {/* Delete button – inline SVG bin icon */}
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                className="px-3 py-2 text-gray-500 hover:text-red-400 transition-colors shrink-0"
                title="Delete conversation"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ==============================
   MESSAGE BUBBLE
   ============================== */
const MessageBubble = ({ message }) => {
  const formatContent = (text) => {
    const parts = text.split(/(€\d+[-\s]*\d*\/?\w*|\d+[-–]\d+\s*\w+)/g)
    return parts.map((part, i) => {
      if (part.match(/€\d|^\d/)) {
        return <span key={i} className="font-semibold text-white">{part}</span>
      }
      return part
    })
  }

  if (message.role === 'user') {
    return (
      <div className="flex justify-end mb-10">
        <div className="max-w-[85%]">
          <div className="text-right text-[10px] font-mono text-gray-500 mb-1">
            &gt; USER
          </div>
          <p className="font-mono text-sm text-gray-400 leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <div className="max-w-2xl">
        <div className="text-[10px] font-mono text-orange-400 mb-2 flex items-center gap-2">
          <i className="fa-solid fa-microchip text-[8px]"></i>
          <span>GRADROUTE_ENGINE</span>
        </div>
        <div className="border-l-2 border-orange-500/50 pl-5">
          <p className="text-gray-200 text-sm leading-relaxed">
            {formatContent(message.content)}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ==============================
   CONVERSATION FEED
   ============================== */
const ConversationFeed = ({ messages, isTyping }) => {
  const bottomRef = useRef(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto min-h-full flex flex-col justify-end">
        <div className="space-y-6">
          {messages.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-gray-500 font-mono text-xs">
              <i className="fa-solid fa-circle-notch fa-spin text-orange-400"></i>
              <span>Engine analyzing...</span>
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}

/* ==============================
   COMMAND INPUT
   ============================== */
const CommandInput = ({ onSend }) => {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim()) return
    onSend(input)
    setInput('')
  }

  return (
    <div className="border-t border-white/10 bg-[#0A0F1C] pt-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-3 px-6">
          <span className="text-orange-400 font-mono text-lg">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Interrogate the engine..."
            className="flex-1 bg-transparent py-4 text-white font-mono text-base outline-none placeholder:text-gray-600"
          />
          <button type="submit" className="hidden">Send</button>
        </div>
        <div className="mt-2 px-6 pb-2 text-[9px] font-mono text-gray-500 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
          SYSTEM CONTEXT ACTIVE • 3 ROUTES LOADED
        </div>
      </form>
    </div>
  )
}

/* ==============================
   DYNAMIC HUD (simplified)
   ============================== */
const DynamicHUD = ({ comparisonRoutes = [] }) => {
  if (comparisonRoutes.length < 2) return null
  const r1 = comparisonRoutes[0], r2 = comparisonRoutes[1]
  return (
    <div className="space-y-4">
      <div className="text-[10px] font-mono text-orange-400 uppercase tracking-wider">&gt; TOP MATCHES</div>
      <div className="space-y-2">
        {[r1, r2].map((r, i) => (
          <div key={i} className="bg-[#0F172A] border border-white/5 rounded-lg p-3">
            <div className="text-white text-xs font-semibold">{r.university}</div>
            <div className="text-gray-400 text-[10px]">{r.program}</div>
            <div className="flex justify-between text-[10px] mt-1">
              <span className="text-gray-500">{r.country}</span>
              <span className="text-green-400 font-mono">{r.feasibility}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ==============================
   CHAT PAGE
   ============================== */
const ChatPage = () => {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [conversations, setConversations] = useState([])
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [userContext, setUserContext] = useState({ target: 'Engineering', budget: '₹15L', deficit: '-₹2.5L', cgpa: 8.25, ielts: null })
  const [userRoutes, setUserRoutes] = useState([])

  // Load user context and conversations
  useEffect(() => {
    let cancelled = false
    const loadUserData = async () => {
      const { data: intake } = await supabase.from('intake_data').select('*').eq('user_id', user.id).single()
      if (intake && !cancelled) {
        setUserContext({
          target: intake.fieldOfStudy || 'Engineering',
          budget: `₹${(intake.budget / 100000).toFixed(1)}L`,
          deficit: '-₹2.5L',
          cgpa: intake.cgpa,
          ielts: intake.ielts
        })
      }

      const { data: convs } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (!cancelled) {
        if (convs && convs.length > 0) {
          const renamedConvs = convs.map((conv, index) => ({ ...conv, title: `Chat ${index + 1}` }))
          setConversations(renamedConvs)
          setActiveConversationId(renamedConvs[renamedConvs.length - 1].id)
        } else {
          const { data: newConv } = await supabase
            .from('conversations')
            .insert({ user_id: user.id, title: 'Chat 1' })
            .select()
            .single()
          setActiveConversationId(newConv.id)
          setConversations([newConv])
        }
      }
    }
    loadUserData()
    return () => { cancelled = true }
  }, [user])

  // Fetch user routes for HUD
  useEffect(() => {
    const fetchRoutes = async () => {
      const { data } = await supabase.from('routes').select('*').eq('user_id', user.id).order('feasibility', { ascending: false }).limit(5)
      setUserRoutes(data || [])
    }
    if (user) fetchRoutes()
  }, [user])

  // Load messages when conversation changes
  useEffect(() => {
    if (!activeConversationId) return
    const loadMessages = async () => {
      const { data: msgs } = await supabase.from('messages').select('*').eq('conversation_id', activeConversationId).order('created_at', { ascending: true })
      setMessages(msgs || [])
    }
    loadMessages()
  }, [activeConversationId])

  // Create a new chat
  const handleNewChat = async () => {
    const nextNum = conversations.length + 1
    const { data: newConv } = await supabase
      .from('conversations')
      .insert({ user_id: user.id, title: `Chat ${nextNum}` })
      .select()
      .single()
    setConversations(prev => [...prev, newConv])
    setActiveConversationId(newConv.id)
  }

  // Delete conversation
  const handleDeleteConversation = async (convId) => {
    setConversations(prev => prev.filter(c => c.id !== convId))
    if (activeConversationId === convId) {
      const remaining = conversations.filter(c => c.id !== convId)
      if (remaining.length > 0) {
        setActiveConversationId(remaining[remaining.length - 1].id)
      } else {
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({ user_id: user.id, title: 'Chat 1' })
          .select()
          .single()
        setActiveConversationId(newConv.id)
        setConversations([newConv])
      }
    }

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      await fetch(`${API_BASE_URL}/chat/conversations/${convId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  // Rename conversation
  const handleRenameConversation = async (convId, newTitle) => {
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, title: newTitle } : c))
    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      await fetch(`${API_BASE_URL}/chat/conversations/${convId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTitle })
      })
    } catch (err) {
      console.error('Rename failed:', err)
    }
  }

  const handleSendMessage = async (text) => {
    setIsTyping(true)
    const tempUserMsg = { id: Date.now(), role: 'user', content: text }
    setMessages(prev => [...prev, tempUserMsg])

    try {
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ conversationId: activeConversationId, message: text })
      })
      if (res.ok) {
        const { reply } = await res.json()
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: reply }])
      }
    } catch (err) {
      console.error('Send error:', err)
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0A0F1C] pt-20 flex">
        {/* Left Sidebar – Memory Panel */}
        <div className="w-1/5 border-r border-white/5 flex flex-col">
          <MemoryPanel
            userContext={userContext}
            conversations={conversations}
            activeId={activeConversationId}
            onSelect={setActiveConversationId}
            onDelete={handleDeleteConversation}
            onNewChat={handleNewChat}
            onRename={handleRenameConversation}
          />
        </div>

        {/* Center – Chat Feed + Input */}
        <div className="w-[55%] flex flex-col">
          <div className="p-4 border-b border-white/5">
            <h2 className="text-sm font-mono font-bold uppercase tracking-[0.2em] text-gray-400">Decision Console</h2>
          </div>
          <ConversationFeed messages={messages} isTyping={isTyping} />
          <CommandInput onSend={handleSendMessage} />
        </div>

        {/* Right Sidebar – Dynamic HUD */}
        <div className="w-1/4 border-l border-white/5 p-4">
          <DynamicHUD comparisonRoutes={userRoutes.slice(0, 2)} />
        </div>
      </div>
    </>
  )
}

export default ChatPage