import { useState } from 'react'
import styles from './Section.module.css'
import s from './Projects.module.css'

export default function Projects() {
  const [username, setUsername] = useState('')
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    if (!username.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`https://api.github.com/users/${username.trim()}/repos?sort=updated&per_page=12`)
      if (!res.ok) throw new Error('유저를 찾을 수 없습니다.')
      const data = await res.json()
      setRepos(data)
    } catch (e) {
      setError(e.message)
      setRepos([])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') load() }

  const LANG_COLOR = {
    Python: '#3572A5', JavaScript: '#f1e05a', TypeScript: '#3178c6',
    Go: '#00ADD8', Rust: '#dea584', Java: '#b07219', 'C++': '#f34b7d',
    HTML: '#e34c26', CSS: '#563d7c', Shell: '#89e051',
  }

  return (
    <section id="projects" className={styles.page}>
      <div className={styles.inner}>
        <h2 className={styles.title}><span className={styles.tag}>#</span> 프로젝트</h2>
        <p className={styles.desc}>GitHub 레포지토리를 불러와 보여줍니다.</p>

        <div className={s.inputRow}>
          <input
            className={s.input}
            type="text"
            placeholder="GitHub 유저명 입력 (예: torvalds)"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className={s.btn} onClick={load} disabled={loading}>
            {loading ? '불러오는 중...' : '불러오기'}
          </button>
        </div>

        {error && <p className={s.error}>{error}</p>}

        {repos.length === 0 && !loading && !error && (
          <div className={s.placeholder}>GitHub 유저명을 입력하면 레포지토리가 자동으로 표시됩니다.</div>
        )}

        <div className={s.grid}>
          {repos.map(repo => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className={s.card}
            >
              <div className={s.repoName}>{repo.name}</div>
              <p className={s.repoDesc}>{repo.description || '설명 없음'}</p>
              <div className={s.meta}>
                {repo.language && (
                  <span className={s.lang}>
                    <span
                      className={s.langDot}
                      style={{ background: LANG_COLOR[repo.language] || '#8b949e' }}
                    />
                    {repo.language}
                  </span>
                )}
                {repo.stargazers_count > 0 && <span>⭐ {repo.stargazers_count}</span>}
                {repo.forks_count > 0 && <span>🍴 {repo.forks_count}</span>}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
