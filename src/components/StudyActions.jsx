import { useState, useRef, useEffect } from 'react'
// jsPDF is dynamically imported inside downloadPdf() below, not here —
// it pulls in html2canvas and adds ~230KB to the bundle, so it's only
// loaded on demand when someone actually clicks "Download PDF" rather
// than on every page load.

/**
 * Strips the 🎵 MODERN ECHO marker formatting for plain-text export
 * (PDF, .txt, print, copy) so exported files read cleanly without
 * leftover emoji-marker artifacts from the in-app visual treatment.
 */
function cleanForExport(content) {
  return content.replace(/🎵\s*MODERN ECHO/i, '\n\nMODERN ECHO\n').trim()
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 60) || 'hymntrails-study'
}

function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

async function downloadPdf(content, title) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const marginLeft = 56
  const marginRight = 56
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const usableWidth = pageWidth - marginLeft - marginRight
  let y = 64

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  const titleLines = doc.splitTextToSize(title, usableWidth)
  doc.text(titleLines, marginLeft, y)
  y += titleLines.length * 20 + 12

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  const lineHeight = 15

  const paragraphs = content.split(/\n{2,}/)
  for (const para of paragraphs) {
    const lines = doc.splitTextToSize(para, usableWidth)
    for (const line of lines) {
      if (y > pageHeight - 64) {
        doc.addPage()
        y = 64
      }
      doc.text(line, marginLeft, y)
      y += lineHeight
    }
    y += lineHeight * 0.6
  }

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.setTextColor(120, 110, 95)
  const footerY = pageHeight - 36
  doc.text(
    'HymnTrails — verify every reference against your own Bible and hymnal before teaching from it.',
    marginLeft, footerY
  )

  doc.save(`${slugify(title)}.pdf`)
}

function printStudy(content, title) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return
  const escaped = content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  const html = `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>
          body {
            font-family: Georgia, 'Times New Roman', serif;
            max-width: 680px;
            margin: 48px auto;
            color: #2a2620;
            line-height: 1.6;
            font-size: 14px;
          }
          h1 { font-size: 22px; margin-bottom: 24px; }
          p { margin: 0 0 14px; white-space: pre-wrap; }
          footer {
            margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd4c2;
            font-size: 11px; font-style: italic; color: #6b6458;
          }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${escaped.split(/\n{2,}/).map(p => `<p>${p}</p>`).join('\n')}
        <footer>HymnTrails — verify every reference against your own Bible and hymnal before teaching from it.</footer>
      </body>
    </html>
  `
  printWindow.document.write(html)
  printWindow.document.close()
  printWindow.focus()
  setTimeout(() => printWindow.print(), 250)
}

function ActionButton({ children, onClick, primary }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '8px 14px', borderRadius: 6,
        border: `1.5px solid ${primary ? 'var(--gold)' : 'var(--border)'}`,
        background: primary ? 'var(--gold-pale)' : 'var(--white)',
        color: primary ? 'var(--navy)' : 'var(--ink-light)',
        fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: primary ? 600 : 500,
        cursor: 'pointer', whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

export default function StudyActions({ content, title }) {
  const [saveOpen, setSaveOpen] = useState(false)
  const [copyLabel, setCopyLabel] = useState('Copy')
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setSaveOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const cleaned = cleanForExport(content)
  const exportTitle = title || 'HymnTrails Study'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleaned)
      setCopyLabel('Copied ✓')
      setTimeout(() => setCopyLabel('Copy'), 1800)
    } catch {
      setCopyLabel('Copy failed')
      setTimeout(() => setCopyLabel('Copy'), 1800)
    }
  }

  return (
    <div style={{ display: 'flex', gap: 10, position: 'relative' }} ref={menuRef}>
      <div style={{ position: 'relative' }}>
        <ActionButton primary onClick={() => setSaveOpen(o => !o)}>
          Save {saveOpen ? '▴' : '▾'}
        </ActionButton>

        {saveOpen && (
          <div style={{
            position: 'absolute', top: '110%', left: 0, zIndex: 10,
            background: 'var(--white)', border: '1.5px solid var(--border)',
            borderRadius: 8, boxShadow: '0 6px 20px rgba(0,0,0,0.12)',
            minWidth: 180, overflow: 'hidden',
          }}>
            {[
              { label: 'Download PDF', action: async () => { setSaveOpen(false); await downloadPdf(cleaned, exportTitle) } },
              { label: 'Download Text', action: () => { downloadTextFile(cleaned, `${slugify(exportTitle)}.txt`); setSaveOpen(false) } },
              { label: 'Print', action: () => { printStudy(cleaned, exportTitle); setSaveOpen(false) } },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '10px 14px', border: 'none', background: 'none',
                  fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'var(--ink)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--gold-pale)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <ActionButton onClick={handleCopy}>{copyLabel}</ActionButton>
    </div>
  )
}
