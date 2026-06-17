import { useState } from 'react'
import { generateStudy } from '../lib/generateStudy'
import FontSizeToggle from './FontSizeToggle'

const STUDY_TYPES = [
  { value: 'hymn', label: 'Hymn Study', desc: 'Trace one hymn\'s scripture, doctrine, and story' },
  { value: 'passage', label: 'Passage + Hymns', desc: 'A scripture passage paired with hymns that echo it' },
  { value: 'doctrine', label: 'Doctrine in Song', desc: 'Trace a doctrine through scripture and hymnody' },
  { value: 'topical', label: 'Topical Study', desc: 'A theme explored across scripture and song' },
]

const AUDIENCE = [
  { value: 'beginner', label: 'New Believers' },
  { value: 'general', label: 'General Adult' },
  { value: 'deeper', label: 'Deeper Study' },
  { value: 'small_group', label: 'Small Group' },
  { value: 'choir', label: 'Choir / Worship Team' },
]

const TRANSLATIONS = [
  { value: 'web', label: 'WEB', full: 'World English Bible (default)' },
  { value: 'kjv', label: 'KJV', full: 'King James Version' },
  { value: 'asv', label: 'ASV', full: 'American Standard Version' },
]

const PLACEHOLDERS = {
  hymn: 'e.g. Amazing Grace, A Mighty Fortress, In Christ Alone',
  passage: 'e.g. Psalm 23, Psalm 46, John 3:16',
  doctrine: 'e.g. Justification, Sanctification, the Trinity',
  topical: 'e.g. Grace, Lament, the Holy Spirit, Resurrection Hope',
}

const PRIMARY_LABELS = {
  hymn: 'Hymn or Song Title',
  passage: 'Scripture Passage',
  doctrine: 'Doctrine',
  topical: 'Topic or Theme',
}

function Label({ children, required }) {
  return (
    <label style={{
      display: 'block', fontFamily: 'Inter, sans-serif', fontSize: 10,
      fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
      color: 'var(--ink-light)', marginBottom: 7,
    }}>
      {children}{required && <span style={{ color: 'var(--gold)', marginLeft: 3 }}>*</span>}
    </label>
  )
}

function Input({ value, onChange, placeholder, multiline, rows = 3 }) {
  const style = {
    width: '100%', padding: '10px 12px', fontFamily: 'Inter, sans-serif',
    fontSize: 14, color: 'var(--ink)', background: 'var(--white)',
    border: '1.5px solid var(--border)', borderRadius: 6, outline: 'none',
    transition: 'border-color 0.15s', resize: multiline ? 'vertical' : 'none',
  }
  const handlers = {
    onFocus: e => { e.target.style.borderColor = 'var(--gold)'; e.target.style.boxShadow = '0 0 0 3px rgba(196,150,42,0.12)' },
    onBlur: e => { e.target.style.borderColor = 'var(--border)'; e.target.style.boxShadow = 'none' },
  }
  return multiline
    ? <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows} style={style} {...handlers} />
    : <input value={value} onChange={onChange} placeholder={placeholder} style={style} {...handlers} />
}

function Chip({ label, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '6px 14px', borderRadius: 20,
      border: `1.5px solid ${selected ? 'var(--gold)' : 'var(--border)'}`,
      background: selected ? 'var(--gold)' : 'var(--white)',
      color: selected ? 'var(--white)' : 'var(--ink-light)',
      fontFamily: 'Inter, sans-serif', fontSize: 12.5,
      fontWeight: selected ? 600 : 400, cursor: 'pointer',
      transition: 'all 0.15s', whiteSpace: 'nowrap',
    }}>{label}</button>
  )
}

function TypeCard({ type, selected, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '13px 15px', borderRadius: 8,
      border: `2px solid ${selected ? 'var(--gold)' : 'var(--border)'}`,
      background: selected ? 'var(--gold-pale)' : 'var(--white)',
      textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s', width: '100%',
    }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: selected ? 'var(--navy)' : 'var(--ink)', marginBottom: 2 }}>
        {type.label}
      </div>
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'var(--ink-light)' }}>
        {type.desc}
      </div>
    </button>
  )
}

function Divider({ label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '28px 0 20px' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      {label && <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-light)', whiteSpace: 'nowrap' }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}

const LOADING_MESSAGES = [
  'Opening the hymnal…',
  'Tracing the melody back to scripture…',
  'Consulting the cross-references…',
  'Finding a song for today…',
  'Tuning the harmony…',
]

export default function StudyForm({ onStudy, onStream, onDone, error, setError, enlarged, onToggleEnlarge }) {
  const [studyType, setStudyType] = useState('hymn')
  const [primaryInput, setPrimaryInput] = useState('')
  const [audience, setAudience] = useState('general')
  const [translation, setTranslation] = useState('web')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState(0)

  const handleGenerate = async () => {
    if (!primaryInput.trim()) {
      setError('Please enter a hymn, passage, doctrine, or topic for the study.')
      return
    }
    setError(null)
    setLoading(true)

    let msgIndex = 0
    const interval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length
      setLoadingMsg(msgIndex)
    }, 2500)

    try {
      const params = { studyType, primaryInput, audience, translation, notes }

      let started = false
      await generateStudy(params, (text) => {
        if (!started) {
          started = true
          onStream(text)
        } else {
          onStudy(text)
        }
      })
      onDone()
    } catch (e) {
      setError(e.message || 'Something went wrong. Please try again.')
      onStudy(null)
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const fontScale = enlarged ? 1.15 : 1

  return (
    <div style={{ zoom: fontScale }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <FontSizeToggle enlarged={enlarged} onToggle={onToggleEnlarge} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <Label required>Study Type</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
          {STUDY_TYPES.map(t => (
            <TypeCard key={t.value} type={t} selected={studyType === t.value} onClick={() => setStudyType(t.value)} />
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <Label required>{PRIMARY_LABELS[studyType]}</Label>
        <Input value={primaryInput} onChange={e => setPrimaryInput(e.target.value)} placeholder={PLACEHOLDERS[studyType]} />
      </div>

      <Divider label="Audience & Translation" />

      <div style={{ marginBottom: 18 }}>
        <Label>Audience</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {AUDIENCE.map(a => <Chip key={a.value} label={a.label} selected={audience === a.value} onClick={() => setAudience(a.value)} />)}
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <Label>Translation</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {TRANSLATIONS.map(t => <Chip key={t.value} label={t.label} selected={translation === t.value} onClick={() => setTranslation(t.value)} />)}
        </div>
        <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'var(--ink-light)', marginTop: 6 }}>
          {TRANSLATIONS.find(t => t.value === translation)?.full}
        </div>
      </div>

      <div style={{ marginBottom: 22 }}>
        <Label>Notes for the Study</Label>
        <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="Specific angles, an occasion (funeral, baptism, Advent)…" multiline rows={3} />
      </div>

      <div style={{
        background: 'var(--gold-pale)',
        border: '1px dashed var(--gold)',
        borderRadius: 8,
        padding: '10px 14px',
        marginBottom: 22,
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
        color: 'var(--ink-light)',
      }}>
        🎵 Every study closes with a <strong style={{ color: 'var(--ink)' }}>Modern Echo</strong> —
        a contemporary song from the 20th or 21st century that resonates with the same truth.
      </div>

      {error && (
        <div style={{ background: 'var(--error-bg)', border: '1px solid #E8B89A', borderRadius: 6, padding: '10px 14px', marginBottom: 16, fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'var(--error)' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading}
        style={{
          width: '100%', padding: '15px',
          background: loading ? 'var(--navy-light)' : 'var(--navy)',
          color: 'var(--white)', border: 'none', borderRadius: 6,
          fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer', letterSpacing: '0.03em',
          transition: 'background 0.15s',
        }}
      >
        {loading ? (
          <span>{LOADING_MESSAGES[loadingMsg]}</span>
        ) : (
          <span>Generate Hymn Study →</span>
        )}
      </button>

      <p style={{ textAlign: 'center', fontFamily: 'Inter, sans-serif', fontSize: 11, color: 'var(--ink-light)', marginTop: 12, lineHeight: 1.5 }}>
        Follows broad ecumenical consensus · Verify all references · Sing along with your hymnal open
      </p>
    </div>
  )
}
