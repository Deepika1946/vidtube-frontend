import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiUploadCloud, FiImage, FiVideo } from 'react-icons/fi'

export default function Upload() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ title:'', description:'' })
  const [video, setVideo] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbPreview, setThumbPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleThumb = (e) => {
    const f = e.target.files[0]
    if(f){ setThumbnail(f); setThumbPreview(URL.createObjectURL(f)) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!video) return toast.error('Select a video file!')
    if(!thumbnail) return toast.error('Select a thumbnail!')
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title)
      fd.append('description', form.description)
      fd.append('videoFile', video)
      fd.append('thumbnail', thumbnail)
      const res = await api.post('/videos', fd, {
        onUploadProgress: (e) => setProgress(Math.round(e.loaded*100/e.total))
      })
      toast.success('Video uploaded! 🎉')
      navigate(`/video/${res.data.data._id}`)
    } catch(err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally { setLoading(false); setProgress(0) }
  }

  return (
    <div style={{ padding:'36px 28px', maxWidth:720, margin:'0 auto' }}>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:26, fontWeight:800, marginBottom:8 }}>Upload Video</h1>
      <p style={{ color:'var(--text3)', marginBottom:32, fontSize:14 }}>Share your content with the world</p>

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:24 }}>
        {/* Video drop zone */}
        <label style={{ cursor:'pointer' }}>
          <div style={{
            border:`2px dashed ${video ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius:16, padding:'40px 24px', textAlign:'center',
            background: video ? 'rgba(230,57,80,0.05)' : 'var(--bg2)',
            transition:'all 0.2s',
          }}>
            <FiVideo size={36} color={video ? 'var(--accent)' : 'var(--text3)'} style={{ marginBottom:12 }}/>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, marginBottom:6, fontSize:16, color: video ? 'var(--accent)' : 'var(--text)' }}>
              {video ? `✓ ${video.name}` : 'Click to select video'}
            </div>
            <div style={{ fontSize:13, color:'var(--text3)' }}>MP4, WebM, MOV supported</div>
          </div>
          <input type="file" accept="video/*" onChange={e=>setVideo(e.target.files[0])} style={{ display:'none' }} required/>
        </label>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
          {/* Thumbnail */}
          <label style={{ cursor:'pointer' }}>
            <div style={{ border:`2px dashed ${thumbnail ? 'var(--accent)' : 'var(--border)'}`, borderRadius:14, overflow:'hidden', aspectRatio:'16/9', background:'var(--bg3)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
              {thumbPreview ? <img src={thumbPreview} style={{ width:'100%', height:'100%', objectFit:'cover' }}/> : (
                <div style={{ textAlign:'center' }}>
                  <FiImage size={28} color="var(--text3)" style={{ marginBottom:8 }}/>
                  <div style={{ fontSize:13, color:'var(--text3)', fontWeight:600 }}>Thumbnail</div>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleThumb} style={{ display:'none' }}/>
          </label>

          {/* Title + desc */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:7, color:'var(--text2)', fontFamily:'var(--font-display)' }}>Title *</label>
              <input className="input" placeholder="Give your video a title..." value={form.title} onChange={e=>setForm({...form,title:e.target.value})} required/>
            </div>
            <div style={{ flex:1 }}>
              <label style={{ display:'block', fontSize:13, fontWeight:600, marginBottom:7, color:'var(--text2)', fontFamily:'var(--font-display)' }}>Description *</label>
              <textarea className="input" placeholder="Describe your video..." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} style={{ resize:'vertical', minHeight:80 }} required/>
            </div>
          </div>
        </div>

        {loading && (
          <div style={{ background:'var(--bg3)', borderRadius:10, overflow:'hidden', height:8 }}>
            <div style={{ height:'100%', background:'var(--accent)', width:`${progress}%`, transition:'width 0.3s', borderRadius:10, boxShadow:'0 0 10px var(--accent-glow)' }}/>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf:'flex-start', padding:'12px 32px', fontSize:15 }}>
          {loading ? <><div className="spinner" style={{ width:18,height:18,borderWidth:2 }}/> Uploading {progress}%</> : <><FiUploadCloud size={16}/> Publish Video</>}
        </button>
      </form>
    </div>
  )
}
