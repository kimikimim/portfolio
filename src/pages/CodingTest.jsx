import styles from './Section.module.css'
import s from './CodingTest.module.css'

const TOPICS = [
  { icon: '📊', title: '자료구조',   desc: '스택, 큐, 트리, 그래프, 힙',              badge: '정리중', type: 'green' },
  { icon: '🔍', title: '탐색 / 정렬', desc: 'BFS, DFS, 이진탐색, 정렬 알고리즘',      badge: '작성중', type: 'blue' },
  { icon: '💡', title: 'DP / 그리디', desc: '동적 프로그래밍, 그리디 전략',            badge: '예정',   type: 'yellow' },
  { icon: '🏆', title: 'PS 풀이 모음', desc: '백준, 프로그래머스 풀이 아카이브',       badge: '예정',   type: 'yellow' },
  { icon: '🔗', title: '그래프 심화', desc: '위상정렬, 최단경로, 최소신장트리',        badge: '예정',   type: 'yellow' },
  { icon: '🧩', title: '구현 / 시뮬레이션', desc: '삼성 코테 유형, 완전탐색',         badge: '예정',   type: 'yellow' },
]

export default function CodingTest() {
  return (
    <section id="coding-test" className={styles.pageAlt}>
      <div className={styles.inner}>
        <h2 className={styles.title}><span className={styles.tag}>#</span> 코딩테스트</h2>
        <p className={styles.desc}>알고리즘 풀이 및 문제 유형 정리</p>

        <div className={s.grid}>
          {TOPICS.map(({ icon, title, desc, badge, type }) => (
            <div key={title} className={s.card}>
              <div className={s.icon}>{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span className={`${s.badge} ${s[type]}`}>{badge}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
