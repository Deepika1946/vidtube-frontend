import { useState, useEffect } from 'react'
import api from '../utils/api'
import VideoCard from '../components/VideoCard'
import { FiHeart } from 'react-icons/fi'

export default function LikedVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/likes/videos').then(r => setVideos(r.data.data?.map(l=>l.likedVideo)||[])).catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  return (
    <div style={{ padding:'28px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
        <div style={{ width:42,height:42,background:'rgba(230,57,80,0.15)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center' }}>
          <FiHeart size={20} color="var(--accent)"/>
        </div>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:800 }}>Liked Videos</h1>
          <p style={{ color:'var(--text3)', fontSize:13 }}>{videos.length} videos</p>
        </div>
      </div>
      {loading ? <div style={{ display:'flex',justifyContent:'center',padding:80 }}><div className="spinner" style={{ width:48,height:48 }}/></div>
      : videos.length===0 ? <div className="empty-state"><FiHeart size={48}/><h3>No liked videos yet</h3><p style={{ fontSize:14 }}>Like videos to see them here</p></div>
      : <div className="video-grid fade-in">{videos.map(v=><VideoCard key={v._id} video={v}/>)}</div>}
    </div>
  )
}
