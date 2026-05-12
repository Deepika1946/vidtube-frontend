import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactPlayer from 'react-player'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { formatViews, timeAgo } from '../utils/format'
import { FiThumbsUp, FiShare2, FiMoreHorizontal, FiBell } from 'react-icons/fi'
import toast from 'react-hot-toast'

export default function VideoWatch() {
  const { id } = useParams()
  const { user } = useAuth()
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [liked, setLiked] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [related, setRelated] = useState([])

  useEffect(() => { fetchVideo(); fetchRelated() }, [id])

  const fetchVideo = async () => {
    try {
      const res = await api.get(`/videos/${id}`)
      setVideo(res.data.data)
      setLiked(res.data.data.isLiked)
      setSubscribed(res.data.data.owner?.isSubscribed)
      fetchComments()
    } catch { toast.error('Video not found') }
    finally { setLoading(false) }
  }

  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${id}`)
      setComments(res.data.data?.docs || [])
    } catch {}
  }

  const fetchRelated = async () => {
    try {
      const res = await api.get('/videos?limit=8&sortBy=views&sortType=desc')
      setRelated(res.data.data?.docs || [])
    } catch {}
  }

  const toggleLike = async () => {
    if (!user) return toast.error('Login to like!')
    try {
      await api.post(`/likes/toggle/v/${id}`)
      setLiked(!liked)
      setVideo(v => ({ ...v, likesCount: liked ? v.likesCount-1 : v.likesCount+1 }))
    } catch {}
  }

  const toggleSubscribe = async () => {
    if (!user) return toast.error('Login to subscribe!')
    try {
      await api.post(`/subscriptions/c/${video.owner._id}`)
      setSubscribed(!subscribed)
      toast.success(subscribed ? 'Unsubscribed' : 'Subscribed! 🔔')
    } catch {}
  }

  const addComment = async (e) => {
    e.preventDefault()
    if (!user) return toast.error('Login to comment!')
    if (!newComment.trim()) return
    try {
      await api.post(`/comments/${id}`, { content: newComment })
      setNewComment('')
      fetchComments()
      toast.success('Comment added!')
    } catch {}
  }

  if (loading) return <div style={{ display:'flex',justifyContent:'center',padding:120 }}><div className="spinner" style={{ width:48,height:48 }}/></div>
  if (!video) return <div className="empty-state"><h3>Video not found</h3></div>

  return (
    <div style={{ padding:'24px 28px', display:'grid', gridTemplateColumns:'1fr 380px', gap:28, maxWidth:1400 }}>
      {/* Main */}
      <div>
        {/* Player */}
        <div style={{ borderRadius:14, overflow:'hidden', background:'#000', aspectRatio:'16/9', marginBottom:20 }}>
          <ReactPlayer url={video.videoFile} width="100%" height="100%" controls playing style={{ display:'block' }}/>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:700, marginBottom:14, lineHeight:1.4 }}>{video.title}</h1>

        {/* Meta row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:20 }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <Link to={`/channel/${video.owner?.username}`}>
              <img src={video.owner?.avatar} className="avatar" style={{ width:44,height:44 }}/>
            </Link>
            <div>
              <Link to={`/channel/${video.owner?.username}`} style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }}>{video.owner?.username}</Link>
              <div style={{ fontSize:12, color:'var(--text3)' }}>{video.owner?.subscribersCount || 0} subscribers</div>
            </div>
            <button onClick={toggleSubscribe} className="btn" style={{
              padding:'8px 20px', borderRadius:20, fontSize:13, fontWeight:700, fontFamily:'var(--font-display)',
              background: subscribed ? 'var(--bg4)' : 'var(--accent)',
              color: subscribed ? 'var(--text2)' : 'white',
              border: subscribed ? '1px solid var(--border)' : 'none',
              boxShadow: subscribed ? 'none' : '0 0 16px var(--accent-glow)',
            }}>
              {subscribed ? 'Subscribed ✓' : <><FiBell size={13}/> Subscribe</>}
            </button>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={toggleLike} className="btn btn-secondary btn-sm" style={{ gap:8, color: liked ? 'var(--accent)' : 'var(--text)', borderColor: liked ? 'var(--accent)' : 'var(--border)' }}>
              <FiThumbsUp size={15} fill={liked?'var(--accent)':'none'}/> {video.likesCount || 0}
            </button>
            <button className="btn btn-secondary btn-sm" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}>
              <FiShare2 size={15}/> Share
            </button>
          </div>
        </div>

        {/* Description */}
        <div style={{ background:'var(--bg3)', borderRadius:12, padding:'14px 18px', marginBottom:24, fontSize:14, color:'var(--text2)', lineHeight:1.7, border:'1px solid var(--border)' }}>
          <div style={{ display:'flex', gap:16, marginBottom:8, fontSize:13, fontWeight:600, color:'var(--text3)' }}>
            <span>{formatViews(video.views)} views</span>
            <span>{timeAgo(video.createdAt)}</span>
          </div>
          {video.description}
        </div>

        {/* Comments */}
        <div>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:18, fontSize:17 }}>{comments.length} Comments</h3>
          {user && (
            <form onSubmit={addComment} style={{ display:'flex', gap:12, marginBottom:24 }}>
              <img src={user.avatar} className="avatar" style={{ width:38,height:38,flexShrink:0 }}/>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                <input className="input" placeholder="Add a comment..." value={newComment} onChange={e=>setNewComment(e.target.value)} style={{ fontSize:14 }}/>
                {newComment && <button type="submit" className="btn btn-primary btn-sm" style={{ alignSelf:'flex-end' }}>Post</button>}
              </div>
            </form>
          )}
          <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {comments.map(c => (
              <div key={c._id} style={{ display:'flex', gap:12 }}>
                <img src={c.owner?.avatar} className="avatar" style={{ width:36,height:36,flexShrink:0 }}/>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                    <span style={{ fontSize:13, fontWeight:700, fontFamily:'var(--font-display)' }}>@{c.owner?.username}</span>
                    <span style={{ fontSize:12, color:'var(--text3)' }}>{timeAgo(c.createdAt)}</span>
                  </div>
                  <p style={{ fontSize:14, color:'var(--text2)', lineHeight:1.6 }}>{c.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related sidebar */}
      <div>
        <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:16, fontSize:15 }}>Related Videos</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          {related.filter(v => v._id !== id).slice(0,7).map(v => (
            <Link key={v._id} to={`/video/${v._id}`} style={{ display:'flex', gap:12, textDecoration:'none' }}>
              <div style={{ width:168, flexShrink:0, borderRadius:10, overflow:'hidden', background:'var(--bg4)', aspectRatio:'16/9' }}>
                <img src={v.thumbnail} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <h4 style={{ fontSize:13, fontWeight:600, fontFamily:'var(--font-display)', lineHeight:1.4, marginBottom:4, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{v.title}</h4>
                <div style={{ fontSize:12, color:'var(--text3)' }}>{(v.ownerDetails||v.owner)?.username}</div>
                <div style={{ fontSize:12, color:'var(--text3)' }}>{formatViews(v.views)} views</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
