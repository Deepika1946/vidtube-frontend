import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiLock, FiCamera } from 'react-icons/fi'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', username: '', password: '' })
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (file) { setAvatar(file); setAvatarPreview(URL.createObjectURL(file)) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!avatar) return toast.error('Avatar is required!')
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      fd.append('avatar', avatar)
      await register(fd)
      toast.success('Account created! Please login 🎉')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg)', padding:24, backgroundImage:'radial-gradient(ellipse at 80% 20%, rgba(230,57,80,0.08) 0%, transparent 60%)' }}>
      <div className="fade-in" style={{ width:'100%', maxWidth:460 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:52,height:52,background:'var(--accent)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 0 32px var(--accent-glow)' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:28, fontWeight:800 }}>Join VidTube</h1>
          <p style={{ color:'var(--text3)', marginTop:6, fontSize:14 }}>Create your account and start sharing</p>
        </div>
        <div className="card" style={{ padding:32 }}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:8 }}>
              <label style={{ cursor:'pointer', position:'relative' }}>
                <div style={{ width:80,height:80,borderRadius:'50%',background:'var(--bg4)',border:'2px dashed var(--border)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden' }}>
                  {avatarPreview ? <img src={avatarPreview} style={{ width:'100%',height:'100%',objectFit:'cover' }}/> : <FiCamera size={24} color="var(--text3)"/>}
                </div>
                <div style={{ position:'absolute',bottom:0,right:0,width:24,height:24,background:'var(--accent)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center' }}>
                  <FiCamera size={12} color="white"/>
                </div>
                <input type="file" accept="image/*" onChange={handleAvatar} style={{ display:'none' }}/>
              </label>
            </div>
            {[['fullName','Full Name',FiUser,'John Doe'],['username','Username',FiUser,'johndoe'],['email','Email',FiMail,'you@example.com']].map(([key,label,Icon,placeholder]) => (
              <div key={key}>
                <label style={{ display:'block',fontSize:13,fontWeight:600,marginBottom:7,color:'var(--text2)',fontFamily:'var(--font-display)' }}>{label}</label>
                <div style={{ position:'relative' }}>
                  <input className="input" placeholder={placeholder} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} style={{ paddingLeft:42 }} required/>
                  <Icon style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text3)' }}/>
                </div>
              </div>
            ))}
            <div>
              <label style={{ display:'block',fontSize:13,fontWeight:600,marginBottom:7,color:'var(--text2)',fontFamily:'var(--font-display)' }}>Password</label>
              <div style={{ position:'relative' }}>
                <input className="input" type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} style={{ paddingLeft:42 }} required/>
                <FiLock style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'var(--text3)' }}/>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width:'100%',justifyContent:'center',padding:'13px',fontSize:15,marginTop:4 }}>
              {loading ? <div className="spinner" style={{ width:20,height:20,borderWidth:2 }}/> : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign:'center',marginTop:20,fontSize:14,color:'var(--text3)' }}>
            Already have an account? <Link to="/login" style={{ color:'var(--accent)',fontWeight:600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
