import { useState, useEffect } from 'react'
import VideoCard from '../components/VideoCard'
import api from '../utils/api'

const CATEGORIES = ['All','Music','Gaming','News','Sports','Education','Tech','Comedy','Travel']

export default function Home() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('All')

  useEffect(() => { fetchVideos() }, [])

  const fetchVideos = async () => {
    try {
      const res = await api.get('/videos?limit=20&sortBy=createdAt&sortType=desc')
      setVideos(res.data.data?.docs || [])
    } catch { setVideos([]) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ padding:'28px 28px' }}>
      {/* Category pills */}
      <div style={{ display:'flex', gap:10, overflowX:'auto', paddingBottom:20, marginBottom:8, scrollbarWidth:'none' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} className="btn" style={{
            padding:'7px 18px', borderRadius:20, fontSize:13, fontFamily:'var(--font-display)', fontWeight:600, flexShrink:0,
            background: category===c ? 'var(--accent)' : 'var(--bg3)',
            color: category===c ? 'white' : 'var(--text2)',
            border: category===c ? 'none' : '1px solid var(--border)',
            boxShadow: category===c ? '0 0 16px var(--accent-glow)' : 'none',
          }}>{c}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:80 }}>
          <div className="spinner" style={{ width:48, height:48 }}/>
        </div>
      ) : videos.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
          <h3>No videos yet</h3>
          <p style={{ fontSize:14 }}>Be the first to upload a video!</p>
        </div>
      ) : (
        <div className="video-grid fade-in">
          {videos.map(v => <VideoCard key={v._id} video={v}/>)}
        </div>
      )}
    </div>
  )
}
