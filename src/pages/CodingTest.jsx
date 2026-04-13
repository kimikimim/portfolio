import { useNavigate } from 'react-router-dom'
import styles from './Section.module.css'
import s from './CodingTest.module.css'

const TOPICS = [
  {
    icon: '📊',
    title: '자료구조',
    desc: '스택, 큐, 트리, 그래프, 힙',
    badge: '완료',
    type: 'green',
    slug: 'data-structure',
    solved: 5,
    total: 5,
  },
  {
    icon: '🔍',
    title: '탐색 / 정렬',
    desc: 'BFS, DFS, 이진탐색, 정렬 알고리즘',
    badge: '완료',
    type: 'green',
    slug: 'search-sort',
    solved: 5,
    total: 5,
  },
  {
    icon: '💡',
    title: 'DP / 그리디',
    desc: '동적 프로그래밍, 그리디 전략',
    badge: '완료',
    type: 'green',
    slug: 'dp-greedy',
    solved: 5,
    total: 5,
  },
  {
    icon: '🏆',
    title: 'PS 풀이 모음',
    desc: '백준, 프로그래머스 풀이 아카이브',
    badge: '진행중',
    type: 'blue',
    slug: 'ps-collection',
    solved: 5,
    total: 15,
  },
  {
    icon: '🔗',
    title: '그래프 심화',
    desc: '위상정렬, 최단경로, 최소신장트리',
    badge: '완료',
    type: 'green',
    slug: 'graph-advanced',
    solved: 4,
    total: 4,
  },
  {
    icon: '🧩',
    title: '구현 / 시뮬레이션',
    desc: '삼성 코테 유형, 완전탐색',
    badge: '완료',
    type: 'green',
    slug: 'implementation',
    solved: 4,
    total: 4,
  },
]

export default function CodingTest() {
  const navigate = useNavigate()

  const totalSolved   = TOPICS.reduce((acc, t) => acc + t.solved, 0)
  const totalProblems = TOPICS.reduce((acc, t) => acc + t.total, 0)

  return (
    <section id="coding-test" className={styles.pageAlt}>
      <div className={styles.inner}>
        <h2 className={styles.title}>
          <span className={styles.tag}>#</span> 코딩테스트
        </h2>
        <p className={styles.desc}>알고리즘 풀이 및 문제 유형 정리</p>

        {/* 전체 진행률 */}
        <div className={s.overallProgress}>
          <div className={s.overallTop}>
            <span className={s.overallLabel}>전체 풀이 현황</span>
            <span className={s.overallCount}>
              <span className={s.overallNum}>{totalSolved}</span> / {totalProblems}
            </span>
          </div>
          <div className={s.progressTrack}>
            <div
              className={s.progressFill}
              style={{ width: `${(totalSolved / totalProblems) * 100}%` }}
            />
          </div>
        </div>

        <div className={s.grid}>
          {TOPICS.map(({ icon, title, desc, badge, type, slug, solved, total }) => (
            <div
              key={title}
              className={s.card}
              onClick={() => navigate(`/coding-test/${slug}`)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate(`/coding-test/${slug}`)}
            >
              <div className={s.cardTop}>
                <div className={s.icon}>{icon}</div>
                <span className={`${s.badge} ${s[type]}`}>{badge}</span>
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>

              <div className={s.progress}>
                <div className={s.progressMeta}>
                  <span className={s.progressLabel}>풀이 완료</span>
                  <span className={s.progressCount}>{solved} / {total}</span>
                </div>
                <div className={s.progressTrack}>
                  <div
                    className={`${s.progressFill} ${s[`fill_${type}`]}`}
                    style={{ width: `${(solved / total) * 100}%` }}
                  />
                </div>
              </div>

              <span className={s.viewMore}>풀이 보기 →</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
