import { ImageResponse } from 'next/og'
import { DATA } from '@/data/resume'

export const runtime = 'edge'

export const alt = 'Pleasure1234'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#000000',
        }}
      >
        {/* Banner */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '240px',
            overflow: 'hidden',
          }}
        >
          <img
            src={`${DATA.url}/profile/header.jpg`}
            alt="Header"
            width={1200}
            height={240}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* Profile Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0 48px 32px 48px',
            flex: 1,
            backgroundColor: '#000000',
          }}
        >
          {/* Avatar Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginTop: '-65px',
            }}
          >
            {/* Avatar */}
            <img
              src={`${DATA.url}/profile/me.png`}
              alt="Pleasure1234"
              width={150}
              height={150}
              style={{
                borderRadius: '50%',
                border: '5px solid #000000',
              }}
            />

            {/* Follow Button */}
            <div
              style={{
                display: 'flex',
                marginTop: '90px',
                padding: '12px 24px',
                borderRadius: '9999px',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              Follow
            </div>
          </div>

          {/* Name & Handle */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginTop: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                fontSize: 42,
                fontWeight: 800,
                color: '#e7e9ea',
                letterSpacing: '-0.02em',
              }}
            >
              Pleasure1234
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 24,
                color: '#71767b',
              }}
            >
              @Pleasure9876
            </div>
          </div>

          {/* Bio */}
          <div
            style={{
              display: 'flex',
              fontSize: 24,
              color: '#e7e9ea',
              marginTop: '20px',
              lineHeight: 1.4,
            }}
          >
            {DATA.description}
          </div>

          {/* Meta Info */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              marginTop: 'auto',
              paddingTop: '20px',
              color: '#71767b',
              fontSize: 20,
            }}
          >
            {/* Location */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#71767b"/>
              </svg>
              <span>Nottingham, UK</span>
            </div>

            {/* Website */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" fill="#1d9bf0"/>
              </svg>
              <span style={{ color: '#1d9bf0' }}>{DATA.url.replace('https://', '')}</span>
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