export default function FontSizeToggle({ enlarged, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enlarged}
      title={enlarged ? 'Switch to standard text size' : 'Switch to larger text size'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 12px',
        borderRadius: 999,
        border: '1px solid var(--border)',
        background: enlarged ? 'var(--gold-pale)' : 'var(--white)',
        color: enlarged ? 'var(--navy)' : 'var(--ink-light)',
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.03em',
        cursor: 'pointer',
        transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: 14, lineHeight: 1 }}>
        A{enlarged ? '+' : ''}
      </span>
      {enlarged ? 'Larger Text' : 'Standard Text'}
    </button>
  )
}
