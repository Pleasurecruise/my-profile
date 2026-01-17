import { ImageResponse } from 'next/og'
import { getBlogPost } from '@/server/blog'
import { DATA } from '@/data/resume'

export const runtime = 'nodejs'

export const alt = 'Blog Post'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  const title = post?.title || 'Blog Post'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000000',
          padding: '48px',
        }}
      >
        {/* Tweet Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            padding: '32px',
            borderRadius: '16px',
            border: '1px solid #2f3336',
            backgroundColor: '#000000',
          }}
        >
          {/* Author Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <img
              src={`${DATA.url}/profile/me.png`}
              alt="Pleasure1234"
              width={56}
              height={56}
              style={{
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#e7e9ea',
                  }}
                >
                  Pleasure1234
                </span>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246-5.683 6.206z" fill="#1d9bf0"/>
                </svg>
              </div>
              <span
                style={{
                  fontSize: 18,
                  color: '#71767b',
                }}
              >
                @Pleasure9876
              </span>
            </div>
          </div>

          {/* Tweet Content (Blog Title) */}
          <div
            style={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: title.length > 60 ? 36 : title.length > 40 ? 42 : 48,
                fontWeight: 400,
                color: '#e7e9ea',
                lineHeight: 1.3,
                letterSpacing: '-0.01em',
              }}
            >
              {title}
            </div>
          </div>

          {/* Blog Link Preview */}
          <div
            style={{
              display: 'flex',
              marginTop: '20px',
              padding: '16px',
              borderRadius: '16px',
              border: '1px solid #2f3336',
              backgroundColor: '#16181c',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '80px',
                height: '80px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <span style={{ fontSize: 18, color: '#71767b' }}>
                {DATA.url.replace('https://', '')}
              </span>
              <span style={{ fontSize: 20, color: '#e7e9ea', fontWeight: 500 }}>
                Blog Post
              </span>
            </div>
          </div>

          {/* Engagement Stats */}
          <div
            style={{
              display: 'flex',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #2f3336',
              gap: '32px',
            }}
          >
            {/* Reply */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#71767b">
                <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"/>
              </svg>
              <span style={{ color: '#71767b', fontSize: 18 }}>Reply</span>
            </div>
            {/* Repost */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#71767b">
                <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"/>
              </svg>
              <span style={{ color: '#71767b', fontSize: 18 }}>Repost</span>
            </div>
            {/* Like */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#71767b">
                <path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"/>
              </svg>
              <span style={{ color: '#71767b', fontSize: 18 }}>Like</span>
            </div>
            {/* Share */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#71767b">
                <path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"/>
              </svg>
              <span style={{ color: '#71767b', fontSize: 18 }}>Share</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}