import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import VideoCard from '../components/VideoCard'
import { formatViews } from '../utils/format'
import { FiBell } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function Channel() {
  const { username } = useParams()
  const { user } = useAuth()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('videos')

  useEffect(() => { fetchChannel() }, [username])

  const fetchChannel = async () => {
    try {
      const res = await api.get(`/users/c/${username}`)
      setChannel(res.data.data)
      setSubscribed(res.data.data.isSubscribed)
      const vres = await api.get(`/videos?userId=${res.data.data._id}&limit=20`)
      setVideos(vres.data.data?.docs || [])
    } catch { toast.error('Channel not found') }
    finally { setLoading(false) }
  }

  const toggleSubscribe = async () => {
    if(!user) return toast.error('Login to subscribe!')
    try {
      await api.post(`/subscriptions/c/${channel._id}`)
      setSubscribed(!subscribed)
      setChannel(c => ({ ...c, subscribersCount: subscribed ? c.subscribersCount-1 : c.subscribersCount+1 }))
      toast.success(subscribed ? 'Unsubscribed' : 'Subscribed! 🔔')
    } catch {}
  }

  if(loading) return <div style={{ display:'flex',justifyContent:'center',padding:120 }}><div className="spinner" style={{ width:48,height:48 }}/></div>
  if(!channel) return <div className="empty-state"><h3>Channel not found</h3></div>

  return (
    <div>
      {/* Cover */}
      <div style={{ height:200, background:`linear-gradient(135deg, var(--bg3) 0%, var(--bg4) 100%)`, overflow:'hidden', position:'relative' }}>
        {channel.coverImage && <img src={channel.coverImage} style={{ width:'100%',height:'100%',objectFit:'cover',opacity:0.7 }}/>}
        <div style={{ position:'absolute',inset:0, background:'linear-gradient(to bottom, transparent 60%, var(--bg) 100%)' }}/>
      </div>

      {/* Profile section */}
      <div style={{ padding:'0 28px 28px', marginTop:-60, position:'relative' }}>
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:16, marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:20 }}>
            <img src={channel.avatar} className="avatar" style={{ width:96,height:96,border:'4px solid var(--bg)',boxShadow:'0 0 0 2px var(--accent)' }}/>
            <div style={{ paddingBottom:4 }}>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:24, fontWeight:800 }}>{channel.fullName}</h1>
              <div style={{ color:'var(--text3)', fontSize:14, marginTop:2 }}>@{channel.username} · {formatViews(channel.subscribersCount)} subscribers</div>
            </div>
          </div>
          {user?.username !== username && (
            <button onClick={toggleSubscribe} className="btn" style={{
              padding:'10px 24px', borderRadius:20, fontFamily:'var(--font-display)', fontWeight:700,
              background: subscribed ? 'var(--bg4)' : 'var(--accent)',
              color: subscribed ? 'var(--text2)' : 'white',
              border: subscribed ? '1px solid var(--border)' : 'none',
              boxShadow: subscribed ? 'none' : '0 0 20px var(--accent-glow)',
            }}>
              {subscribed ? 'Subscribed ✓' : <><FiBell size={15}/> Subscribe</>}
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, borderBottom:'1px solid var(--border)', marginBottom:28 }}>
          {['videos','about'].map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{
              padding:'10px 20px', fontSize:14, fontFamily:'var(--font-display)', fontWeight:600,
              color: tab===t ? 'var(--text)' : 'var(--text3)',
              borderBottom: tab===t ? '2px solid var(--accent)' : '2px solid transparent',
              background:'none', textTransform:'capitalize',
            }}>{t}</button>
          ))}
        </div>

        {tab === 'videos' && (
          videos.length === 0 ? (
            <div className="empty-state"><h3>No videos yet</h3></div>
          ) : (
            <div className="video-grid fade-in">
              {videos.map(v => <VideoCard key={v._id} video={v}/>)}
            </div>
          )
        )}
        {tab === 'about' && (
          <div style={{ maxWidth:600 }} className="fade-in">
            <div className="card" style={{ padding:24 }}>
              <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16 }}>About</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[['Email', channel.email],['Subscribers', formatViews(channel.subscribersCount)],['Channels subscribed to', channel.channelsSubscribedToCount]].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', gap:16, padding:'10px 0', borderBottom:'1px solid var(--border)' }}>
                    <span style={{ color:'var(--text3)', fontSize:14, minWidth:140 }}>{k}</span>
                    <span style={{ fontSize:14, fontWeight:500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
