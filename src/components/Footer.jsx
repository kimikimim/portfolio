export default function Footer() {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      color: 'var(--muted)',
      fontSize: '0.85rem',
      borderTop: '1px solid var(--border)',
    }}>
      Built by <strong style={{ color: 'var(--text)' }}>kimikimim</strong>
      &nbsp;·&nbsp;
      <a href="https://github.com/kimikimim" target="_blank" rel="noreferrer">GitHub</a>
    </footer>
  )
}
