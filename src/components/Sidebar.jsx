import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiHome, FiTrendingUp, FiHeart, FiList, FiClock, FiUser, FiFeather } from 'react-icons/fi'

const links = [
  { to: '/', icon: FiHome, label: 'Home', exact: true },
  { to: '/trending', icon: FiTrendingUp, label: 'Trending' },
  { to: '/liked', icon: FiHeart, label: 'Liked', auth: true },
  { to: '/playlists', icon: FiList, label: 'Playlists', auth: true },
  { to: '/history', icon: FiClock, label: 'History', auth: true },
  { to: '/tweets', icon: FiFeather, label: 'Community' },
]

export default function Sidebar() {
  const { user } = useAuth()

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 64, bottom: 0, width: 240,
      background: 'var(--bg)', borderRight: '1px solid var(--border)',
      padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 4,
      overflowY: 'auto', zIndex: 90,
    }}>
      {links.map(({ to, icon: Icon, label, auth, exact }) => {
        if (auth && !user) return null
        return (
          <NavLink
            key={to}
            to={to}
            end={exact}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 14px', borderRadius: 10,
              color: isActive ? 'var(--text)' : 'var(--text2)',
              background: isActive ? 'var(--bg4)' : 'transparent',
              fontFamily: isActive ? 'var(--font-display)' : 'var(--font-body)',
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              transition: 'var(--transition)',
              borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
            })}
          >
            <Icon size={17} />
            {label}
          </NavLink>
        )
      })}

      {user && (
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text3)', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 14px', marginBottom: 8 }}>
            Your Channel
          </div>
          <NavLink
            to={`/channel/${user.username}`}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 10,
              color: isActive ? 'var(--text)' : 'var(--text2)',
              background: isActive ? 'var(--bg4)' : 'transparent',
              fontSize: 14, transition: 'var(--transition)',
            })}
          >
            <img src={user.avatar} className="avatar" style={{ width: 26, height: 26 }} />
            {user.username}
          </NavLink>
        </div>
      )}
    </aside>
  )
}
