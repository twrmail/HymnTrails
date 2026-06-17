export default function Header() {
  return (
    <header style={{
      borderBottom: '1px solid var(--border)',
      padding: '22px 20px',
      textAlign: 'center',
      background: 'var(--white)',
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 30,
        fontWeight: 600,
        color: 'var(--navy)',
        letterSpacing: '0.01em',
        lineHeight: 1.1,
      }}>
        🎵 HymnTrails
      </div>
      <div style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 11.5,
        color: 'var(--ink-light)',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginTop: 4,
      }}>
        Scripture · Hymn · Modern Echo
      </div>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic',
        fontSize: 14.5,
        color: 'var(--ink-light)',
        marginTop: 8,
      }}>
        Every hymn began as someone's honest prayer. Every study ends with a song for today.
      </div>
    </header>
  )
}
