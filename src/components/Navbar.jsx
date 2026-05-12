import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiSearch, FiUpload, FiBell, FiLogOut, FiUser } from 'react-icons/fi'
import toast from 'react-hot-toast'

function VidTubeLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c5cfc"/>
          <stop offset="100%" stopColor="#56cfb2"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#lg1)"/>
      <path d="M10 11.5 L10 20.5 L19 16 Z" fill="white" opacity="0.95"/>
      <rect x="20" y="11.5" width="3" height="9" rx="1.5" fill="white" opacity="0.95"/>
    </svg>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const [query, setQuery] = useState('')
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out!')
    navigate('/login')
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 64, zIndex: 100,
      background: 'rgba(8,8,14,0.96)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 8, textDecoration: 'none' }}>
        <VidTubeLogo />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px', color: 'var(--text)' }}>
          Vid<span style={{ background: 'linear-gradient(135deg,#7c5cfc,#56cfb2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Tube</span>
        </span>
      </Link>

      <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 520, position: 'relative' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search videos..."
          className="input"
          style={{ paddingLeft: 44, paddingRight: 16 }}
        />
        <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)', pointerEvents: 'none' }} />
      </form>

      <div style={{ flex: 1 }} />

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/upload" className="btn btn-primary btn-sm">
            <FiUpload size={14} /> Upload
          </Link>
          <button className="btn-ghost" style={{ padding: 10, borderRadius: 10 }}>
            <FiBell size={18} />
          </button>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowMenu(!showMenu)} style={{ cursor: 'pointer', background: 'none', border: 'none' }}>
              <img src={user.avatar} alt={user.username} className="avatar" style={{ width: 36, height: 36 }} />
            </button>
            {showMenu && (
              <div style={{
                position: 'absolute', right: 0, top: 48,
                background: 'var(--bg3)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius)', padding: 8, minWidth: 180,
                boxShadow: 'var(--shadow-lg)', zIndex: 200,
              }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: 4 }}>
                  <div style={{ fontWeight: 600, fontFamily: 'var(--font-display)' }}>{user.fullName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text3)' }}>@{user.username}</div>
                </div>
                <Link to={`/channel/${user.username}`} onClick={() => setShowMenu(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, color: 'var(--text2)', fontSize: 14 }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--bg4)'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  <FiUser size={15} /> My Channel
                </Link>
                <button onClick={handleLogout}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, color: 'var(--accent)', fontSize: 14, width: '100%' }}
                  onMouseOver={e => e.currentTarget.style.background = 'var(--bg4)'}
                  onMouseOut={e => e.currentTarget.style.background = 'none'}
                >
                  <FiLogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
          <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
        </div>
      )}
    </nav>
  )
}
