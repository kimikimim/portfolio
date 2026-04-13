import { Link } from 'react-router-dom'
import CodeBlock from '../../components/CodeBlock'
import styles from './SecurityLayout.module.css'
import s from '../Section.module.css'

const DIFFICULTY_LABEL = { medium: 'Medium', hard: 'Hard', expert: 'Expert' }

export default function SecurityLayout({ data }) {
  return (
    <section className={s.page}>
      <div className={s.inner}>
        <Link to="/personal-study" className={styles.back}>← 개인공부</Link>

        <div className={styles.topHeader}>
          <span className={styles.topIcon}>{data.icon}</span>
          <div>
            <h2 className={styles.topTitle}>{data.title}</h2>
            <p className={styles.topDesc}>{data.desc}</p>
          </div>
        </div>

        <div className={styles.statsRow}>
          {data.stats.map((stat, i) => (
            <div key={i} className={styles.statItem}>
              <span className={styles.statNum}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.topics}>
          {data.topics.map((topic, i) => (
            <div key={i} className={styles.topicCard}>
              <div className={styles.topicHeader}>
                <div className={styles.topicMeta}>
                  <span className={styles.index}>#{String(i + 1).padStart(2, '0')}</span>
                  <h3 className={styles.topicTitle}>{topic.title}</h3>
                  <span className={`${styles.badge} ${styles[topic.difficulty]}`}>
                    {DIFFICULTY_LABEL[topic.difficulty]}
                  </span>
                  {topic.cve && (
                    <span className={styles.cve}>{topic.cve}</span>
                  )}
                </div>
                {topic.tool && (
                  <span className={styles.toolBadge}>{topic.tool}</span>
                )}
              </div>

              <p className={styles.explanation}>{topic.explanation}</p>

              {topic.theory && (
                <div className={styles.theoryBox}>
                  <span className={styles.theoryLabel}>📐 이론</span>
                  <p dangerouslySetInnerHTML={{ __html: topic.theory }} />
                </div>
              )}

              {topic.steps && (
                <ol className={styles.steps}>
                  {topic.steps.map((step, j) => (
                    <li key={j}>{step}</li>
                  ))}
                </ol>
              )}

              <CodeBlock code={topic.code} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
