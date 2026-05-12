import { Link } from 'react-router-dom'
import { formatViews, formatDuration, timeAgo } from '../utils/format'

export default function VideoCard({ video }) {
  const owner = video.ownerDetails || video.owner || {}

  return (
    <Link to={`/video/${video._id}`} className="card" style={{ display: 'block', cursor: 'pointer' }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: 'var(--bg4)' }}>
        <img
          src={video.thumbnail}
          alt={video.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
        />
        {/* Duration badge */}
        {video.duration && (
          <span style={{
            position: 'absolute', bottom: 8, right: 8,
            background: 'rgba(0,0,0,0.85)', color: 'white',
            fontSize: 12, fontWeight: 700, padding: '2px 7px', borderRadius: 5,
            fontFamily: 'var(--font-display)',
          }}>
            {formatDuration(video.duration)}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px 14px 14px', display: 'flex', gap: 10 }}>
        <img
          src={owner.avatar || '/default-avatar.png'}
          className="avatar"
          style={{ width: 34, height: 34, marginTop: 2, flexShrink: 0 }}
        />
        <div style={{ minWidth: 0 }}>
          <h3 style={{
            fontSize: 14, fontWeight: 600, fontFamily: 'var(--font-display)',
            lineHeight: 1.4, marginBottom: 4,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {video.title}
          </h3>
          <div style={{ fontSize: 12, color: 'var(--text3)' }}>{owner.username || 'Unknown'}</div>
          <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>
            {formatViews(video.views)} views · {timeAgo(video.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  )
}
