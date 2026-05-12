import { useState, useEffect } from 'react'
import api from '../utils/api'
import VideoCard from '../components/VideoCard'
import { FiClock } from 'react-icons/fi'

export default function History() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/users/history').then(r => setVideos(r.data.data||[])).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  return (
    <div style={{ padding:'28px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
        <div style={{ width:42,height:42,background:'rgba(255,107,53,0.15)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center' }}>
          <FiClock size={20} color="var(--accent2)"/>
        </div>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800 }}>Watch History</h1>
          <p style={{ color:'var(--text3)', fontSize:13 }}>{videos.length} videos</p>
        </div>
      </div>
      {loading ? <div style={{ display:'flex',justifyContent:'center',padding:80 }}><div className="spinner" style={{ width:48,height:48 }}/></div>
      : videos.length===0 ? <div className="empty-state"><FiClock size={48}/><h3>No watch history</h3><p style={{ fontSize:14 }}>Videos you watch will appear here</p></div>
      : <div className="video-grid fade-in">{videos.map(v=><VideoCard key={v._id} video={v}/>)}</div>}
    </div>
  )
}
