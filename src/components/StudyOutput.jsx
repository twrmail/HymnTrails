import { useMemo } from 'react'
import FontSizeToggle from './FontSizeToggle'

/**
 * Renders the streamed/finished study text. Splits out the "🎵 MODERN
 * ECHO" closing section (always present per the Worker's system prompt)
 * and gives it distinct visual treatment — a highlighted card rather
 * than plain paragraph text — since it's HymnTrails' signature feature.
 */
function splitModernEcho(content) {
  const marker = /🎵\s*MODERN ECHO/i
  const match = content.match(marker)
  if (!match) return { body: content, echo: null }
  const idx = match.index
  return {
    body: content.slice(0, idx).trim(),
    echo: content.slice(idx).replace(marker, '').trim(),
  }
}

function renderParagraphs(text) {
  return text.split(/\n{2,}/).map((para, i) => (
    <p key={i} style={{ marginBottom: 14, whiteSpace: 'pre-wrap' }}>{para}</p>
  ))
}

export default function StudyOutput({ content, streaming, onReset, enlarged, onToggleEnlarge }) {
  const { body, echo } = useMemo(() => splitModernEcho(content), [content])
  const fontScale = enlarged ? 1.15 : 1

  return (
    <div style={{ zoom: fontScale }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button
          onClick={onReset}
          style={{
            background: 'none', border: '1.5px solid var(--border)', borderRadius: 6,
            padding: '8px 14px', fontFamily: 'Inter, sans-serif', fontSize: 13,
            color: 'var(--ink-light)', cursor: 'pointer',
          }}
        >
          ← New Study
        </button>
        <FontSizeToggle enlarged={enlarged} onToggle={onToggleEnlarge} />
      </div>

      <article style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 17,
        lineHeight: 1.7,
        color: 'var(--ink)',
      }}>
        {renderParagraphs(body)}
        {streaming && !echo && (
          <span style={{ opacity: 0.5, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>▍ writing…</span>
        )}
      </article>

      {echo && (
        <div style={{
          marginTop: 28,
          background: 'linear-gradient(135deg, var(--gold-pale), var(--white))',
          border: '2px solid var(--gold)',
          borderRadius: 12,
          padding: '20px 22px',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: -14, left: 20,
            background: 'var(--gold)', color: 'var(--white)',
            fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '4px 12px', borderRadius: 20,
          }}>
            🎵 Modern Echo
          </div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 16.5,
            lineHeight: 1.7,
            color: 'var(--ink)',
            marginTop: 10,
            whiteSpace: 'pre-wrap',
          }}>
            {echo}
          </div>
        </div>
      )}

      {!streaming && (
        <div style={{
          marginTop: 32, paddingTop: 18, borderTop: '1px solid var(--border)',
          fontFamily: 'Inter, sans-serif', fontSize: 11.5, color: 'var(--ink-light)',
          textAlign: 'center', lineHeight: 1.6,
        }}>
          This study is a starting point, not a final word. Verify every reference
          against your own Bible and hymnal before teaching from it.
        </div>
      )}
    </div>
  )
}
