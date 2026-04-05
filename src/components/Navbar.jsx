import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Navbar.module.css'

const LINKS = [
  { label: '프로젝트',   to: '/projects' },
  { label: '코딩테스트', to: '/coding-test' },
  { label: '코딩 면접',  to: '/interview' },
  { label: 'AI 비교',    to: '/ai-compare' },
  { label: '고딩 필독',  to: '/dev-reads' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location])

  return (
    <nav className={`${styles.nav} ${scrolled || location.pathname !== '/' ? styles.scrolled : ''}`}>
      <NavLink to="/" className={styles.logo}>
        <span className={styles.bracket}>&lt;</span>
        kimikimim
        <span className={styles.bracket}> /&gt;</span>
      </NavLink>

      <ul className={`${styles.links} ${open ? styles.open : ''}`}>
        {LINKS.map(({ label, to }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <button className={styles.hamburger} onClick={() => setOpen(o => !o)}>
        {open ? '✕' : '☰'}
      </button>
    </nav>
  )
}
