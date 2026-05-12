import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../utils/api'
import VideoCard from '../components/VideoCard'
import { FiSearch } from 'react-icons/fi'

export default function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/videos?query=${encodeURIComponent(q)}&limit=20`).then(r=>setVideos(r.data.data?.docs||[])).catch(()=>{}).finally(()=>setLoading(false))
  }, [q])

  return (
    <div style={{ padding:'28px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:28 }}>
        <FiSearch size={20} color="var(--text3)"/>
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700 }}>Results for "<span style={{ color:'var(--accent)' }}>{q}</span>"</h1>
      </div>
      {loading ? <div style={{ display:'flex',justifyContent:'center',padding:80 }}><div className="spinner" style={{ width:48,height:48 }}/></div>
      : videos.length===0 ? <div className="empty-state"><FiSearch size={48}/><h3>No results found</h3><p style={{ fontSize:14 }}>Try different keywords</p></div>
      : <div className="video-grid fade-in">{videos.map(v=><VideoCard key={v._id} video={v}/>)}</div>}
    </div>
  )
}
