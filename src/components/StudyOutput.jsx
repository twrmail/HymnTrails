import { useMemo } from 'react'
import FontSizeToggle from './FontSizeToggle'
import StudyActions from './StudyActions'

/**
 * Splits out the "🎵 MODERN ECHO" closing section so it gets its own
 * gold-bordered card treatment, distinct from the main study body.
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

/**
 * Inline Markdown renderer — handles patterns Claude produces in HymnTrails
 * studies: **bold**, *italic*, `code`. Zero dependencies.
 */
function renderInline(text, keyPrefix = '') {
  const pattern = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g
  const parts = []
  let last = 0
  let match

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index))

    if (match[0].startsWith('**')) {
      parts.push(
        <strong key={`${keyPrefix}-b${match.index}`} style={{ fontWeight: 700, color: 'var(--ink)' }}>
          {match[2]}
        </strong>
      )
    } else if (match[0].startsWith('*')) {
      parts.push(
        <em key={`${keyPrefix}-i${match.index}`} style={{ fontStyle: 'italic' }}>
          {match[3]}
        </em>
      )
    } else if (match[0].startsWith('`')) {
      parts.push(
        <code key={`${keyPrefix}-c${match.index}`} style={{
          fontFamily: 'monospace', fontSize: '0.9em',
          background: 'var(--gold-pale)', padding: '1px 5px', borderRadius: 3,
        }}>
          {match[4]}
        </code>
      )
    }
    last = match.index + match[0].length
  }

  if (last < text.length) parts.push(text.slice(last))
  return parts.length > 0 ? parts : text
}

/**
 * Block-level Markdown renderer. Handles:
 *   ## Section heading, ### Sub-heading, #### minor heading
 *   --- horizontal rule
 *   > blockquote
 *   - bullet lists
 *   1. numbered lists
 *   regular paragraphs
 * Each block's inline content is further processed by renderInline().
 */
function renderMarkdown(text) {
  if (!text) return null

  const rawBlocks = text
    .split(/\n{2,}/)
    .flatMap(block => {
      const lines = block.split('\n')
      const result = []
      let buffer = []
      for (const line of lines) {
        if (/^#{1,4}\s/.test(line) || /^---+$/.test(line)) {
          if (buffer.length) { result.push(buffer.join('\n')); buffer = [] }
          result.push(line)
        } else {
          buffer.push(line)
        }
      }
      if (buffer.length) result.push(buffer.join('\n'))
      return result
    })
    .map(b => b.trim())
    .filter(Boolean)

  return rawBlocks.map((block, i) => {
    if (/^##\s/.test(block)) {
      return (
        <h2 key={i} style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 21,
          fontWeight: 600, color: 'var(--navy)',
          marginTop: 28, marginBottom: 6, lineHeight: 1.3,
        }}>
          {renderInline(block.replace(/^##\s+/, ''), String(i))}
        </h2>
      )
    }

    if (/^###\s/.test(block)) {
      return (
        <h3 key={i} style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 18,
          fontWeight: 600, color: 'var(--navy)',
          marginTop: 20, marginBottom: 4, lineHeight: 1.3,
        }}>
          {renderInline(block.replace(/^###\s+/, ''), String(i))}
        </h3>
      )
    }

    if (/^#{1,4}\s/.test(block)) {
      return (
        <h4 key={i} style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 16,
          fontWeight: 600, color: 'var(--navy)',
          marginTop: 16, marginBottom: 4,
        }}>
          {renderInline(block.replace(/^#{1,4}\s+/, ''), String(i))}
        </h4>
      )
    }

    if (/^---+$/.test(block)) {
      return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '24px 0' }} />
    }

    if (/^>\s/.test(block)) {
      return (
        <blockquote key={i} style={{
          borderLeft: '3px solid var(--gold)', marginLeft: 0,
          paddingLeft: 16, fontStyle: 'italic',
          color: 'var(--ink-light)', marginBottom: 14,
        }}>
          {renderInline(block.replace(/^>\s*/gm, ''), String(i))}
        </blockquote>
      )
    }

    const lines = block.split('\n')
    if (lines.length > 0 && lines.every(l => /^[-*]\s/.test(l.trim()) || l.trim() === '')) {
      return (
        <ul key={i} style={{ paddingLeft: 22, marginBottom: 14 }}>
          {lines.filter(l => /^[-*]\s/.test(l.trim())).map((l, j) => (
            <li key={j} style={{ marginBottom: 6, lineHeight: 1.65 }}>
              {renderInline(l.replace(/^[-*]\s+/, ''), `${i}-${j}`)}
            </li>
          ))}
        </ul>
      )
    }

    if (lines.length > 0 && lines.every(l => /^\d+\.\s/.test(l.trim()) || l.trim() === '')) {
      return (
        <ol key={i} style={{ paddingLeft: 22, marginBottom: 14 }}>
          {lines.filter(l => /^\d+\.\s/.test(l.trim())).map((l, j) => (
            <li key={j} style={{ marginBottom: 6, lineHeight: 1.65 }}>
              {renderInline(l.replace(/^\d+\.\s+/, ''), `${i}-${j}`)}
            </li>
          ))}
        </ol>
      )
    }

    return (
      <p key={i} style={{ marginBottom: 14, lineHeight: 1.75 }}>
        {renderInline(block, String(i))}
      </p>
    )
  })
}

/**
 * Derive a title for PDF/text export from the study's opening line,
 * stripping any Markdown heading markers and bold markers.
 */
function deriveTitle(body) {
  const firstLine = body.split('\n').find(l => l.trim().length > 0)
  if (!firstLine) return 'HymnTrails Study'
  const cleaned = firstLine.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim()
  return cleaned.length > 4 ? cleaned.slice(0, 80) : 'HymnTrails Study'
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

      <article style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, lineHeight: 1.75, color: 'var(--ink)' }}>
        {renderMarkdown(body)}
        {streaming && !echo && (
          <span style={{ opacity: 0.5, fontFamily: 'Inter, sans-serif', fontSize: 13 }}>▍ writing…</span>
        )}
      </article>

      {echo && (
        <div style={{
          marginTop: 28,
          background: 'linear-gradient(135deg, var(--gold-pale), var(--white))',
          border: '2px solid var(--gold)', borderRadius: 12,
          padding: '20px 22px', position: 'relative',
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
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16.5, lineHeight: 1.75, color: 'var(--ink)', marginTop: 10 }}>
            {renderMarkdown(echo)}
          </div>
        </div>
      )}

      {!streaming && (
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
          <StudyActions content={content} title={deriveTitle(body)} />
        </div>
      )}

      {!streaming && (
        <div style={{
          marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)',
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
