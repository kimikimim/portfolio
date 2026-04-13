import { Link } from 'react-router-dom'
import CodeBlock from '../../components/CodeBlock'
import styles from './TopicLayout.module.css'
import s from '../Section.module.css'

const DIFFICULTY_LABEL = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }

export default function TopicLayout({ data }) {
  const easy   = data.problems.filter(p => p.difficulty === 'easy').length
  const medium = data.problems.filter(p => p.difficulty === 'medium').length
  const hard   = data.problems.filter(p => p.difficulty === 'hard').length

  return (
    <section className={s.page}>
      <div className={s.inner}>
        <Link to="/coding-test" className={styles.back}>← 코딩테스트</Link>

        <div className={styles.topHeader}>
          <span className={styles.topIcon}>{data.icon}</span>
          <div>
            <h2 className={styles.topTitle}>{data.title}</h2>
            <p className={styles.topDesc}>{data.desc}</p>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{data.problems.length}</span>
            <span className={styles.statLabel}>풀이</span>
          </div>
          <div className={styles.divider} />
          <div className={styles.statItem}>
            <span className={`${styles.statNum} ${styles.easy}`}>{easy}</span>
            <span className={styles.statLabel}>Easy</span>
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.statNum} ${styles.medium}`}>{medium}</span>
            <span className={styles.statLabel}>Medium</span>
          </div>
          <div className={styles.statItem}>
            <span className={`${styles.statNum} ${styles.hard}`}>{hard}</span>
            <span className={styles.statLabel}>Hard</span>
          </div>
        </div>

        <div className={styles.problems}>
          {data.problems.map((problem, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardMeta}>
                  <span className={styles.index}>#{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={styles.problemTitle}>{problem.title}</h3>
                  <span className={`${styles.badge} ${styles[problem.difficulty]}`}>
                    {DIFFICULTY_LABEL[problem.difficulty]}
                  </span>
                </div>
                {problem.link && (
                  <a
                    href={problem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.platformLink}
                  >
                    {problem.platform} ↗
                  </a>
                )}
              </div>

              <p className={styles.explanation}>{problem.explanation}</p>

              {problem.approach && (
                <div className={styles.approachBox}>
                  <span className={styles.approachLabel}>💡 접근 방식</span>
                  <p>{problem.approach}</p>
                </div>
              )}

              <CodeBlock code={problem.code} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
