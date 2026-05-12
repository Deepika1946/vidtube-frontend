import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VideoWatch from './pages/VideoWatch'
import Upload from './pages/Upload'
import Channel from './pages/Channel'
import LikedVideos from './pages/LikedVideos'
import History from './pages/History'
import Search from './pages/Search'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}>
      <div className="spinner" style={{ width:48, height:48 }}/>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function Layout({ children }) {
  return (
    <div className="page-layout">
      <Navbar />
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/video/:id" element={<Layout><VideoWatch /></Layout>} />
      <Route path="/channel/:username" element={<Layout><Channel /></Layout>} />
      <Route path="/search" element={<Layout><Search /></Layout>} />
      <Route path="/upload" element={<Layout><ProtectedRoute><Upload /></ProtectedRoute></Layout>} />
      <Route path="/liked" element={<Layout><ProtectedRoute><LikedVideos /></ProtectedRoute></Layout>} />
      <Route path="/history" element={<Layout><ProtectedRoute><History /></ProtectedRoute></Layout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg3)',
            color: 'var(--text)',
            border: '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
            fontSize: 14,
          },
          success: { iconTheme: { primary: '#22c55e', secondary: 'white' } },
          error: { iconTheme: { primary: '#e63950', secondary: 'white' } },
        }}
      />
    </AuthProvider>
  )
}
